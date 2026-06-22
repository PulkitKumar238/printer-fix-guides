import { allGuides } from '@/content/guides';
import { errorCodes } from '@/content/errors';
import { allBrands } from '@/content/brands';

export interface SearchEntry {
  title: string;
  href: string;
  type: 'Guide' | 'Error code' | 'Brand';
  description: string;
  /** Lower-cased haystack for matching. */
  keywords: string;
}

/** Flat, static search index built at module load — no runtime fetching. */
export const searchIndex: SearchEntry[] = [
  ...allGuides.map((g) => ({
    title: g.shortTitle,
    href: `/${g.slug}`,
    type: 'Guide' as const,
    description: g.cardDescription,
    keywords: [
      g.title,
      g.shortTitle,
      g.cardDescription,
      g.metaDescription,
      ...g.commonCauses.map((c) => c.title),
      ...g.faqs.map((f) => f.question),
    ]
      .join(' ')
      .toLowerCase(),
  })),
  ...errorCodes.map((e) => ({
    title: e.title,
    href: `/errors/${e.code.toLowerCase()}`,
    type: 'Error code' as const,
    description: e.metaDescription,
    keywords: [e.code, e.title, e.brand, e.metaDescription].join(' ').toLowerCase(),
  })),
  ...allBrands.map((b) => ({
    title: `${b.name} printer help`,
    href: `/brands/${b.key}`,
    type: 'Brand' as const,
    description: b.metaDescription,
    keywords: [b.name, b.key, b.metaDescription].join(' ').toLowerCase(),
  })),
];

export function searchEntries(query: string, limit = 6): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return searchIndex
    .map((entry) => {
      let score = 0;
      for (const term of terms) {
        if (entry.title.toLowerCase().includes(term)) score += 3;
        if (entry.keywords.includes(term)) score += 1;
      }
      return { entry, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.entry);
}
