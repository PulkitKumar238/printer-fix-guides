import { allGuides } from '@/content/guides';
import { IssueCard } from '@/components/issue-card';
import { pageMetadata } from '@/lib/metadata';
import { site } from '@/lib/site';

export const metadata = pageMetadata({
  title: `${site.name} — Printer Support Guides`,
  description: site.description,
  path: '/',
});

const visibleGuides = allGuides.filter(
  (guide) => !['drivers', 'paper-jam'].includes(guide.slug),
);

export default function HomePage() {
  return (
    <main>
      <section aria-labelledby="issues-heading" className="container-page py-14 sm:py-20">
        <div className="mb-10 max-w-2xl">
          <h1 id="issues-heading" className="text-4xl font-bold sm:text-5xl">
            Choose your printer issue
          </h1>
          <p className="mt-4 text-xl text-slate">
            Select the topic that matches the problem you are experiencing.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleGuides.map((guide) => (
            <IssueCard
              key={guide.slug}
              href={`/guide/select/${guide.slug}`}
              icon={guide.icon}
              title={guide.shortTitle}
              description={guide.cardDescription}
              cta="Choose"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
