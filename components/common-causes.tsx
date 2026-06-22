import type { Guide } from '@/lib/types';

/** Sidebar / section listing the common causes behind a problem. */
export function CommonCauses({ causes }: { causes: Guide['commonCauses'] }) {
  return (
    <section aria-labelledby="causes-heading" className="rounded-2xl border border-ink/10 bg-surface p-5 shadow-card sm:p-6">
      <h2 id="causes-heading" className="mb-1 text-xl font-bold">
        Common causes
      </h2>
      <p className="mb-4 text-sm text-slate">
        What’s usually behind this problem, most likely first.
      </p>
      <ul className="space-y-4">
        {causes.map((cause, i) => (
          <li key={i} className="border-l-2 border-amber/50 pl-3">
            <p className="font-semibold text-ink">{cause.title}</p>
            <p className="text-[0.95rem] leading-relaxed text-slate">{cause.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
