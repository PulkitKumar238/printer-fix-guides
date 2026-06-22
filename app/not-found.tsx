import Link from 'next/link';
import { allGuides } from '@/content/guides';

export default function NotFound() {
  return (
    <div className="container-page py-20 text-center">
      <p className="font-mono text-sm font-medium uppercase tracking-wide text-amber">
        Error 404
      </p>
      <h1 className="mt-3 text-4xl font-bold sm:text-5xl">This page jammed</h1>
      <p className="mx-auto mt-4 max-w-md text-lg text-slate">
        We couldn’t find that page. It may have moved, or the link was mistyped.
        Try one of the guides below.
      </p>
      <div className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-2">
        {allGuides.map((g) => (
          <Link
            key={g.slug}
            href={`/${g.slug}`}
            className="focus-ring rounded-full border border-ink/15 bg-surface px-4 py-2 text-sm font-medium text-ink hover:border-amber hover:text-amber"
          >
            {g.shortTitle}
          </Link>
        ))}
      </div>
      <Link
        href="/"
        className="focus-ring mt-8 inline-block rounded-full bg-amber px-6 py-3 font-medium text-surface hover:bg-amber/90"
      >
        Back to home
      </Link>
    </div>
  );
}
