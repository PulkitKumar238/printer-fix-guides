import type { MetadataRoute } from 'next';
import { allGuides } from '@/content/guides';
import { errorCodes } from '@/content/errors';
import { brandOrder } from '@/content/brands';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${site.url}${path}`;

  const staticPages: MetadataRoute.Sitemap = [
    { url: url('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: url('/errors'), lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: url('/about'), lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: url('/disclaimer'), lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: url('/privacy'), lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: url('/terms'), lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const guidePages: MetadataRoute.Sitemap = allGuides.map((g) => ({
    url: url(`/${g.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const brandPages: MetadataRoute.Sitemap = brandOrder.map((b) => ({
    url: url(`/brands/${b}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const errorPages: MetadataRoute.Sitemap = errorCodes.map((e) => ({
    url: url(`/errors/${e.code.toLowerCase()}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...guidePages, ...brandPages, ...errorPages];
}
