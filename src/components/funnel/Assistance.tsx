import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MessageCircle, Phone, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BigButton } from "./Shell";
import { openTawkChat } from "@/lib/tawk-chat";
import {
  CALLBACK_RECIPIENT_EMAIL, brandName, issueLabel,
  isValidPhone, type FunnelSession,
} from "@/lib/funnel";

const PHONE_COUNTRIES = [
  { value: "nz", name: "New Zealand", code: "+64" },
  { value: "us", name: "United States", code: "+1" },
  { value: "uk", name: "United Kingdom", code: "+44" },
  { value: "ca", name: "Canada", code: "+1" },
  { value: "au", name: "Australia", code: "+61" },
] as const;

export function Assistance({ prominent = true, onTryAgain }: { prominent?: boolean; onTryAgain?: () => void }) {
  const navigate = useNavigate();
  const [chatStatus, setChatStatus] = useState<"idle" | "loading" | "error">("idle");

  const startChat = async () => {
    if (chatStatus === "loading") return;
    setChatStatus("loading");
    const opened = await openTawkChat();
    setChatStatus(opened ? "idle" : "error");
  };

  return (
    <section className={`mt-8 ${prominent ? "" : "border-t border-border pt-6"}`}>
      <h2 className="text-2xl font-bold text-foreground">Need a Hand?</h2>
      <p className="mt-1 text-lg text-muted-foreground">Your selected printer details are included below.</p>
      <div className={`mt-5 grid gap-4 ${onTryAgain ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        <OptionCard Icon={MessageCircle} title="Live Chat" desc="Chat with a specialist now." onClick={startChat} />
        <OptionCard Icon={Phone} title="Request Call Back" desc="We'll call you with your details ready." onClick={() => navigate({ to: "/guide/callback" })} />
        {onTryAgain && <OptionCard Icon={RotateCcw} title="Try Again" desc="Choose a different brand or model." onClick={onTryAgain} />}
      </div>
      {chatStatus === "loading" && <p className="mt-4 text-muted-foreground" role="status">Connecting to live chat…</p>}
      {chatStatus === "error" && <p className="mt-4 text-destructive" role="alert">Live chat couldn’t load. Please try again or check your connection.</p>}
    </section>
  );
}

function OptionCard({ Icon, title, desc, onClick }: { Icon: typeof Phone; title: string; desc: string; onClick: () => void }) {
  return (
    <Button variant="outline" type="button" onClick={onClick} className="flex h-full min-h-48 w-full flex-col items-center whitespace-normal rounded-md border-2 border-border bg-card p-5 text-center transition-colors hover:border-primary [&_svg]:size-7">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground"><Icon className="h-7 w-7" aria-hidden /></span>
      <span className="mt-3 text-xl font-bold text-foreground">{title}</span>
      <span className="mt-1 text-base text-muted-foreground">{desc}</span>
    </Button>
  );
}

export function CallbackForm({ session, update }: { session: FunnelSession; update: (p: Partial<FunnelSession>) => void }) {
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<(typeof PHONE_COUNTRIES)[number]["value"]>("nz");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(session.callbackSent ? "done" : "idle");
  const [err, setErr] = useState("");
  const honey = useRef<HTMLInputElement>(null);
  const started = useRef(Date.now());

  if (status === "done")
    return (
      <div className="mt-6 flex items-start gap-3 rounded-2xl bg-background p-5">
        <CheckCircle2 className="mt-1 h-7 w-7 shrink-0 text-success" />
        <div>
          <p className="text-xl font-bold text-foreground">Callback requested</p>
          <p className="text-lg text-muted-foreground">Thank you. A specialist will call you. Your reference: <strong>{session.sessionId}</strong></p>
        </div>
      </div>
    );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (status === "sending") return;
    if (honey.current?.value || Date.now() - started.current < 2000) return; // basic spam guard
    if (!isValidPhone(phone)) return setErr("Please enter a valid phone number.");
    if (!consent) return setErr("Please tick the box to agree to a callback.");
    if (!CALLBACK_RECIPIENT_EMAIL) return setErr("Callback requests are not set up yet. Please use live chat or try again later.");

    setStatus("sending");
    const selectedCountry = PHONE_COUNTRIES.find((option) => option.value === country) ?? PHONE_COUNTRIES[0];
    const payload: Record<string, string> = {
      _subject: `New NextGuide Callback Request — ${brandName(session.brand)} ${session.model ?? ""}`.trim(),
      _template: "table",
      "Phone number": `${selectedCountry.code} ${phone.trim()}`,
      "Selected country": selectedCountry.name,
      "Original issue": issueLabel(session.issue),
      "Printer brand": brandName(session.brand),
      "Printer model": session.model ?? "-",
      "Device type": session.device ?? "-",
      "Connection type": session.connection ?? "-",
      Result: session.result ?? "Not answered",
      "Date and time": new Date().toLocaleString(),
      "Session ID": session.sessionId,
    };
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CALLBACK_RECIPIENT_EMAIL)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || (data.success !== true && data.success !== "true")) throw new Error();
      update({ callbackSent: true });
      setStatus("done");
    } catch {
      setStatus("error");
      setErr("We couldn't send your request. Please try again.");
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl bg-background p-5" noValidate>
      <input ref={honey} name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="block">
        <span className="text-lg font-semibold text-foreground">Choose Country</span>
        <select value={country} onChange={(event) => setCountry(event.target.value as (typeof PHONE_COUNTRIES)[number]["value"])} className="mt-2 h-16 w-full rounded-xl border-2 border-input bg-background px-4 text-xl text-foreground focus:border-primary focus:outline-none">
          {PHONE_COUNTRIES.map((option) => <option key={option.value} value={option.value}>{option.name} {option.code}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="text-lg font-semibold text-foreground">Phone Number <span className="text-destructive">*</span></span>
        <input type="tel" inputMode="tel" autoComplete="tel" required maxLength={20} value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 h-16 w-full rounded-xl border-2 border-input bg-background px-4 text-xl focus:border-primary focus:outline-none" />
      </label>
      <label className="flex items-start gap-3 text-lg text-foreground">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-6 w-6 accent-[var(--primary)]" />
        I agree to receive a phone call about my printer-assistance request.
      </label>
      {err && <p className="text-lg text-destructive" role="alert">{err}</p>}
      <BigButton type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : status === "error" ? "Try Again" : "Request My Callback"}</BigButton>
    </form>
  );
}
