/**
 * Shared content model for the whole site.
 *
 * Every guide, error code, and brand hub is a plain data object that conforms
 * to one of the interfaces below. The rendered UI *and* the schema.org JSON-LD
 * are both derived from this single source, so structured data can never drift
 * out of sync with what the visitor actually reads on the page.
 */

/** Slugs for the seven main problem guides — used for type-safe cross-links. */
export type GuideSlug =
  | 'setup'
  | 'offline'
  | 'drivers'
  | 'wifi'
  | 'not-printing'
  | 'paper-jam'
  | 'scanner';

/** A single block of body copy inside a step or section. */
export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'note'; text: string }
  | { type: 'warning'; text: string };

/** One numbered step in the DiagnosticSteps tracker (and one HowTo step). */
export interface DiagnosticStep {
  /** Short imperative title, e.g. "Check the physical connection". */
  title: string;
  /** One-line summary shown in the step tracker and used as HowTo step name. */
  summary: string;
  /** Full body of the step. */
  body: ContentBlock[];
  /** Optional illustrative image for this step. */
  image?: {
    /** File under /public/images/... — swap the placeholder for a real photo. */
    src: string;
    alt: string;
    caption?: string;
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedLink {
  href: string;
  title: string;
  description: string;
}

export interface Guide {
  slug: GuideSlug;
  /** Visible H1. */
  title: string;
  /** Used in nav, cards, breadcrumbs. */
  shortTitle: string;
  /** <title> tag. */
  metaTitle: string;
  metaDescription: string;
  /** One-sentence card description on the homepage grid. */
  cardDescription: string;
  /** Icon key resolved by components/icons.tsx. */
  icon: IconKey;
  /** Lead paragraphs shown above the diagnostic steps. */
  intro: ContentBlock[];
  /** Estimated read/fix time, e.g. "10 min". */
  readTime: string;
  steps: DiagnosticStep[];
  commonCauses: { title: string; detail: string }[];
  faqs: FaqItem[];
  related: RelatedLink[];
}

export interface ErrorCode {
  /** URL slug and displayed code, e.g. "0x97" or "5100". */
  code: string;
  brand: BrandKey;
  /** <title> + H1 friendly name. */
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** Plain-language explanation of what the code means. */
  meaning: ContentBlock[];
  /** 3–5 concise fix steps. */
  fixes: DiagnosticStep[];
  /** Where to go next for deeper help. */
  related: RelatedLink[];
}

export type BrandKey = 'hp' | 'canon' | 'epson' | 'brother';

export interface Brand {
  key: BrandKey;
  name: string;
  metaTitle: string;
  metaDescription: string;
  /** Intro paragraphs about common issues for this brand. */
  intro: ContentBlock[];
  /** Guides most relevant to this brand, in priority order. */
  guideSlugs: GuideSlug[];
  faqs: FaqItem[];
}

export type IconKey =
  | 'setup'
  | 'offline'
  | 'drivers'
  | 'wifi'
  | 'not-printing'
  | 'paper-jam'
  | 'scanner'
  | 'error'
  | 'brand'
  | 'search';
