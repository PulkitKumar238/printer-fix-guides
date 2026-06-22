'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { allGuides } from '@/content/guides';
import { allBrands } from '@/content/brands';
import { site } from '@/lib/site';

const navGuides = allGuides.slice(0, 7);

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur">
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
        <Link href="/" className="focus-ring flex items-center gap-2.5 rounded" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-paper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="4" y="9" width="16" height="8" rx="1.5" />
              <path d="M7 9V5h10v4M7 17v2h10v-2" />
              <circle cx="16.5" cy="12.5" r="0.9" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="font-slab text-xl font-bold text-ink">
            Printer<span className="text-amber">Fix</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          <NavLink href="/setup" pathname={pathname}>Setup</NavLink>
          <NavLink href="/offline" pathname={pathname}>Offline</NavLink>
          <NavLink href="/drivers" pathname={pathname}>Drivers</NavLink>
          <NavLink href="/wifi" pathname={pathname}>Wi-Fi</NavLink>
          <NavLink href="/not-printing" pathname={pathname}>Not printing</NavLink>
          <NavLink href="/paper-jam" pathname={pathname}>Paper jam</NavLink>
          <NavLink href="/scanner" pathname={pathname}>Scanner</NavLink>
          <NavLink href="/about" pathname={pathname}>About</NavLink>
        </nav>

        <button
          type="button"
          className="focus-ring rounded-lg p-2 lg:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-paper lg:hidden">
          <nav aria-label="Mobile" className="container-page grid gap-1 py-4">
            {navGuides.map((g) => (
              <Link
                key={g.slug}
                href={`/${g.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 font-medium text-ink hover:bg-ink/5"
              >
                {g.shortTitle}
              </Link>
            ))}
            <div className="my-2 border-t border-ink/10" />
            <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-slate">Brands</p>
            {allBrands.map((b) => (
              <Link
                key={b.key}
                href={`/brands/${b.key}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 font-medium text-ink hover:bg-ink/5"
              >
                {b.name}
              </Link>
            ))}
            <div className="my-2 border-t border-ink/10" />
            <Link href="/about" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 font-medium text-ink hover:bg-ink/5">About</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, pathname, children }: { href: string; pathname: string; children: React.ReactNode }) {
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`focus-ring rounded-lg px-3.5 py-2 text-[0.9375rem] font-medium transition-colors ${
        active ? 'text-amber' : 'text-ink/80 hover:text-amber'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}
