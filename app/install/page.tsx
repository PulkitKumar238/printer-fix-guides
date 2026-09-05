import Link from 'next/link';
import { DriverFinderForm } from '@/components/driver-finder-form';
import { OpenChatButton } from '@/components/open-chat-button';
import { JsonLd } from '@/components/json-ld';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Select Your Printer Model — Download Printer Drivers',
  description:
    'Choose your printer brand and model to download the correct driver. Free help from a real support specialist for HP, Brother, Epson and Canon printers.',
  path: '/install',
});

const subNav = [
  { label: 'Home', href: '/install' },
  { label: 'OfficeJet', href: '/install/hp' },
  { label: 'Pixma', href: '/install/canon' },
  { label: 'Ecotank', href: '/install/epson' },
  { label: 'LaserJet', href: '/install/brother' },
];

const models = [
  { name: 'HP', href: '/install/hp', text: 'text-[#0f7fd6]', fill: 'bg-[#0f7fd6]' },
  { name: 'Brother', href: '/install/brother', text: 'text-[#0f7fd6]', fill: 'bg-[#0f7fd6]' },
  { name: 'Epson', href: '/install/epson', text: 'text-[#0f7fd6]', fill: 'bg-[#0f7fd6]' },
  { name: 'Canon', href: '/install/canon', text: 'text-[#ea0000]', fill: 'bg-[#ea0000]' },
  { name: 'Other', href: '#download-form', text: 'text-[#0f7fd6]', fill: 'bg-[#0f7fd6]' },
];

const supportOptions = [
  { title: 'Software and Drivers', href: '/drivers', className: 'bg-gradient-to-br from-[#1aa0d6] to-[#0a6ea8]' },
  { title: 'Solution Centre', href: '/diagnose', className: 'bg-gradient-to-br from-[#7a5b46] to-[#4c3a2e]' },
  { title: 'Diagnostic Tools to fix issue', href: '/errors', className: 'bg-gradient-to-br from-[#2b2b2b] to-[#0c0c0c]' },
];

/* Full-bleed content wrapper — wide, like the reference page. */
const wrap = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

export default function InstallHubPage() {
  return (
    <div className="bg-white text-[#1a1a1a]">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Select your printer model', url: '/install' },
        ])}
      />

      {/* Brand sub-nav */}
      <nav aria-label="Printer setup" className="border-b border-black/10 bg-[#f6f8fa]">
        <ul className={`${wrap} flex flex-wrap justify-center gap-x-8 gap-y-2 py-4 text-[1.05rem]`}>
          {subNav.map((item, i) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={
                  i === 0
                    ? 'font-bold text-black'
                    : 'font-medium text-black/80 transition-colors hover:text-[#0096D6]'
                }
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Hero + model picker */}
      <SelectModelSection className="pt-14 pb-16 sm:pt-20" />

      {/* Need help band */}
      <section className="bg-[#e8e8e8]">
        <div className={`${wrap} py-14 text-center sm:py-16`}>
          <h2 className="font-sans text-3xl font-extrabold text-[#111] sm:text-[2.75rem]">
            Need Help For Printer &amp; Scanner
          </h2>
          <p className="mt-3 text-lg text-[#333]">Call Toll free &amp; Live Chat With Expert.</p>
          <div className="mx-auto mt-8 flex w-full max-w-md flex-col items-center gap-3 rounded-3xl bg-white px-5 py-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:w-auto sm:max-w-none sm:flex-row sm:gap-4 sm:rounded-full sm:py-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#ffd27a] text-[#7a5a12]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 13a8 8 0 0 1 16 0" />
                <path d="M4 13v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2Z" fill="currentColor" />
                <path d="M20 13v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z" fill="currentColor" />
                <path d="M12 20h3" />
              </svg>
            </span>
            <span className="text-center font-semibold text-[#0096D6]">Try asking our Virtual Agent</span>
            <OpenChatButton className="w-full shrink-0 rounded bg-[#0096D6] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#007eb8] sm:w-auto">
              Chat Now
            </OpenChatButton>
          </div>
        </div>
      </section>

      {/* Download Printer Drivers form */}
      <section id="download-form" className="scroll-mt-24 bg-white">
        <div className={`${wrap} grid gap-10 py-14 lg:grid-cols-[2.35fr_1fr] sm:py-16`}>
          <div>
            <div className="bg-black px-4 py-3 text-base font-bold text-white sm:px-5 sm:text-lg">Download Printer Drivers</div>
            <div className="border border-t-0 border-[#e2e2e2] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <DriverFinderForm />
            </div>
          </div>
          <div>
            <h2 className="font-sans text-xl font-bold text-[#111]">How to find printer model number?</h2>
            <p className="mt-2 text-[#444]">&#8250; The product name is on the front of your device.</p>
            <div className="mt-4">
              <ModelLabelArt />
            </div>
          </div>
        </div>
      </section>

      {/* More support options */}
      <section className="bg-[#f2f2f2]">
        <div className={`${wrap} py-14 sm:py-16`}>
          <h2 className="text-center font-sans text-3xl font-extrabold text-[#111] sm:text-[2.5rem]">
            More support options for this topic
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {supportOptions.map((opt) => (
              <Link
                key={opt.title}
                href={opt.href}
                className={`focus-ring group grid h-56 place-items-center rounded-sm p-6 text-center text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] ring-8 ring-white transition-transform hover:-translate-y-0.5 ${opt.className}`}
              >
                <span>
                  <span className="block text-2xl font-medium drop-shadow">{opt.title}</span>
                  <span className="mx-auto mt-4 grid h-14 w-14 place-items-center rounded-full border-2 border-white/70 transition-colors group-hover:bg-white/10">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="m9 6 6 6-6 6" />
                    </svg>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Repeat model picker */}
      <SelectModelSection className="py-16" />

      {/* Support copy */}
      <section className="bg-[#f2f2f2]">
        <div className={`${wrap} grid gap-8 py-14 md:grid-cols-2 sm:py-16`}>
          <article>
            <div className="bg-black px-4 py-3 text-base font-bold text-white sm:px-5 sm:text-lg">Printer Support Customer Care</div>
            <div className="border border-t-0 border-[#e2e2e2] bg-white p-6">
              <p className="leading-relaxed text-[#333]">
                Printer Solutions offers comprehensive solutions that look at the problems from the
                root. That is why we are reputed as the best printer support help that you can find.
                We understand that problems bedeviling your printer may emanate from a lot of
                sources, which is why our technicians dig deep to find the actual cause and fix it
                for good — whether it is a driver conflict, a stuck print queue, a network drop, or a
                hardware fault.
              </p>
            </div>
          </article>
          <article>
            <div className="bg-black px-4 py-3 text-base font-bold text-white sm:px-5 sm:text-lg">Printer Troubleshooting</div>
            <div className="border border-t-0 border-[#e2e2e2] bg-white p-6">
              <p className="leading-relaxed text-[#333]">
                Printers are the most widely used all across the globe as provides the most advance
                features in its peripherals. But with so many features these printers are also very
                sophisticated and thus people find it difficult to handle or resolve the errors that
                show up. Our troubleshooting help walks you through setup, wireless configuration,
                error codes, and everyday fixes in plain language.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Footer strip */}
      <div className="bg-[#1a1a1a] py-6 text-center text-sm text-white/70">
        <p className="font-medium text-white">Fill the form and download your printer driver.</p>
        <p className="mt-1">
          Printer Support · Independent service, not affiliated with any printer manufacturer.
        </p>
      </div>
    </div>
  );
}

