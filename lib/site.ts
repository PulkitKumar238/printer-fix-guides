/** Central site metadata used for SEO, Open Graph, and structured data. */
export const site = {
  name: 'PrinterFix Guides',
  shortName: 'PrinterFix',
  // Set NEXT_PUBLIC_SITE_URL on Vercel; falls back to a sensible default.
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://printerfix-guides.example.com',
  description:
    'Plain-English troubleshooting guides for common printer problems — setup, offline errors, drivers, Wi-Fi, jams, scanning, and brand-specific error codes.',
  tagline: 'Clear, practical fixes for everyday printer problems.',
  locale: 'en_GB',
  // TODO: replace with the real contact address before launch.
  email: 'contact@printerfix-guides.example.com',
} as const;

/** Date the legal pages were last reviewed. Update when their content changes. */
export const legalLastUpdated = '23 June 2026';

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${site.url}${path.startsWith('/') ? '' : '/'}${path}`;
}
