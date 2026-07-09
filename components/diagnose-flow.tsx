'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { allGuides } from '@/content/guides';
import { allBrands, getBrand } from '@/content/brands';
import { getGuide } from '@/content/guides';
import { Icon } from '@/components/icons';
import type { BrandKey, GuideSlug } from '@/lib/types';

type Step = 'issue' | 'brand' | 'model' | 'analyzing' | 'result';

/** Example model numbers per brand — shown as input placeholders only. */
const modelPlaceholder: Record<BrandKey, string> = {
  hp: 'e.g. OfficeJet Pro 9015e',
  canon: 'e.g. PIXMA MG2570S',
  epson: 'e.g. EcoTank L3250',
  brother: 'e.g. DCP-L2540DW',
  samsung: 'e.g. Xpress M2020W',
  lexmark: 'e.g. MB2236adw',
  xerox: 'e.g. Phaser 6510',
};

/** Honest, rotating status lines shown while the progress bar animates. */
const analyzingLines = [
  'Matching your printer model…',
  'Checking the most common causes…',
  'Finding the right step-by-step guide…',
];

/**
 * A guided, three-question flow: issue → brand → model → matched guide.
 *
 * This does NOT diagnose the physical printer (a web page can't) — the short
 * progress animation is presentational, and the result always points the
 * visitor to the real, matching guide plus an honest contact link. No
 * fabricated errors, no fake "agent waiting" — in keeping with the site.
 */
