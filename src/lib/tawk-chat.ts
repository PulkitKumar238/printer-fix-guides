export const TAWK_SCRIPT_URL = "https://embed.tawk.to/6a9c539cd01cf0344798af34/1k1pad7r2";

export function chatAllowed(pathname: string): boolean {
  return /^\/guide\/(model|steps)\/?$/.test(pathname);
}

type TawkAPI = {
  onBeforeLoad?: () => void;
  onLoad?: () => void;
  onChatMessageAgent?: (message: unknown) => void;
  maximize?: () => void;
  minimize?: () => void;
  isChatMaximized?: () => boolean;
  showWidget?: () => void;
  hideWidget?: () => void;
};

type ChatState = {
  ready: boolean;
  allowed: boolean;
  failed: boolean;
  pending: Set<(opened: boolean) => void>;
};

declare global {
  interface Window {
    Tawk_API?: TawkAPI;
    Tawk_LoadStart?: Date;
    nextGuideTawk?: ChatState;
  }
}

function maximize(state: ChatState) {
  const api = window.Tawk_API;
  // Read the live address too: agent callbacks must never use stale route state.
  if (!state.ready || !state.allowed || !chatAllowed(window.location.pathname) || !api?.maximize) return false;
  api.showWidget?.();
  if (!api.isChatMaximized?.()) api.maximize();
  return true;
}

function settle(state: ChatState, opened: boolean) {
  for (const resolve of state.pending) resolve(opened);
  state.pending.clear();
}

/** Called after hydration and immediately before client-side navigation. */
export function syncTawkRoute(pathname: string) {
  if (typeof window === "undefined") return;
  const allowed = chatAllowed(pathname);
  let state = window.nextGuideTawk;
  if (!state && !allowed) return; // No script or API on initial excluded pages.
  if (!state) {
    state = { ready: false, allowed, failed: false, pending: new Set() };
    window.nextGuideTawk = state;
    const chat = state;
    const api = window.Tawk_API = window.Tawk_API || {};
    api.onBeforeLoad = () => { api.hideWidget?.(); };
    api.onLoad = () => {
      chat.ready = true;
      chat.failed = false;
      if (chat.allowed && chatAllowed(window.location.pathname)) {
        if (chat.pending.size) settle(chat, maximize(chat));
        else if (/^\/guide\/model\/?$/.test(window.location.pathname)) maximize(chat);
        else { api.showWidget?.(); api.minimize?.(); }
      } else {
        api.hideWidget?.();
        settle(chat, false);
      }
    };
    api.onChatMessageAgent = () => { maximize(chat); };
    window.Tawk_LoadStart = new Date();
    if (!document.querySelector(`script[src="${TAWK_SCRIPT_URL}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = TAWK_SCRIPT_URL;
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");
      script.onerror = () => { chat.failed = true; settle(chat, false); };
      document.head.appendChild(script);
    }
  }
  state.allowed = allowed;
  if (!allowed) {
    window.Tawk_API?.hideWidget?.();
    settle(state, false);
  } else if (state.ready) {
    if (/^\/guide\/model\/?$/.test(pathname)) maximize(state);
    else window.Tawk_API?.showWidget?.();
  }
}

/** Opens the real conversation, queuing the request while the widget loads. */
export async function openTawkChat(): Promise<boolean> {
  if (typeof window === "undefined" || !chatAllowed(window.location.pathname)) return false;
  syncTawkRoute(window.location.pathname);
  const state = window.nextGuideTawk;
  if (!state || state.failed) return false;
  if (state.ready) return maximize(state);
  return new Promise((resolve) => {
    const finish = (opened: boolean) => {
      window.clearTimeout(timeout);
      state.pending.delete(finish);
      resolve(opened);
    };
    const timeout = window.setTimeout(() => finish(false), 20000);
    state.pending.add(finish);
  });
}
