import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BrandSelectionPage } from '@/components/brand-selection-page';
import { getGuide, guideOrder } from '@/content/guides';
import { pageMetadata } from '@/lib/metadata';

export function generateStaticParams() {
  return guideOrder.map((topic) => ({ topic }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { topic: string } }): Metadata {
  const guide = getGuide(params.topic);
  if (!guide) return {};
  return pageMetadata({
    title: 'Select Your Printer Brand',
    description: `Choose your printer brand to continue with the ${guide.shortTitle} guide.`,
    path: `/guide/select/${guide.slug}`,
  });
}

export default function SelectBrandPage({ params }: { params: { topic: string } }) {
  const guide = getGuide(params.topic);
  if (!guide) notFound();
  return <BrandSelectionPage guide={guide} />;
}
