import Link from 'next/link';
import { allGuides } from '@/content/guides';
import { allBrands } from '@/content/brands';
import { errorCodes } from '@/content/errors';
import { site } from '@/lib/site';

// Full-bleed wrapper: spreads footer content across the whole viewport width
// with comfortable edge padding, rather than the narrow centred column.
const wrap = 'mx-auto w-full px-6 sm:px-10 lg:px-16';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-ink/10 bg-ink text-paper">
      <div className={`${wrap} grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-8`}>
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-paper/10 text-paper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="4" y="9" width="16" height="8" rx="1.5" />
                <path d="M7 9V5h10v4M7 17v2h10v-2" />
                <circle cx="16.5" cy="12.5" r="0.9" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <span className="font-slab text-base font-bold">
              Printer<span className="text-amber">Fix</span>
            </span>
          </Link>
          <p className="mt-3 text-[0.6875rem] leading-relaxed text-paper/65">
            Our guides can help you understand common printer problems and find the
            appropriate solution.
          </p>
        </div>

        <nav aria-label="Problem guides">
          <h2 className="mb-3 text-[0.625rem] font-semibold uppercase tracking-widest text-paper/50">
            Problem guides
          </h2>
          <ul className="space-y-1.5 text-[0.6875rem]">
            {allGuides.filter((guide) => guide.slug !== 'drivers').map((g) => (
              <li key={g.slug}>
                <Link href={`/${g.slug}`} className="text-paper/85 transition-colors hover:text-amber">
                  {g.shortTitle}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/diagnose" className="text-paper/85 transition-colors hover:text-amber">
                Find your fix (guided)
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Brands and error codes">
          <h2 className="mb-3 text-[0.625rem] font-semibold uppercase tracking-widest text-paper/50">
            By brand
          </h2>
          <ul className="space-y-1.5 text-[0.6875rem]">
            {allBrands.map((b) => (
              <li key={b.key}>
                <Link href={`/brands/${b.key}`} className="text-paper/85 transition-colors hover:text-amber">
                  {b.name} printer help
                </Link>
              </li>
            ))}
            <li>
              <Link href="/errors" className="text-paper/85 transition-colors hover:text-amber">
                All error codes ({errorCodes.length})
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Site">
          <h2 className="mb-3 text-[0.625rem] font-semibold uppercase tracking-widest text-paper/50">
            Site
          </h2>
          <ul className="space-y-1.5 text-[0.6875rem]">
            <li><Link href="/about" className="text-paper/85 transition-colors hover:text-amber">About</Link></li>
            <li><Link href="/contact" className="text-paper/85 transition-colors hover:text-amber">Contact</Link></li>
            <li><Link href="/disclaimer" className="text-paper/85 transition-colors hover:text-amber">Disclaimer</Link></li>
            <li><Link href="/privacy" className="text-paper/85 transition-colors hover:text-amber">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-paper/85 transition-colors hover:text-amber">Terms &amp; Conditions</Link></li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-paper/10">
        <div className={`${wrap} flex flex-col gap-2 py-3 text-[0.625rem] text-paper/55 lg:flex-row lg:items-center lg:justify-between`}>
          <p>© {year} {site.name}. An independent help resource.</p>
          <p className="lg:max-w-2xl lg:text-right">
            Not affiliated with HP, Canon, Epson, Brother, or any printer
            manufacturer. Brand names are used only to identify the products these
            guides help with. Follow your printer’s manual for warranty-safe repairs.
          </p>
        </div>
      </div>
    </footer>
  );
}
