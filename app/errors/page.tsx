import Link from 'next/link';
import Image from 'next/image';
import { errorCodes } from '@/content/errors';
import { brands } from '@/content/brands';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Printer Error Codes — Look Up What Yours Means',
  description:
    'A growing reference of common HP, Canon, Epson, and Brother printer error codes — what each one means and the steps to clear it.',
  path: '/errors',
});

export default function ErrorsIndexPage() {
  // Group codes by brand for a scannable directory.
  const byBrand = errorCodes.reduce<Record<string, typeof errorCodes>>((acc, code) => {
    (acc[code.brand] ??= []).push(code);
    return acc;
  }, {});

  return (
    <div className="container-page py-8 sm:py-10">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Error codes' }]} />
      <header className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-center">
        <div className="max-w-prose">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-[2.75rem]">
            Printer error codes
          </h1>
          <p className="mt-4 text-lg text-slate">
            Find the exact code shown on your printer’s screen below. Each page
            explains what the code means in plain language and gives you the steps
            to clear it.
          </p>
        </div>
        <figure className="overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-card">
          <div className="relative aspect-[16/10]">
            <Image
              src="/images/site/errors.jpg"
              alt="A printer’s control-panel screen showing its status and network details"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 24rem"
              className="object-cover"
            />
          </div>
        </figure>
      </header>

      <div className="mt-10 space-y-10">
        {Object.entries(byBrand).map(([brandKey, codes]) => (
          <section key={brandKey} aria-labelledby={`brand-${brandKey}`}>
            <h2 id={`brand-${brandKey}`} className="mb-4 text-2xl font-bold">
              {brands[brandKey as keyof typeof brands].name}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {codes.map((code) => (
                <Link
                  key={code.code}
                  href={`/errors/${code.code.toLowerCase()}`}
                  className="focus-ring group flex items-start gap-4 rounded-xl border border-ink/10 bg-surface p-4 shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <span className="grid h-11 shrink-0 place-items-center rounded-lg bg-amber/10 px-3 font-mono text-sm font-semibold text-amber">
                    {code.code}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium text-ink group-hover:text-amber">
                      {code.title}
                    </span>
                    <span className="line-clamp-2 text-sm text-slate">
                      {code.metaDescription}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
