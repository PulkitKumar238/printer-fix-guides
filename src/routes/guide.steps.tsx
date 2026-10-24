import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { CircleX } from "lucide-react";
import { BigButton, Choice, Summary } from "@/components/funnel/Shell";
import { Assistance } from "@/components/funnel/Assistance";
import { ProgressRing } from "@/components/funnel/ProgressRing";
import { SupportHeader, BreadcrumbBar, SupportFooter } from "@/components/funnel/SupportChrome";
import { brandName, isSetupIssue, issueLabel, useFunnel, type FunnelSession } from "@/lib/funnel";

export const Route = createFileRoute("/guide/steps")({
  head: () => ({
    meta: [
      { title: "Guided Printer Help | NextGuide" },
      { name: "description", content: "Get a clear status for your printer issue and connect with a support specialist." },
      { property: "og:title", content: "Guided Printer Help | NextGuide" },
      { property: "og:description", content: "Get a clear status for your printer issue and connect with a support specialist." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StepsPage,
});

const CONNECTIONS = ["Wi-Fi", "USB Cable", "Not Sure"];
const DEVICES = ["Windows Computer", "Mac Computer", "Phone / Tablet", "Not Sure"];

import { PROCESS_DURATION_MS, PROCESS_MESSAGES, retryPatch } from "@/lib/support-flow";
export { VERIFIED_CORRUPTED_SYSTEM_FILES_ERROR } from "@/lib/support-flow";

function StepsPage() {
  const { session, update } = useFunnel();
  const [step, setStep] = useState(0);
  const next = useCallback(() => setStep((s) => s + 1), []);
  const back = () => setStep((s) => Math.max(0, s - 1));

  if (!session) {
    return (
      <div className="min-h-screen w-full bg-background">
        <div className="mx-auto w-full max-w-4xl px-6 py-24 text-center">
          <p className="text-lg text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }
  if (!session.issue || !session.brand || !session.model) {
    return (
      <div className="min-h-screen w-full bg-background">
        <div className="mx-auto w-full max-w-4xl px-6 py-24 text-center">
          <p className="text-xl">Please <Link to="/" className="text-primary underline">start from the beginning</Link>.</p>
        </div>
      </div>
    );
  }

  const setup = isSetupIssue(session.issue);
  const steps = buildSteps(session, update, next, setup);
  const current = steps[Math.min(step, steps.length - 1)];

  return (
    <div data-printer-brand={session.brand} className="printer-brand-theme min-h-screen w-full bg-background">
      <SupportHeader brand={session.brand} />

      {/* Brand-colored breadcrumb bar — color preserved from the model page */}
      <BreadcrumbBar brand={session.brand}>
        Home <span className="mx-2">›</span> Printer Support <span className="mx-2">›</span> {issueLabel(session.issue)}
      </BreadcrumbBar>

      <main className="w-full px-6 py-10 sm:px-10 sm:py-14">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-primary">
              Issue: {issueLabel(session.issue)}
            </span>
            <span className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-primary">
              {session.model.toLowerCase().startsWith(brandName(session.brand).toLowerCase())
                ? session.model
                : `${brandName(session.brand)} ${session.model}`}
            </span>
          </div>

          <p className="mb-2 text-base font-semibold text-primary">
            Step {Math.min(step, steps.length - 1) + 1} of {steps.length}
          </p>
          {current}
          {step > 0 && step < steps.length - 1 && (
            <button onClick={back} className="mt-6 block w-full text-center text-lg text-primary hover:underline">← Back</button>
          )}
          {step === 0 && <Link to="/guide/model" className="mt-6 block text-center text-lg text-primary hover:underline">← Back</Link>}
        </div>
      </main>

      <SupportFooter />
    </div>
  );
}

type U = (p: Partial<FunnelSession>) => void;

function buildSteps(s: FunnelSession, update: U, next: () => void, setup: boolean) {
  const steps = setup
    ? [
        <Ask key="d" q="What device are you connecting your printer to?" options={DEVICES} value={s.device} onPick={(v) => { update({ device: v }); next(); }} />,
        <Ask key="c" q="How would you like to connect your printer?" options={CONNECTIONS} value={s.connection} onPick={(v) => { update({ connection: v }); next(); }} />,
        <div key="sum">
          <h1 className="mb-6 text-3xl font-bold text-foreground">Your Setup Summary</h1>
          <Summary rows={[["Journey", "New Printer Setup"], ["Brand", brandName(s.brand)], ["Model", s.model ?? ""], ["Device", s.device ?? ""], ["Connection", s.connection ?? ""]]} />
          <BigButton className="mt-6" onClick={next}>Continue</BigButton>
        </div>,
      ]
    : [
        <Ask key="c" q="How is your printer connected?" options={CONNECTIONS} value={s.connection} onPick={(v) => { update({ connection: v }); next(); }} />,
        <div key="sum">
          <h1 className="mb-6 text-3xl font-bold text-foreground">Your Printer Summary</h1>
          <Summary rows={[["Issue", issueLabel(s.issue)], ["Brand", brandName(s.brand)], ["Model", s.model ?? ""], ["Connection", s.connection ?? ""]]} />
          <BigButton className="mt-6" onClick={next}>Continue</BigButton>
        </div>,
      ];
  steps.push(<GuidedProcess key="process" s={s} update={update} />);
  return steps;
}

function Ask({ q, options, value, onPick }: { q: string; options: string[]; value?: string | undefined; onPick: (v: string) => void }) {
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-foreground">{q}</h1>
      <div className="space-y-3">
        {options.map((o) => <Choice key={o} selected={value === o} onClick={() => onPick(o)}>{o}</Choice>)}
      </div>
    </>
  );
}

/*
 * Step 4 (Req 7–9): 30-second circular progress with rotating messages,
 * then a completion status panel, then the Need a Hand? support options.
 */
function GuidedProcess({ s, update }: { s: FunnelSession; update: U }) {
  const [done, setDone] = useState(false);
  const nav = useNavigate();
  // Try Again: keep the issue, clear brand + model, return to brand selection.
  const tryAgain = () => {
    update(retryPatch);
    nav({ to: "/guide/select/$issue", params: { issue: s.issue ?? "other" } });
  };

  if (!done) {
    return (
      <div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">Printer Setup &amp; Troubleshooting</h1>
        <p className="text-lg text-muted-foreground">
          Please keep this page open while we prepare setup and troubleshooting steps.
        </p>
        <ProgressRing
          messages={PROCESS_MESSAGES}
          doneText="Complete"
          durationMs={PROCESS_DURATION_MS}
          onDone={() => { update({ result: "Guided review completed; no device scan performed" }); setDone(true); }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 rounded-xl border border-border bg-card p-5" aria-label="Sample error design preview">
        <div className="flex items-center gap-4">
          <CircleX className="h-8 w-8 shrink-0 text-destructive" aria-hidden />
          <p className="text-lg font-bold text-foreground sm:text-xl">Fatal System Error - <span className="text-destructive">0xC0000142</span> - Installation Aborted</p>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Example error display — no printer scan was performed.</p>
      </div>
      {/* Need a Hand? heading + Live Chat / Request Call Back (Req 9) */}
      <Assistance session={s} update={update} onTryAgain={tryAgain} />
    </div>
  );
}
