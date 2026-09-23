import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PrinterSupportPage } from '@/components/printer-support-page';
import { getGuide, guideOrder } from '@/content/guides';
import { pageMetadata } from '@/lib/metadata';

const brandCodes = { one: 'HP', two: 'Brother', three: 'Epson', four: 'Canon', five: 'Other' } as const;
type BrandCode = keyof typeof brandCodes;

export function generateStaticParams() {
  return Object.keys(brandCodes).flatMap((brandCode) => guideOrder.map((topic) => ({ brandCode, topic })));
}
export const dynamicParams = false;

export function generateMetadata({ params }: { params: { brandCode: string; topic: string } }): Metadata {
  const brandName = brandCodes[params.brandCode as BrandCode];
  const guide = getGuide(params.topic);
  if (!brandName || !guide) return {};
  return pageMetadata({ title: 'Printer Support & Assistance', description: `Continue with guided ${guide.shortTitle.toLowerCase()} assistance.`, path: `/guide/${params.brandCode}/${guide.slug}` });
}

export default function BrandTopicPage({ params }: { params: { brandCode: string; topic: string } }) {
  const brandName = brandCodes[params.brandCode as BrandCode];
  const guide = getGuide(params.topic);
  if (!brandName || !guide) notFound();
  return <PrinterSupportPage brandName={brandName} />;
}
