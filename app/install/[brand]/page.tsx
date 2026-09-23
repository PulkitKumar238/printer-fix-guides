import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { brandOrder, getBrand } from '@/content/brands';
import { PrinterSupportPage } from '@/components/printer-support-page';
import { pageMetadata } from '@/lib/metadata';

export function generateStaticParams() {
  return brandOrder.map((brand) => ({ brand }));
}
export const dynamicParams = false;

export function generateMetadata({ params }: { params: { brand: string } }): Metadata {
  const brand = getBrand(params.brand);
  if (!brand) return {};
  return pageMetadata({ title: 'Printer Setup Help', description: 'Enter your printer model number to continue with guided printer setup assistance.', path: `/install/${brand.key}` });
}

export default function InstallBrandPage({ params }: { params: { brand: string } }) {
  const brand = getBrand(params.brand);
  if (!brand) notFound();
  return <PrinterSupportPage brandName={brand.name} />;
}
