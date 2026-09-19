import Link from 'next/link';
import { JsonLd } from '@/components/json-ld';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/metadata';
import { allGuides } from '@/content/guides';
import { IssueCard } from '@/components/issue-card';
import { Icon } from '@/components/icons';

export const metadata = pageMetadata({
  title: 'Select Your Printer Brand — Download Printer Drivers',
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
  { name: 'Other', href: '/contact', text: 'text-[#0f7fd6]', fill: 'bg-[#0f7fd6]' },
];

const supportOptions = [
  { title: 'Software and Drivers', href: '#support-printer-brands', className: 'bg-gradient-to-br from-[#1aa0d6] to-[#0a6ea8]' },
  { title: 'Solution Centre', href: '#support-printer-brands', className: 'bg-gradient-to-br from-[#7a5b46] to-[#4c3a2e]' },
  { title: 'Diagnostic Tools to fix issue', href: '#support-printer-brands', className: 'bg-gradient-to-br from-[#2b2b2b] to-[#0c0c0c]' },
];

/* Full-bleed content wrapper — wide, like the reference page. */
const wrap = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

export default function InstallHubPage() {
  return (
    <div className="bg-white text-[#1a1a1a]">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Select your printer brand', url: '/install' },
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

      {/* Issue picker — each choice brings visitors directly to the model selector. */}
      <section
        aria-labelledby="issues-heading"
        className="bg-white"
      >
        <div className={`${wrap} py-12 sm:py-16 lg:py-[4.5rem]`}>
          <div className="max-w-2xl">
            <h1 id="issues-heading" className="text-4xl font-bold sm:text-5xl">
              Choose your issue
            </h1>
            <p className="mt-4 text-xl leading-relaxed text-slate">
              Pick the problem that matches what you&apos;re seeing. Each guide walks you
              through the fix from the most likely cause down.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allGuides.map((guide) => (
              <IssueCard
                key={guide.slug}
                href="#printer-models"
                icon={guide.icon}
                title={guide.shortTitle}
                description={guide.cardDescription}
                accentClassName="text-black"
                iconClassName="bg-white/85 text-[#0f7fd6] group-hover:bg-white group-hover:text-[#0f7fd6]"
                cardClassName="min-h-[14rem] rounded-xl border-[#0f7fd6] bg-[#0f7fd6] p-5 shadow-[0_6px_18px_rgba(15,127,214,0.2)] hover:bg-[#198be3]"
                descriptionClassName="text-black/85"
                titleClassName="text-black"
              />
            ))}
            <Link
              href="#printer-models"
              className="focus-ring group flex min-h-[14rem] flex-col justify-between rounded-xl border border-[#0f7fd6] bg-[#0f7fd6] p-5 shadow-[0_6px_18px_rgba(15,127,214,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[#198be3]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/85 text-[#0f7fd6]">
                <Icon name="error" className="h-6 w-6" />
              </span>
              <span>
                <span className="block font-slab text-xl font-bold text-black">Look up an error code</span>
                <span className="mt-1.5 block text-[0.95rem] leading-relaxed text-black/85">
                  Got a code on the screen like 5100, 0x97, or B200? Find what it means.
                </span>
                <span className="mt-4 inline-flex items-center gap-1 font-medium text-black">
                  Browse codes <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Model picker */}
      <SelectModelSection id="printer-models" headingLevel="h2" className="scroll-mt-20 pt-14 pb-16 sm:pt-20" />

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
      <SelectModelSection id="support-printer-brands" headingLevel="h2" className="scroll-mt-20 py-16" />

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

function SelectModelSection({
  id,
  className = '',
  headingLevel: Heading = 'h2',
}: {
  id?: string;
  className?: string;
  headingLevel?: 'h1' | 'h2';
}) {
  return (
    <section id={id} className={`bg-white ${className}`}>
      <div className={wrap}>
        <Heading className="text-center font-sans text-[2rem] font-extrabold leading-tight tracking-tight text-[#111] sm:text-[3.25rem]">
          Select Your Printer Brand
        </Heading>
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
