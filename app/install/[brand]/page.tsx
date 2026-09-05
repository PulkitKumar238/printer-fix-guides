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

/** Brands with a real product photo under /public/images/brands. */
const withPhoto = new Set(['hp', 'canon', 'epson', 'brother']);

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
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 sm:px-8">
          <Link href="/install" aria-label={`${brand.name} home`} className="focus-ring flex shrink-0 items-center gap-2 rounded">
            <span
              className="grid h-9 w-9 place-items-center rounded-lg text-white"
              style={{ background: brand.theme.bg } as CSSProperties}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="4" y="9" width="16" height="8" rx="1.5" />
                <path d="M7 9V5h10v4M7 17v2h10v-2" />
                <circle cx="16.5" cy="12.5" r="0.9" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <span
              className="text-2xl font-extrabold tracking-tight"
              style={{ color: brand.theme.ink } as CSSProperties}
            >
              {brand.name}
            </span>
          </Link>
          <ul className="flex flex-1 flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[1.05rem]">
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

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundImage: `linear-gradient(160deg, ${brand.theme.bg}, ${brand.theme.ink})` } as CSSProperties}
      >
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div>
            <h1 className="font-sans text-4xl font-bold leading-tight text-white sm:text-5xl">
              Download Free Printer Drivers
            </h1>
            <ul className="mt-6 space-y-2 text-lg text-white">
              <li className="flex gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                <span className="font-semibold">Make sure your printer is powered on</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                <span className="font-semibold">Click on Download to install the drivers</span>
              </li>
            </ul>
            <a
              href="#get"
              className="focus-ring mt-8 inline-flex items-center gap-2 rounded-full bg-[#1a8cf5] px-7 py-3.5 text-lg font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] ring-1 ring-white/25 transition-colors hover:bg-[#1478d6]"
            >
              Download Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" />
              </svg>
            </a>
          </div>
          {withPhoto.has(brand.key) ? (
            <div className="relative h-56 w-[26rem] max-w-full justify-self-center overflow-hidden rounded-2xl bg-white shadow-[0_25px_60px_rgba(0,0,0,0.35)] sm:h-72 sm:-rotate-2 lg:justify-self-end">
              <Image
                src={`/images/brands/${brand.key}.jpg`}
                alt={`${brand.name} printers`}
                fill
                sizes="(max-width: 1024px) 90vw, 26rem"
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="justify-self-center lg:justify-self-end">
              <PrinterArt />
            </div>
          )}
        </div>
      </section>

      {/* Quick download */}
      <section id="get" className="scroll-mt-24 bg-[#f2f2f2]">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2">
          <div>
            <h2 className="font-sans text-[1.65rem] font-extrabold leading-tight text-[#111] sm:text-4xl">
              Quick Download Free Drivers
            </h2>
            <p className="mt-3 font-bold text-[#333]">Fill the form and download your printer driver</p>
            <div className="mt-6">
              <DriverDownload brand={brand.key} brandName={brand.name} />
            </div>
          </div>
          <div>
            <h2 className="font-sans text-2xl font-bold text-[#111] sm:text-3xl">
              How to find printer model number?
            </h2>
            <p className="mt-2 text-lg text-[#444]">The product name is on the front of your device.</p>
            <div className="mt-6 max-w-md">
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

/** Simple printer illustration for brands without a product photo. */
function PrinterArt() {
  return (
    <svg viewBox="0 0 320 260" className="w-full max-w-md drop-shadow-2xl" role="img" aria-label="Printer illustration">
      <rect x="40" y="150" width="240" height="80" rx="10" fill="#ffffff" />
      <rect x="64" y="70" width="192" height="90" rx="8" fill="#ffffff" />
      <rect x="88" y="44" width="144" height="34" rx="6" fill="#ffffff" opacity="0.85" />
      <rect x="150" y="120" width="120" height="10" rx="5" fill="#0d0d0d" opacity="0.25" />
      <rect x="64" y="182" width="150" height="30" rx="6" fill="#0d0d0d" opacity="0.2" />
      <circle cx="244" cy="197" r="9" fill="#0d0d0d" opacity="0.35" />
      <rect x="112" y="16" width="96" height="20" rx="4" fill="#ffffff" opacity="0.7" />
    </svg>
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
