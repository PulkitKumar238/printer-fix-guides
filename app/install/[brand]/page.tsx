import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { brandOrder, getBrand } from '@/content/brands';
import { DriverDownload } from '@/components/driver-download';
import { JsonLd } from '@/components/json-ld';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/metadata';

export function generateStaticParams() {
  return brandOrder.map((brand) => ({ brand }));
}

export const dynamicParams = false;

/** Real logo files under /public/images/brands/logos, with intrinsic size. */
const brandLogos: Partial<Record<string, { w: number; h: number }>> = {
  hp: { w: 124, h: 102 },
  brother: { w: 178, h: 50 },
  epson: { w: 218, h: 88 },
  canon: { w: 240, h: 74 },
};

export function generateMetadata({ params }: { params: { brand: string } }): Metadata {
  const brand = getBrand(params.brand);
  if (!brand) return {};
  return pageMetadata({
    title: `Download Free ${brand.name} Printer Drivers`,
    description: `Enter your ${brand.name} printer model number to get the correct, official driver. Free help from a real support specialist — independent, not affiliated with ${brand.name}.`,
    path: `/install/${brand.key}`,
  });
}

export default function InstallBrandPage({ params }: { params: { brand: string } }) {
  const brand = getBrand(params.brand);
  if (!brand) notFound();

  const subNav = ['Home', ...brand.lineup.slice(0, 4)];

  return (
    <div className="bg-white text-[#1a1a1a]">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Download drivers', url: '/install' },
          { name: brand.name, url: `/install/${brand.key}` },
        ])}
      />

      {/* Brand sub-nav */}
      <nav aria-label={`${brand.name} setup`} className="border-b border-black/10 bg-white">
        <div className="mx-auto flex w-full max-w-[90rem] flex-wrap items-center gap-x-8 gap-y-3 px-6 py-5 sm:px-10">
          <Link href="/install" aria-label={`${brand.name} home`} className="focus-ring flex shrink-0 items-center gap-2 rounded">
            {brandLogos[brand.key] ? (
              <Image
                src={`/images/brands/logos/${brand.key}.png`}
                alt={`${brand.name} logo`}
                width={brandLogos[brand.key]!.w}
                height={brandLogos[brand.key]!.h}
                className="h-20 w-auto max-w-[320px] object-contain"
                priority
              />
            ) : (
              <>
                <span
                  className="grid h-20 w-20 place-items-center rounded-lg text-white"
                  style={{ background: brand.theme.bg } as CSSProperties}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="4" y="9" width="16" height="8" rx="1.5" />
                    <path d="M7 9V5h10v4M7 17v2h10v-2" />
                    <circle cx="16.5" cy="12.5" r="0.9" fill="currentColor" stroke="none" />
                  </svg>
                </span>
                <span
                  className="text-4xl font-extrabold tracking-tight"
                  style={{ color: brand.theme.ink } as CSSProperties}
                >
                  {brand.name}
                </span>
              </>
            )}
          </Link>
          <ul className="flex flex-1 flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xl">
            {subNav.map((label, i) => (
              <li key={label}>
                <Link
                  href={i === 0 ? '/install' : '#get'}
                  className={i === 0 ? 'font-bold text-black' : 'font-medium text-black/70 transition-colors hover:text-[#1a8cf5]'}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Quick download */}
      <section id="get" className="scroll-mt-24 bg-[#f2f2f2]">
        <div className="mx-auto grid w-full max-w-[90rem] gap-14 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-2 lg:gap-20">
          <div>
            <h1 className="font-sans text-4xl font-extrabold leading-tight text-[#111] sm:text-5xl">
              Welcome! {brand.name} Printer Support &amp; Assistance
            </h1>
            <p className="mt-4 text-xl font-bold text-[#333]">
              Need help with your printer? Please enter your printer model number below and click Get Started.
            </p>
            <div className="mt-8">
              <DriverDownload brand={brand.key} brandName={brand.name} />
            </div>
          </div>
          <div>
            <h2 className="font-sans text-3xl font-bold text-[#111] sm:text-4xl">
              How to find printer model number?
            </h2>
            <p className="mt-3 text-xl text-[#444]">The product name is on the front of your device.</p>
            <div className="mt-8 max-w-xl">
              <ModelLabelArt brandName={brand.name} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer strip */}
      <div className="bg-[#1a1a1a] py-6 text-center text-sm text-white/70">
        <p className="font-medium text-white">Fill the form and download your printer driver.</p>
        <p className="mt-1">
          PrinterFix · Independent service, not affiliated with {brand.name} or any printer
          manufacturer. We link to official {brand.name} driver downloads.
        </p>
      </div>
    </div>
  );
}

/** Printer + "MODEL XX-XXXX" callout, mirroring the reference help image. */
function ModelLabelArt({ brandName }: { brandName: string }) {
  return (
    <svg viewBox="0 0 380 170" className="w-full" role="img" aria-label={`Where the model number is printed on a ${brandName} printer`}>
      <rect x="10" y="34" width="150" height="104" rx="8" fill="#2b2b2b" />
      <rect x="24" y="20" width="122" height="26" rx="4" fill="#3d3d3d" />
      <rect x="30" y="60" width="70" height="30" rx="3" fill="#1a8cf5" opacity="0.3" />
      <rect x="30" y="98" width="110" height="26" rx="3" fill="#5b83a6" />
      <rect x="30" y="128" width="96" height="18" rx="2" fill="#c9a24a" />
      <path d="M160 78 L214 78" stroke="#1a8cf5" strokeWidth="2.5" strokeDasharray="2 5" strokeLinecap="round" />
      <rect x="214" y="56" width="158" height="44" rx="4" fill="#ffffff" stroke="#1a8cf5" strokeWidth="2" />
      <text x="293" y="83" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="16" fontWeight="700" fill="#1a1a1a">
        MODEL XX-XXXX
      </text>
    </svg>
  );
}