function SelectModelSection({ className = '' }: { className?: string }) {
  return (
    <section className={`bg-white ${className}`}>
      <div className={wrap}>
        <h1 className="text-center font-sans text-[2rem] font-extrabold leading-tight tracking-tight text-[#111] sm:text-[3.25rem]">
          Select Your Printer Model
        </h1>
        <div className="mt-7 flex justify-center">
          <Link
            href="#download-form"
            className="focus-ring inline-flex max-w-full items-center gap-2 rounded-full bg-[#0096D6] px-5 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-[#007eb8] sm:px-7 sm:text-lg"
          >
            Download Your Printer Drivers
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden>
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" />
            </svg>
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
          {models.map((m) => (
            <Link
              key={m.name}
              href={m.href}
              className="focus-ring group relative grid aspect-square place-items-center overflow-hidden border-[5px] border-[#dcdcdc] bg-white shadow-[0_10px_28px_rgba(0,0,0,0.14)] sm:border-[7px]"
            >
              <span
                aria-hidden
                className={`absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100 ${m.fill}`}
              />
              <span className={`relative text-2xl font-semibold transition-colors duration-150 group-hover:text-white sm:text-3xl ${m.text}`}>
                {m.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Printer + "MODEL XX-XXXX" callout, mirroring the reference help image. */
function ModelLabelArt() {
  return (
    <svg viewBox="0 0 380 170" className="w-full" role="img" aria-label="Where the model number is printed on a printer">
      <rect x="10" y="34" width="150" height="104" rx="8" fill="#2b2b2b" />
      <rect x="24" y="20" width="122" height="26" rx="4" fill="#3d3d3d" />
      <rect x="30" y="60" width="70" height="30" rx="3" fill="#0096D6" opacity="0.25" />
      <rect x="30" y="98" width="110" height="26" rx="3" fill="#5b83a6" />
      <rect x="30" y="128" width="96" height="18" rx="2" fill="#c9a24a" />
      <path d="M160 78 L214 78" stroke="#0096D6" strokeWidth="2.5" strokeDasharray="2 5" strokeLinecap="round" />
      <rect x="214" y="56" width="158" height="44" rx="4" fill="#ffffff" stroke="#0096D6" strokeWidth="2" />
      <text x="293" y="83" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="16" fontWeight="700" fill="#1a1a1a">
        MODEL XX-XXXX
      </text>
    </svg>
  );
}
