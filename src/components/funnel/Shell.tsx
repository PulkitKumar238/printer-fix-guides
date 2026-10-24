import type { ReactNode } from "react";
import { Printer } from "lucide-react";

export function Shell({ issue, children }: { issue?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-2xl px-5 py-8 sm:py-12">
        {issue && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-primary/20 bg-accent px-5 py-4">
            <Printer className="h-6 w-6 shrink-0 text-primary" aria-hidden />
            <p className="text-lg text-foreground">
              Your Selected Issue: <strong className="text-primary">{issue}</strong>
            </p>
          </div>
        )}
        {children}
      </main>
      <footer className="pb-8 text-center text-sm text-muted-foreground">
        Independent printer assistance. Not affiliated with any printer manufacturer.
      </footer>
    </div>
  );
}

export function BigButton({ children, variant = "primary", className = "", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  const v = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-soft)]",
    secondary: "border-2 border-primary bg-background text-primary hover:bg-accent",
    ghost: "text-primary underline-offset-4 hover:underline",
  }[variant];
  return (
    <button {...p} className={`flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl px-6 text-xl font-semibold transition-colors disabled:opacity-40 ${v} ${className}`}>
      {children}
    </button>
  );
}

export function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex min-h-20 w-full items-center justify-center rounded-2xl border-2 px-5 text-xl font-semibold transition-all ${
        selected ? "border-primary bg-accent text-primary ring-4 ring-primary/15" : "border-border bg-card text-foreground hover:border-primary/50"
      }`}
    >
      {children}
    </button>
  );
}

export function Summary({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="divide-y divide-border rounded-2xl border border-border bg-card">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 px-5 py-4 text-lg">
          <dt className="text-muted-foreground">{k}</dt>
          <dd className="text-right font-semibold text-foreground">{v || "-"}</dd>
        </div>
      ))}
    </dl>
  );
}
