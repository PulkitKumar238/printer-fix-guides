import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { brandOrder, getBrand } from '@/content/brands';
import { guides } from '@/content/guides';
import { errorCodes } from '@/content/errors';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ContentBlocks } from '@/components/content-blocks';
import { IssueCard } from '@/components/issue-card';
import { Faq } from '@/components/faq';
import { JsonLd } from '@/components/json-ld';
import { faqSchema, breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/metadata';

export function generateStaticParams() {
  return brandOrder.map((brand) => ({ brand }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { brand: string } }): Metadata {
  const brand = getBrand(params.brand);
  if (!brand) return {};
  return pageMetadata({
    title: brand.metaTitle,
    description: brand.metaDescription,
    path: `/brands/${brand.key}`,
  });
}

export default function BrandPage({ params }: { params: { brand: string } }) {
  const brand = getBrand(params.brand);
  if (!brand) notFound();

  const brandCodes = errorCodes.filter((e) => e.brand === brand.key);

  return (
    <div className="container-page py-8 sm:py-10">
      <JsonLd
        data={[
          faqSchema(brand.faqs),
          breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Brands', url: '/' },
            { name: brand.name, url: `/brands/${brand.key}` },
          ]),
        ]}
      />
      <Breadcrumbs
        items={[{ name: 'Home', href: '/' }, { name: `${brand.name} help` }]}
      />

      <header className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="max-w-prose">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-[2.75rem]">
            {brand.name} printer help
          </h1>
          <div className="mt-4">
            <ContentBlocks blocks={brand.intro} />
          </div>
        </div>
        <figure className="overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-card">
          <div className="relative aspect-[4/3]">
            <Image
              src={`/images/brands/${brand.key}.jpg`}
              alt={`A ${brand.name} printer`}
              fill
              sizes="(max-width: 1024px) 100vw, 34rem"
              className="object-cover"
              priority
            />
          </div>
        </figure>
      </header>

      {/* Relevant guides */}
      <section aria-labelledby="guides-heading" className="mt-12">
        <h2 id="guides-heading" className="mb-6 text-2xl font-bold sm:text-3xl">
          {brand.name} troubleshooting guides
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {brand.guideSlugs.map((slug) => {
            const g = guides[slug];
            return (
              <IssueCard
                key={slug}
                href={`/${g.slug}`}
                icon={g.icon}
                title={g.shortTitle}
                description={g.cardDescription}
                cta="Open guide"
              />
            );
          })}
        </div>
      </section>

      {/* Brand error codes */}
      {brandCodes.length > 0 && (
        <section aria-labelledby="codes-heading" className="mt-12">
          <h2 id="codes-heading" className="mb-6 text-2xl font-bold sm:text-3xl">
            Common {brand.name} error codes
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {brandCodes.map((code) => (
              <Link
                key={code.code}
                href={`/errors/${code.code.toLowerCase()}`}
                className="focus-ring group flex items-center gap-4 rounded-xl border border-ink/10 bg-surface p-4 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <span className="grid h-11 shrink-0 place-items-center rounded-lg bg-amber/10 px-3 font-mono text-sm font-semibold text-amber">
                  {code.code}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink group-hover:text-amber">
                    {code.title}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Faq items={brand.faqs} heading={`${brand.name} printer FAQ`} />
    </div>
  );
}
