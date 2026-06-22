import type { FaqItem } from '@/lib/types';

/**
 * FAQ rendered with native <details> for accessible, JS-free expand/collapse.
 * The matching FAQPage JSON-LD is emitted separately from the same data.
 */
export function Faq({ items, heading = 'Frequently asked questions' }: { items: FaqItem[]; heading?: string }) {
  return (
    <section aria-labelledby="faq-heading" className="mt-12">
      <h2 id="faq-heading" className="mb-5 text-2xl font-bold sm:text-3xl">
        {heading}
      </h2>
      <div className="divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-card">
        {items.map((item, i) => (
          <details key={i} className="group px-5 py-4 sm:px-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-slab text-lg font-semibold text-ink focus-ring rounded">
              {item.question}
              <span
                aria-hidden
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ink/20 text-amber transition-transform group-open:rotate-45"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M7 1v12M1 7h12" />
                </svg>
              </span>
            </summary>
            <p className="mt-3 text-[1.0125rem] leading-relaxed text-slate">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