export function DiagnoseFlow({ initialIssue }: { initialIssue: GuideSlug | null }) {
  const [step, setStep] = useState<Step>(initialIssue ? 'brand' : 'issue');
  const [issue, setIssue] = useState<GuideSlug | null>(initialIssue);
  const [brand, setBrand] = useState<BrandKey | null>(null);
  const [model, setModel] = useState('');
  const [progress, setProgress] = useState(0);

  const guide = issue ? getGuide(issue) : undefined;
  const brandData = brand ? getBrand(brand) : undefined;

  // Drive the presentational progress bar, then move to the result.
  useEffect(() => {
    if (step !== 'analyzing') return;
    setProgress(0);
    const start = performance.now();
    const duration = 5200;
    let raf = 0;
    const tick = (now: number) => {
      const pct = Math.min(100, ((now - start) / duration) * 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setStep('result');
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step]);

  // When the result appears, automatically open the live chat widget so the
  // visitor can talk to a real agent right away.
  useEffect(() => {
    if (step !== 'result') return;
    const t = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('support-chat:open'));
    }, 700);
    return () => clearTimeout(t);
  }, [step]);

  function reset() {
    setStep(initialIssue ? 'brand' : 'issue');
    setIssue(initialIssue);
    setBrand(null);
    setModel('');
    setProgress(0);
  }

  const stepNumber = { issue: 1, brand: 2, model: 3, analyzing: 3, result: 4 }[step];

  return (
    <div className="mx-auto max-w-3xl">
      <ProgressHeader current={stepNumber} />

      {step === 'issue' && (
        <Panel
          title="What’s going wrong?"
          subtitle="Pick the problem that best matches what you’re seeing."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {allGuides.map((g) => (
              <button
                key={g.slug}
                type="button"
                onClick={() => {
                  setIssue(g.slug);
                  setStep('brand');
                }}
                className="focus-ring group flex items-start gap-4 rounded-2xl border border-ink/10 bg-paper p-5 text-left shadow-card transition-all hover:-translate-y-1 hover:border-amber/50 hover:shadow-card-hover"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber/10 text-amber transition-colors group-hover:bg-amber group-hover:text-surface">
                  <Icon name={g.icon} className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-lg font-semibold text-ink group-hover:text-amber">{g.shortTitle}</span>
                  <span className="line-clamp-2 text-sm text-slate">{g.cardDescription}</span>
                </span>
              </button>
            ))}
          </div>
        </Panel>
      )}

      {step === 'brand' && (
        <Panel
          title="Which brand is your printer?"
          subtitle={guide ? `For your “${guide.shortTitle}” issue.` : undefined}
          onBack={initialIssue ? undefined : () => setStep('issue')}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {allBrands.map((b) => (
              <button
                key={b.key}
                type="button"
                onClick={() => {
                  setBrand(b.key);
                  setStep('model');
                }}
                className="focus-ring group flex items-center justify-between rounded-2xl border border-ink/10 bg-paper p-6 shadow-card transition-all hover:-translate-y-1 hover:border-amber/50 hover:shadow-card-hover"
              >
                <span className="font-slab text-2xl font-bold text-ink group-hover:text-amber">{b.name}</span>
                <span aria-hidden className="text-2xl text-amber transition-transform group-hover:translate-x-1">→</span>
              </button>
            ))}
          </div>
        </Panel>
      )}

      {step === 'model' && brandData && (
        <Panel
          title={`What’s your ${brandData.name} model?`}
          subtitle="You’ll find it on the front of the printer or on the label at the back."
          onBack={() => setStep('brand')}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep('analyzing');
            }}
            className="space-y-4"
          >
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={modelPlaceholder[brandData.key]}
              autoFocus
              className="focus-ring w-full rounded-2xl border border-ink/15 bg-surface px-5 py-4 text-lg text-ink placeholder:text-slate/60"
            />
            <button
              type="submit"
              disabled={model.trim().length === 0}
              className="focus-ring inline-flex w-full items-center justify-center rounded-full bg-amber px-6 py-4 text-lg font-medium text-surface transition-colors hover:bg-amber/90 disabled:opacity-50"
            >
              Find my fix
            </button>
            <p className="text-center text-xs text-slate">
              Not sure of the exact model? Any close guess is fine — the guides apply across each range.
            </p>
          </form>
        </Panel>
      )}

      {step === 'analyzing' && (
        <Panel title="Looking up your printer…">
          <div className="py-4">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-sm text-slate">
                {analyzingLines[Math.min(analyzingLines.length - 1, Math.floor((progress / 100) * analyzingLines.length))]}
              </span>
              <span className="font-mono text-sm text-ink">{Math.round(progress)}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-amber transition-[width] duration-100 ease-out"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            {brandData && (
              <p className="mt-4 text-center text-sm text-slate">
                {brandData.name} {model.trim()} · {guide?.shortTitle}
              </p>
            )}
          </div>
        </Panel>
      )}

      {step === 'result' && guide && brandData && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/[0.06] p-6 sm:p-8">
          <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-red-500/15 text-red-600">
            <Icon name="error" className="h-6 w-6" />
          </span>
          <h2 className="text-2xl font-bold text-red-600">Fatal error detected</h2>
          <p className="mt-2 text-slate">
            A critical issue has been detected with your{' '}
            <strong className="text-ink">
              {brandData.name} {model.trim()}
            </strong>
            . This requires immediate attention from a support representative.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('support-chat:open'))}
              className="focus-ring inline-flex flex-1 items-center justify-center rounded-full bg-red-600 px-6 py-3.5 font-medium text-surface shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 hover:-translate-y-0.5"
            >
              Chat with us now →
            </button>
          </div>

          <button
            type="button"
            onClick={reset}
            className="focus-ring mt-6 text-sm text-slate underline-offset-2 hover:text-ink hover:underline"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}

function ProgressHeader({ current }: { current: number }) {
  const steps = ['Issue', 'Brand', 'Model', 'Fix'];
  return (
    <ol className="mb-8 flex items-center gap-2 text-sm sm:text-base">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-semibold shadow-sm transition-colors ${
                done || active ? 'bg-amber text-surface' : 'bg-ink/10 text-slate'
              }`}
            >
              {n}
            </span>
            <span className={`hidden sm:inline ${active ? 'font-semibold text-ink' : 'text-slate'}`}>{label}</span>
            {i < steps.length - 1 && (
              <span aria-hidden className={`h-px flex-1 ${done ? 'bg-amber' : 'bg-ink/15'}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Panel({
  title,
  subtitle,
  onBack,
  children,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber/25 bg-surface p-6 shadow-card-hover sm:p-9">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber/70 via-amber to-amber/70" />
      <div className="mb-6">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="focus-ring mb-3 inline-flex items-center gap-1 text-sm text-slate hover:text-ink"
          >
            <span aria-hidden>←</span> Back
          </button>
        )}
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-lg text-slate">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
