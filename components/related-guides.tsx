import Link from 'next/link';
import type { RelatedLink } from '@/lib/types';

/** Internal cross-links to related problem guides. */
export function RelatedGuides({ links, heading = 'Related guides' }: { links: RelatedLink[]; heading?: string }) {
  return (
    <section aria-labelledby="related-heading" className="mt-12">
      <h2 id="related-heading" className="mb-5 text-2xl font-bold sm:text-3xl">
        {heading}
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="focus-ring group flex flex-col rounded-2xl border border-ink/10 bg-surface p-5 shadow-card transition-shadow hover:shadow-card-hover"
          >
            <span className="font-slab text-lg font-bold text-ink group-hover:text-amber">
              {link.title}
            </span>
            <span className="mt-1 text-sm leading-relaxed text-slate">{link.description}</span>
            <span className="mt-3 text-sm font-medium text-amber">Read guide →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
