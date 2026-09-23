import Link from 'next/link';
import { DriverDownload } from '@/components/driver-download';

export function PrinterSupportPage({ brandName }: { brandName: string }) {
  const navItems = ['Home', 'Printer setup', 'Connection help', 'Troubleshooting', 'Support'];
  return (
    <main className="bg-white text-[#1a1a1a]">
      <nav aria-label="Printer setup" className="border-b border-black/10 bg-white">
        <div className="mx-auto flex w-full max-w-[90rem] justify-center px-6 py-5 sm:px-10">
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xl">
            {navItems.map((label, index) => (
              <li key={label}>
                <Link href={index === 0 ? '/' : '#get'} className={index === 0 ? 'font-bold text-black' : 'font-medium text-black/70 transition-colors hover:text-[#1a8cf5]'}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <section id="get" className="scroll-mt-24 bg-[#f2f2f2]">
        <div className="mx-auto grid w-full max-w-[90rem] gap-14 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-2 lg:gap-20">
          <div>
            <h1 className="font-sans text-4xl font-extrabold leading-tight text-[#111] sm:text-5xl">Welcome! Printer Support &amp; Assistance</h1>
            <p className="mt-4 text-xl font-bold text-[#333]">Need help with your printer? Please enter your printer model number below and click Get Started.</p>
            <div className="mt-8"><DriverDownload brandName={brandName} /></div>
          </div>
          <div>
            <h2 className="font-sans text-3xl font-bold text-[#111] sm:text-4xl">How to find printer model number?</h2>
            <p className="mt-3 text-xl text-[#444]">The product name is on the front of your device.</p>
            <div className="mt-8 max-w-xl"><ModelLabelArt /></div>
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

function ModelLabelArt() {
  return (
    <svg viewBox="0 0 380 170" className="w-full" role="img" aria-label="Where the model number is printed on a printer">
      <rect x="10" y="34" width="150" height="104" rx="8" fill="#2b2b2b" />
      <rect x="24" y="20" width="122" height="26" rx="4" fill="#3d3d3d" />
      <rect x="30" y="60" width="70" height="30" rx="3" fill="#1a8cf5" opacity="0.3" />
      <rect x="30" y="98" width="110" height="26" rx="3" fill="#5b83a6" />
      <rect x="30" y="128" width="96" height="18" rx="2" fill="#c9a24a" />
      <path d="M160 78 L214 78" stroke="#1a8cf5" strokeWidth="2.5" strokeDasharray="2 5" strokeLinecap="round" />
      <rect x="214" y="56" width="158" height="44" rx="4" fill="#ffffff" stroke="#1a8cf5" strokeWidth="2" />
      <text x="293" y="83" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="16" fontWeight="700" fill="#1a1a1a">MODEL XX-XXXX</text>
    </svg>
  );
}
