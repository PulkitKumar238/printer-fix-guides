import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { progressAt } from "@/lib/support-flow";

export function ProgressRing({ messages, doneText, onDone, durationMs = 4000 }: { messages: string[]; doneText: string; onDone?: () => void; durationMs?: number }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => {
      const p = progressAt(Date.now() - start, durationMs).percentage;
      setPct(p);
      if (p >= 100) clearInterval(t);
    }, 50);
    return () => clearInterval(t);
  }, [durationMs]);
  useEffect(() => {
    if (pct >= 100 && onDone) {
      const t = setTimeout(onDone, 0);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [pct, onDone]);

  const r = 70, c = 2 * Math.PI * r;
  const msg = messages[Math.min(messages.length - 1, Math.floor((pct / 100) * messages.length))];
  return (
    <div className="flex flex-col items-center py-6 text-center" role="status" aria-live="polite">
      <div className="relative h-48 w-48" role="progressbar" aria-label="Guided process progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
      <svg width="192" height="192" viewBox="0 0 180 180" className="-rotate-90">
        <circle cx="90" cy="90" r={r} fill="none" stroke="var(--muted)" strokeWidth="12" />
        <circle cx="90" cy="90" r={r} fill="none" stroke="var(--support-progress)" strokeWidth="12" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c} className="transition-[stroke-dashoffset] duration-75 motion-reduce:transition-none" />
      </svg>
      <p className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-foreground">{pct}%</p>
      </div>
      {pct < 100 ? (
        <p className="mt-6 text-xl text-muted-foreground">{msg}</p>
      ) : (
        <p className="mt-6 flex items-center gap-2 text-2xl font-bold text-foreground">
          <CheckCircle2 className="h-7 w-7 text-success" /> {doneText}
        </p>
      )}
    </div>
  );
}
