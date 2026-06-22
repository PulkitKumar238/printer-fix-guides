import type { Guide } from '@/lib/types';
import { Breadcrumbs } from './breadcrumbs';
import { ContentBlocks } from './content-blocks';
import { DiagnosticSteps } from './diagnostic-steps';
import { CommonCauses } from './common-causes';
import { Faq } from './faq';
import { RelatedGuides } from './related-guides';
import { JsonLd } from './json-ld';
import { Icon } from './icons';
import { guideSchemas } from '@/lib/schema';

/** Full layout for a single problem guide page. */
export function GuideTemplate({ guide }: { guide: Guide }) {
  return (
    <article className="container-page py-8 sm:py-10">
      <JsonLd data={guideSchemas(guide)} />

      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: guide.shortTitle }]} />

      {/* Full-width header — sits above the grid so both columns start at the same level */}
      <header className="mt-4">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber/10 px-3 py-1 text-sm font-medium text-amber">
          <Icon name={guide.icon} className="h-4 w-4" />
          Troubleshooting guide
          <span className="text-amber/50">·</span>
          <span className="font-mono text-xs">{guide.readTime} read</span>
        </div>
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem]">
          {guide.title}
        </h1>
      </header>

      {/* Intro + sidebar — both columns start at the same vertical level */}
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
        <div className="min-w-0">
          <div>
            <ContentBlocks blocks={guide.intro} />
          </div>

          {/* Diagnostic steps — the signature element */}
          <section aria-labelledby="steps-heading" className="mt-10">
            <h2 id="steps-heading" className="mb-2 text-2xl font-bold sm:text-3xl">
              Step-by-step fix
            </h2>
            <p className="mb-6 max-w-prose text-slate">
              Work through these in order and test after each step — you can stop
              as soon as the printer is working again.
            </p>
            <DiagnosticSteps steps={guide.steps} startImagePriority />
          </section>

          <Faq items={guide.faqs} />
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <CommonCauses causes={guide.commonCauses} />
          <nav aria-label="On this page" className="mt-6 rounded-2xl border border-ink/10 bg-surface p-5 shadow-card">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate">
              The steps
            </h2>
            <ol className="space-y-2 text-sm">
              {guide.steps.map((step, i) => (
                <li key={i}>
                  <a href={`#step-${i + 1}`} className="flex gap-2 text-ink/80 hover:text-amber">
                    <span className="font-mono text-amber">{i + 1}.</span>
                    {step.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
      </div>

      <RelatedGuides links={guide.related} />
    </article>
  );
}
