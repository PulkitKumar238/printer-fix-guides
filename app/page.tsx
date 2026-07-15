import Link from 'next/link';
import Image from 'next/image';
import { allGuides } from '@/content/guides';
import { allBrands } from '@/content/brands';
import { errorCodes } from '@/content/errors';
import { SearchBar } from '@/components/search-bar';
import { IssueCard } from '@/components/issue-card';
import { Icon } from '@/components/icons';
import { pageMetadata } from '@/lib/metadata';
import { site } from '@/lib/site';

export const metadata = pageMetadata({
  title: `${site.name} — Fix Common Printer Problems, Step by Step`,
  description: site.description,
  path: '/',
});

const popularCodes = errorCodes.slice(0, 6);

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink/10">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber/10 blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-ink/5 blur-2xl" />
        <div className="container-page relative py-6 sm:py-10 lg:py-14">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Printer playing up?{' '}
              <span className="text-amber">Let’s fix it.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-slate">
              Plain-English, step-by-step guides for the printer problems people
              actually have — offline errors, missing drivers, dropped Wi-Fi, jams,
              and brand-specific error codes. No jargon, no upsells.
            </p>
            <div className="mx-auto mt-10 max-w-2xl">
              <SearchBar />
              <p className="mt-4 text-base text-slate">
                Try offline, wifi drops, paper jam, or an error code.
              </p>
            </div>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/diagnose"
                className="focus-ring inline-flex w-full items-center justify-center rounded-full bg-amber px-8 py-4 text-lg font-semibold text-surface shadow-card-hover transition-all hover:-translate-y-0.5 hover:bg-amber/90 sm:w-auto"
              >
                Find my fix →
              </Link>
              <Link
                href="/diagnose?issue=setup"
                className="focus-ring inline-flex w-full items-center justify-center rounded-full border border-ink/15 bg-surface px-8 py-4 text-lg font-semibold text-ink shadow-card transition-all hover:-translate-y-0.5 hover:border-ink/30 sm:w-auto"
              >
                Browse guides
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-ink/10 shadow-card-hover">
              <Image
                src="/images/site/hero.jpg"
                alt="A home-office desk with an all-in-one printer"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 64rem"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Choose your issue */}
      <section aria-labelledby="issues-heading" className="container-page py-20 sm:py-24">
        <div className="mb-10 max-w-2xl">
          <h2 id="issues-heading" className="text-4xl font-bold sm:text-5xl">
            Choose your issue
          </h2>
          <p className="mt-4 text-xl text-slate">
            Pick the problem that matches what you’re seeing. Each guide walks you
            through the fix from the most likely cause down.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {allGuides.map((guide) => {
            // Setup, offline, and scanner jump straight into the diagnose flow (brand step).
            const toDiagnose = ['setup', 'offline', 'scanner'].includes(guide.slug);
            return (
              <IssueCard
                key={guide.slug}
                href={toDiagnose ? `/diagnose?issue=${guide.slug}` : `/${guide.slug}`}
                icon={guide.icon}
                title={guide.shortTitle}
                description={guide.cardDescription}
              />
            );
          })}
          <Link
            href="/errors"
            className="focus-ring group flex h-full flex-col justify-between rounded-2xl border border-dashed border-amber/40 bg-amber/[0.04] p-6 transition-colors hover:bg-amber/[0.08]"
          >
            <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-amber/10 text-amber">
              <Icon name="error" className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-xl font-bold text-ink">Look up an error code</h3>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-slate">
                Got a code on the screen like 5100, 0x97, or B200? Find what it means.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 font-medium text-amber">
                Browse codes <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Browse by brand */}
      <section aria-labelledby="brands-heading" className="border-y border-ink/10 bg-surface/60">
        <div className="container-page py-20 sm:py-24">
          <div className="mb-10 max-w-2xl">
            <h2 id="brands-heading" className="text-4xl font-bold sm:text-5xl">
              Browse by brand
            </h2>
            <p className="mt-4 text-xl text-slate">
              Each brand has its own quirks and error codes. Jump to a hub for
              the issues most common to your make.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {allBrands.map((brand) => (
              <Link
                key={brand.key}
                href={`/brands/${brand.key}`}
                className="focus-ring group flex items-center justify-between rounded-2xl border border-ink/10 bg-surface p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <span>
                  <span className="block font-slab text-2xl font-bold text-ink group-hover:text-amber">
                    {brand.name}
                  </span>
                  <span className="text-sm text-slate">Printer help</span>
                </span>
                <span aria-hidden className="text-2xl text-amber transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular error codes */}
      <section aria-labelledby="codes-heading" className="container-page py-20 sm:py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 id="codes-heading" className="text-4xl font-bold sm:text-5xl">
              Common error codes
            </h2>
            <p className="mt-4 text-xl text-slate">
              The exact code on your printer’s screen is the fastest route to a fix.
            </p>
          </div>
          <Link href="/errors" className="font-medium text-amber hover:underline">
            See all {errorCodes.length} codes →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {popularCodes.map((code) => (
            <Link
              key={code.code}
              href={`/errors/${code.code.toLowerCase()}`}
              className="focus-ring group flex items-center gap-4 rounded-xl border border-ink/10 bg-surface p-4 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <span className="grid h-11 shrink-0 place-items-center rounded-lg bg-ink/5 px-3 font-mono text-sm font-medium text-ink">
                {code.code}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium text-ink group-hover:text-amber">
                  {code.title}
                </span>
                <span className="text-xs uppercase tracking-wide text-slate">{code.brand}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

    </>
  );
}
