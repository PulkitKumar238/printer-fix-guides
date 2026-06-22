import type { DiagnosticStep, FaqItem, Guide, ErrorCode, ContentBlock } from './types';
import { absoluteUrl, site } from './site';

/**
 * JSON-LD builders. These derive directly from the same content objects the
 * page renders, so the structured data always matches what the visitor sees.
 */

/** Flatten a step’s content blocks into plain text for schema "text" fields. */
function blocksToText(blocks: ContentBlock[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case 'paragraph':
        case 'note':
        case 'warning':
          return b.text;
        case 'list':
          return b.items.join(' ');
      }
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function howToSchema(opts: {
  name: string;
  description: string;
  steps: DiagnosticStep[];
  url: string;
  totalTime?: string; // ISO 8601 duration, e.g. PT15M
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: opts.name,
    description: opts.description,
    ...(opts.totalTime ? { totalTime: opts.totalTime } : {}),
    step: opts.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: blocksToText(step.body) || step.summary,
      url: `${opts.url}#step-${i + 1}`,
      ...(step.image
        ? { image: absoluteUrl(step.image.src) }
        : {}),
    })),
  };
}

export function faqSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

/** Convert a human read-time like "15 min" into ISO 8601 (PT15M). */
export function toIsoDuration(readTime: string): string | undefined {
  const m = readTime.match(/(\d+)\s*min/i);
  return m ? `PT${m[1]}M` : undefined;
}

export function guideSchemas(guide: Guide) {
  const url = absoluteUrl(`/${guide.slug}`);
  return [
    howToSchema({
      name: guide.title,
      description: guide.metaDescription,
      steps: guide.steps,
      url,
      totalTime: toIsoDuration(guide.readTime),
    }),
    faqSchema(guide.faqs),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: guide.shortTitle, url: `/${guide.slug}` },
    ]),
  ];
}

export function errorSchemas(error: ErrorCode) {
  const url = absoluteUrl(`/errors/${error.code.toLowerCase()}`);
  return [
    howToSchema({
      name: error.title,
      description: error.metaDescription,
      steps: error.fixes,
      url,
    }),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Error codes', url: '/errors' },
      { name: error.title, url: `/errors/${error.code.toLowerCase()}` },
    ]),
  ];
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    description: site.description,
  };
}
