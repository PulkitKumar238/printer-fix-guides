import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { errorCodes, getErrorCode } from '@/content/errors';
import { brands } from '@/content/brands';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ContentBlocks } from '@/components/content-blocks';
import { DiagnosticSteps } from '@/components/diagnostic-steps';
import { RelatedGuides } from '@/components/related-guides';
import { JsonLd } from '@/components/json-ld';
import { errorSchemas } from '@/lib/schema';
import { pageMetadata } from '@/lib/metadata';

export function generateStaticParams() {
  return errorCodes.map((e) => ({ code: e.code.toLowerCase() }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { code: string } }): Metadata {
  const error = getErrorCode(params.code);
  if (!error) return {};
  return pageMetadata({
    title: error.metaTitle,
    description: error.metaDescription,
    path: `/errors/${error.code.toLowerCase()}`,
  });
}

export default function ErrorCodePage({ params }: { params: { code: string } }) {
  const error = getErrorCode(params.code);
  if (!error) notFound();

  const brand = brands[error.brand];

  return (
    <article className="container-page py-8 sm:py-10">
      <JsonLd data={errorSchemas(error)} />
      <Breadcrumbs
        items={[
          { name: 'Home', href: '/' },
          { name: 'Error codes', href: '/errors' },
          { name: error.code.toUpperCase() },
        ]}
      />

      <div className="mx-auto max-w-4xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-10">
          <div>
            <header>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-ink px-3 py-1.5 font-mono text-sm font-semibold text-paper">
                  {error.code.toUpperCase()}
                </span>
                <Link
                  href={`/brands/${brand.key}`}
                  className="rounded-full bg-amber/10 px-3 py-1 text-sm font-medium text-amber hover:bg-amber/20"
                >
                  {brand.name}
                </Link>
              </div>
              <h1 className="text-3xl font-bold sm:text-4xl">{error.title}</h1>
            </header>

            <section aria-labelledby="meaning-heading" className="mt-8 max-w-prose">
              <h2 id="meaning-heading" className="mb-3 text-2xl font-bold">
                What it means
              </h2>
              <ContentBlocks blocks={error.meaning} />
            </section>
          </div>

          <figure className="order-first w-full overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-card lg:order-none lg:sticky lg:top-24">
            <div className="relative aspect-[4/3]">
              <Image
                src={`/images/brands/${brand.key}.jpg`}
                alt={`A ${brand.name} printer`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 18rem"
                className="object-cover"
              />
            </div>
          </figure>
        </div>

        <section aria-labelledby="fix-heading" className="mt-12">
          <h2 id="fix-heading" className="mb-2 text-2xl font-bold">
            How to fix it
          </h2>
          <p className="mb-6 max-w-prose text-slate">
            Try these in order — most {brand.name} {error.code.toUpperCase()} cases
            clear within the first couple of steps.
          </p>
          <DiagnosticSteps steps={error.fixes} />
        </section>

        <div className="mt-8 rounded-2xl border border-ink/10 bg-surface p-6 shadow-card">
          <p className="text-slate">
            Still stuck after these steps? The{' '}
            <Link href={`/brands/${brand.key}`} className="font-medium text-amber hover:underline">
              {brand.name} help hub
            </Link>{' '}
            covers more issues, or browse{' '}
            <Link href="/errors" className="font-medium text-amber hover:underline">
              all error codes
            </Link>
            .
          </p>
        </div>

        <div className="mt-12">
          <RelatedGuides links={error.related} heading="Where to go next" />
        </div>
      </div>
    </article>
  );
}
