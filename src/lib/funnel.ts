import { useCallback, useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/* CONFIGURATION — fill these in when ready                            */
/* ------------------------------------------------------------------ */

/** Email that receives callback requests via formsubmit.co. Leave empty until provided. */
export const CALLBACK_RECIPIENT_EMAIL = "leads1928@gmail.com";

/* ------------------------------------------------------------------ */

export const BRANDS = [
  { id: "hp", name: "HP", example: "DeskJet 2755e" },
  { id: "canon", name: "Canon", example: "PIXMA TS3522" },
  { id: "epson", name: "Epson", example: "EcoTank ET-2800" },
  { id: "brother", name: "Brother", example: "HL-L2350DW" },
  { id: "other", name: "Other", example: "the model name on your printer" },
] as const;
export type BrandId = (typeof BRANDS)[number]["id"];

export const ISSUES: Record<string, string> = {
  offline: "Printer Offline",
  wifi: "Wi-Fi Drops",
  "not-printing": "Printer Not Printing",
  "not-working": "Printer Not Working",
  "not-connecting": "Printer Not Connecting",
  driver: "Driver Problems",
  setup: "New Printer Setup",
  scanner: "Scanner Issues",
  other: "Other Printer Issue",
};

export const issueLabel = (slug?: string) =>
  (slug && ISSUES[slug]) || (slug ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Printer Issue");
export const isSetupIssue = (slug?: string) => slug === "setup" || slug === "new-printer-setup";
/** Additional manufacturers recognized from the printer catalog (not shown as big choice buttons). */
const EXTRA_BRANDS: Record<string, string> = {
  samsung: "Samsung", xerox: "Xerox", lexmark: "Lexmark", ricoh: "Ricoh", kyocera: "Kyocera", pantum: "Pantum",
};
export const brandName = (id?: string) => BRANDS.find((b) => b.id === id)?.name ?? (id ? EXTRA_BRANDS[id] ?? "" : "");

export type FunnelSession = {
  sessionId: string;
  issue?: string | undefined;
  brand?: BrandId | undefined;
  model?: string | undefined;
  device?: string | undefined;
  connection?: string | undefined;
  result?: string | undefined;
  callbackSent?: boolean;
};

const KEY = "nextguide-session";

function newId() {
  const r = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `NG-${Date.now().toString(36).toUpperCase().slice(-5)}-${r}`;
}

function read(): FunnelSession {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const s = { sessionId: newId() };
  try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  return s;
}

export function useFunnel() {
  const [session, setSession] = useState<FunnelSession | null>(null);
  useEffect(() => setSession(read()), []);
  const update = useCallback((patch: Partial<FunnelSession>) => {
    const next = { ...read(), ...patch };
    try { sessionStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    setSession(next);
  }, []);
  return { session, update };
}

export function sessionSummary(s: FunnelSession) {
  const setup = isSetupIssue(s.issue);
  return [
    ["Issue", issueLabel(s.issue)],
    ["Journey", setup ? "New Printer Setup" : "Printer Troubleshooting"],
    ["Printer brand", brandName(s.brand)],
    ["Printer model", s.model ?? ""],
    ...(setup ? [["Device", s.device ?? ""]] : []),
    ["Connection", s.connection ?? ""],
    [setup ? "Setup result" : "Test result", s.result ?? "Not answered"],
    ["Reference ID", s.sessionId],
  ] as [string, string][];
}

export const summaryText = (s: FunnelSession) =>
  sessionSummary(s).map(([k, v]) => `${k}: ${v || "-"}`).join("\n");

export const PHONE_RE = /^\+?[0-9\s().-]{7,20}$/;
export function isValidPhone(p: string) {
  const digits = p.replace(/\D/g, "");
  return PHONE_RE.test(p.trim()) && digits.length >= 7 && digits.length <= 15;
}
