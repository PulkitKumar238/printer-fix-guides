import type { DiagnosticStep } from '@/lib/types';
import { ContentBlocks } from './content-blocks';
import { GuideImage } from './guide-image';

/**
 * DiagnosticSteps — the site’s signature UI element. A vertical numbered
 * tracker that visually communicates "do these in order". Each step is an
 * anchor target (#step-N) so the HowTo schema can deep-link to it.
 */
export function DiagnosticSteps({
  steps,
  startImagePriority = false,
}: {
  steps: DiagnosticStep[];
  /** Mark the first step image as priority (above the fold). */
  startImagePriority?: boolean;
}) {
  return (
    <ol className="relative space-y-10" aria-label="Step-by-step fix">
      {steps.map((step, i) => {
        const num = i + 1;
        const isLast = i === steps.length - 1;
        return (
          <li
            key={i}
            id={`step-${num}`}
            className="relative scroll-mt-24 pl-14 sm:pl-16"
          >
            {/* Connector line down to the next step */}
            {!isLast && (
              <span
                aria-hidden
                className="absolute left-[1.1875rem] top-12 bottom-[-2.5rem] w-px bg-ink/15 sm:left-[1.4375rem]"
              />
            )}

            {/* Number marker */}
            <span
              aria-hidden
              className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-ink font-slab text-lg font-bold text-paper shadow-card sm:h-12 sm:w-12 sm:text-xl"
            >
              {num}
            </span>

            <div className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-card sm:p-6">
              <div className="mb-1 flex items-baseline gap-2">
                <span className="font-mono text-xs font-medium uppercase tracking-wide text-amber">
                  Step {num} of {steps.length}
                </span>
              </div>
              <h3 className="mb-2 text-xl font-bold sm:text-2xl">{step.title}</h3>
              <p className="mb-4 text-[1.05rem] font-medium text-ink/80">
                {step.summary}
              </p>

              <ContentBlocks blocks={step.body} />

              {step.image && (
                <GuideImage
                  image={step.image}
                  priority={startImagePriority && i === 0}
                />
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
