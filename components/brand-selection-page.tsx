import Link from 'next/link';
import type { Guide } from '@/lib/types';

const brands = [
  { name: 'HP', code: 'one' },
  { name: 'Brother', code: 'two' },
  { name: 'Epson', code: 'three' },
  { name: 'Canon', code: 'four' },
  { name: 'Other', code: 'five' },
] as const;

const moreGuides = [
  { title: 'Printer Offline Guide', href: '/guide/select/offline' },
  { title: 'Common Issue Guide', href: '/guide/select/not-printing' },
  { title: 'Hardware Problem Guide', href: '/guide/select/paper-jam' },
];

export function BrandSelectionPage({ guide }: { guide: Guide }) {
  return (
    <main className="bg-white text-[#1a1a1a]">
      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#1769c2]">
            Selected topic: {guide.shortTitle}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Select Your Printer Brand
          </h1>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
          {brands.map((brand) => (
            <Link
              key={brand.code}
              href={`/guide/${brand.code}/${guide.slug}`}
              className="focus-ring group grid min-h-36 place-items-center rounded-2xl border-2 border-[#d8e0e9] bg-white p-5 text-center shadow-card transition-all hover:-translate-y-0.5 hover:border-[#1769c2] hover:shadow-card-hover sm:min-h-44"
            >
              <span className="text-2xl font-bold text-[#1769c2] group-hover:text-[#0d4e96]">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="border-t border-black/10 bg-[#f4f7fa]">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <h2 className="text-center text-3xl font-extrabold text-[#111] sm:text-4xl">
            More Guide for this
          </h2>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {moreGuides.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="focus-ring group flex min-h-40 items-center justify-between rounded-2xl border border-[#cad5e1] bg-white p-7 text-[#174a8b] shadow-card transition-all hover:-translate-y-0.5 hover:border-[#1769c2] hover:shadow-card-hover"
              >
                <span className="text-xl font-bold">{item.title}</span>
                <span aria-hidden className="text-2xl transition-transform group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
