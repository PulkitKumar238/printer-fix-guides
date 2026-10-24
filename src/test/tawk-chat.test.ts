import { beforeEach, describe, expect, it, vi } from "vitest";
import { chatAllowed, openTawkChat, syncTawkRoute, TAWK_SCRIPT_URL } from "@/lib/tawk-chat";

beforeEach(() => {
  delete window.nextGuideTawk;
  delete window.Tawk_API;
  document.head.querySelectorAll('script[src*="embed.tawk.to"]').forEach((script) => script.remove());
  window.history.replaceState({}, "", "/");
});

function visit(path: string) {
  window.history.replaceState({}, "", path);
  syncTawkRoute(path);
}

function ready() {
  const api = window.Tawk_API;
  if (!api) throw new Error("Widget was not initialized");
  api.maximize = vi.fn();
  api.minimize = vi.fn();
  api.showWidget = vi.fn();
  api.hideWidget = vi.fn();
  api.isChatMaximized = vi.fn(() => false);
  api.onLoad?.();
  return api;
}

describe("Tawk.to route and message rules", () => {
  it("never initializes chat on the homepage or brand selection", () => {
    for (const path of ["/", "/guide/select/setup", "/guide/select/offline"]) {
      visit(path);
      expect(window.Tawk_API).toBeUndefined();
      expect(document.querySelector('script[src*="embed.tawk.to"]')).toBeNull();
      expect(chatAllowed(path)).toBe(false);
    }
  });
  it("loads the exact widget once from the model page and retains it on support steps", () => {
    visit("/guide/model");
    const api = ready();
    visit("/guide/steps");
    expect(chatAllowed("/guide/model")).toBe(true);
    expect(chatAllowed("/guide/steps")).toBe(true);
    expect(document.querySelectorAll(`script[src="${TAWK_SCRIPT_URL}"]`)).toHaveLength(1);
    expect(TAWK_SCRIPT_URL).toBe("https://embed.tawk.to/6a9c539cd01cf0344798af34/1k1pad7r2");
    expect(api.maximize).toHaveBeenCalledTimes(1);
    expect(api.minimize).not.toHaveBeenCalled();
  });
  it("maximizes once on an agent message only when minimized on an eligible route", () => {
    visit("/guide/steps");
    const api = ready();
    api.onChatMessageAgent?.({ text: "Agent reply" });
    expect(api.maximize).toHaveBeenCalledTimes(1);
    api.isChatMaximized = () => true;
    api.onChatMessageAgent?.({ text: "Another reply" });
    expect(api.maximize).toHaveBeenCalledTimes(1);
    api.isChatMaximized = () => false;
    window.history.replaceState({}, "", "/");
    api.onChatMessageAgent?.({ text: "Reply during route change" });
    expect(api.maximize).toHaveBeenCalledTimes(1);
    expect(Object.keys(api)).not.toContain("onChatMessageVisitor");
  });
  it("hides immediately on exclusion and reuses callbacks on return", () => {
    visit("/guide/model");
    const api = ready();
    const callback = api.onChatMessageAgent;
    visit("/guide/select/setup");
    expect(api.hideWidget).toHaveBeenCalledTimes(1);
    visit("/guide/model");
    expect(api.showWidget).toHaveBeenCalledTimes(2);
    expect(api.maximize).toHaveBeenCalledTimes(2);
    expect(api.onChatMessageAgent).toBe(callback);
  });
  it("waits for widget readiness before opening a requested conversation", async () => {
    visit("/guide/steps");
    const opening = openTawkChat();
    const api = ready();
    await expect(opening).resolves.toBe(true);
    expect(api.maximize).toHaveBeenCalledTimes(1);
  });
  it("keeps chat hidden if navigation leaves the model page while loading", () => {
    visit("/guide/model");
    visit("/guide/select/setup");
    const api = ready();
    expect(api.showWidget).not.toHaveBeenCalled();
    expect(api.hideWidget).toHaveBeenCalledTimes(1);
    expect(api.maximize).not.toHaveBeenCalled();
  });
});
