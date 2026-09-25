import Link from 'next/link';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import { DriverDownload } from '@/components/driver-download';
import { getBrand } from '@/content/brands';

export function PrinterSupportPage({ brandName }: { brandName: string }) {
  const brand = brandName.toLowerCase();
  const logos: Record<string, string> = {
    hp: '/images/brands/logos/hp.png',
    canon: '/images/brands/logos/canon.png',
    epson: '/images/brands/logos/epson.png',
    brother: '/images/brands/logos/brother.png',
  };
  const brandInfo = getBrand(brand);
  const colors = brandInfo
    ? { accent: brandInfo.theme.ink, tint: brandInfo.theme.tint }
    : { accent: '#146fd1', tint: '#eef6ff' };
  const navItems = ['Home', 'Printer setup', 'Connection help', 'Troubleshooting', 'Support'];
  return (
    <main className="bg-white text-[#1a1a1a]" style={{ '--brand-accent': colors.accent } as CSSProperties}>
      <nav aria-label="Printer setup" className="border-b border-black/10 bg-white">
        <div className="mx-auto flex w-full max-w-[90rem] justify-center px-6 py-5 sm:px-10">
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xl">
            {navItems.map((label, index) => (
              <li key={label}>
                <Link href={index === 0 ? '/' : '#get'} className={index === 0 ? 'font-bold text-black' : 'font-medium text-black/70 transition-colors hover:text-[var(--brand-accent)]'}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <section id="get" className="scroll-mt-24" style={{ backgroundColor: colors.tint }}>
        <div className="mx-auto grid w-full max-w-[90rem] gap-14 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="mb-7 flex h-20 w-28 items-center justify-center rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/10">
              {logos[brand] ? (
                <Image src={logos[brand]} alt={`${brandName} logo`} width={96} height={64} className="max-h-14 w-auto object-contain" />
              ) : brandInfo ? (
                <span className="text-center text-lg font-extrabold" style={{ color: colors.accent }}>{brandName}</span>
              ) : (
                <PrinterMark color={colors.accent} />
              )}
            </div>
            <h1 className="font-sans text-4xl font-extrabold leading-tight sm:text-5xl" style={{ color: colors.accent }}>
              Welcome to {brandName} Support &amp; Assistance
            </h1>
            <p className="mt-4 text-xl font-bold text-[#333]">Need help with your printer? Please enter your printer model number below and click Get Started.</p>
            <div className="mt-8"><DriverDownload brandName={brandName} /></div>
          </div>
          <div>
            <h2 className="font-sans text-3xl font-bold text-[#111] sm:text-4xl">How to find printer model number?</h2>
            <p className="mt-3 text-xl text-[#444]">The product name is on the front of your device.</p>
            <div className="mt-8 max-w-xl"><ModelLabelArt color={colors.accent} /></div>
          </div>
        </div>
      </section>
      <div className="bg-[#1a1a1a] py-6 text-center text-sm text-white/70">
        <p className="font-medium text-white">Enter your model number to continue printer setup.</p>
        <p className="mt-1">PrinterFix · Independent service, not affiliated with any printer manufacturer.</p>
      </div>
    </main>
  );
}

function PrinterMark({ color }: { color: string }) {
  return (
    <svg width="54" height="54" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M16 24V9h32v15M16 46H9V29a5 5 0 0 1 5-5h36a5 5 0 0 1 5 5v17h-7" stroke={color} strokeWidth="4" strokeLinejoin="round" />
      <path d="M16 39h32v16H16z" stroke={color} strokeWidth="4" />
      <circle cx="47" cy="32" r="2" fill={color} />
    </svg>
  );
}

function ModelLabelArt({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 380 170" className="w-full" role="img" aria-label="Where the model number is printed on a printer">
      <rect x="10" y="34" width="150" height="104" rx="8" fill="#2b2b2b" />
      <rect x="24" y="20" width="122" height="26" rx="4" fill="#3d3d3d" />
      <rect x="30" y="60" width="70" height="30" rx="3" fill={color} opacity="0.3" />
      <rect x="30" y="98" width="110" height="26" rx="3" fill="#5b83a6" />
      <rect x="30" y="128" width="96" height="18" rx="2" fill="#c9a24a" />
      <path d="M160 78 L214 78" stroke={color} strokeWidth="2.5" strokeDasharray="2 5" strokeLinecap="round" />
      <rect x="214" y="56" width="158" height="44" rx="4" fill="#ffffff" stroke={color} strokeWidth="2" />
      <text x="293" y="83" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="16" fontWeight="700" fill="#1a1a1a">MODEL XX-XXXX</text>
    </svg>
  );
}
