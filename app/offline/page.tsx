import type { Metadata } from 'next';
import { guides } from '@/content/guides';
import { GuideTemplate } from '@/components/guide-template';
import { pageMetadata } from '@/lib/metadata';

const guide = guides['offline'];

export const metadata: Metadata = pageMetadata({
  title: guide.metaTitle,
  description: guide.metaDescription,
  path: `/${guide.slug}`,
});

export default function Page() {
  return <GuideTemplate guide={guide} />;
}
