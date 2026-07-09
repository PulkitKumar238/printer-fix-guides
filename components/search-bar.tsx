'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { searchEntries, type SearchEntry } from '@/lib/search-index';
import { allGuides } from '@/content/guides';
import { SearchIcon, Icon } from './icons';

/**
 * Client-side instant search over the static guide/error/brand index.
 * No network calls — the index ships in the bundle. Keyboard accessible:
 * arrow keys move through results, Enter navigates, Escape closes.
 */
export function SearchBar({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const results: SearchEntry[] = query ? searchEntries(query) : [];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => setActive(0), [query]);

  function go(entry: SearchEntry) {
    setOpen(false);
    setQuery('');
    router.push(entry.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) {
      if (e.key === 'Enter' && results.length > 0) go(results[0]);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  const inputPad = size === 'lg' ? 'py-4 text-lg' : 'py-2.5 text-base';

  return (
    <div ref={containerRef} className="group relative w-full">
      {/* Soft amber glow to make the search feel like the primary action. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-full bg-amber/20 opacity-40 blur-lg transition-opacity duration-300 group-focus-within:opacity-80"
      />
      <div className="relative">
        <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-amber">
          <SearchIcon className="h-6 w-6" />
        </span>
        <input
          type="search"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          placeholder="What’s your printer issue?"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={`focus-ring relative w-full rounded-full border-2 border-ink/10 bg-surface pl-14 pr-4 ${inputPad} font-medium text-ink shadow-card-hover transition-colors placeholder:font-normal placeholder:text-slate/70 focus:border-amber/60`}
        />
      </div>

      {open && results.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-card-hover"
        >
          {results.map((entry, i) => (
            <li key={entry.href} role="option" aria-selected={i === active}>
              <Link
                href={entry.href}
                onClick={() => go(entry)}
                onMouseEnter={() => setActive(i)}
                className={`flex items-center justify-between gap-3 px-4 py-3 text-left ${
                  i === active ? 'bg-paper' : ''
                }`}
              >
                <span>
                  <span className="block font-medium text-ink">{entry.title}</span>
                  <span className="line-clamp-1 text-sm text-slate">{entry.description}</span>
                </span>
                <span className="shrink-0 rounded-full bg-ink/5 px-2 py-0.5 font-mono text-[0.7rem] uppercase tracking-wide text-slate">
                  {entry.type}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {open && !query && (
        <div
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-card-hover"
        >
          <p className="px-4 pt-3 text-xs font-medium uppercase tracking-wide text-slate">
            Common issues
          </p>
          <ul className="py-1">
            {allGuides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/diagnose?issue=${g.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-left hover:bg-paper"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber/10 text-amber">
                    <Icon name={g.icon} className="h-4 w-4" />
                  </span>
                  <span className="font-medium text-ink">{g.shortTitle}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/diagnose"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between border-t border-ink/10 px-4 py-3 text-sm font-medium text-amber hover:bg-paper"
          >
            Not sure? Run a guided diagnosis
            <span aria-hidden>→</span>
          </Link>
        </div>
      )}

      {open && query && results.length === 0 && (
        <div className="absolute z-30 mt-2 w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3 text-sm text-slate shadow-card-hover">
          No matches for “{query}”. Try “offline”, “wifi”, “paper jam”, or an error code like “5100”.
        </div>
      )}
    </div>
  );
}
