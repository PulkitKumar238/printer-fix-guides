import type { Metadata } from 'next';
import { absoluteUrl } from './site';

/** Build per-page metadata with canonical URL + OG/Twitter overrides. */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = absoluteUrl(opts.path);
  const image = absoluteUrl(opts.image ?? '/images/site/hero.jpg');
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      type: 'article',
      images: [{ url: image, width: 1152, height: 768, alt: opts.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };
}
