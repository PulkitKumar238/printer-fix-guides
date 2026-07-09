import { DiagnoseFlow } from '@/components/diagnose-flow';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { pageMetadata } from '@/lib/metadata';
import { guideOrder } from '@/content/guides';
import type { GuideSlug } from '@/lib/types';

export const metadata = pageMetadata({
  title: 'Find your fix — guided printer diagnosis',
  description:
    'Answer three quick questions — your issue, printer brand, and model — and we’ll point you straight to the matching step-by-step guide.',
  path: '/diagnose',
});

export default function DiagnosePage({ searchParams }: { searchParams: { issue?: string } }) {
  const raw = searchParams.issue ?? '';
  const initialIssue = (guideOrder as string[]).includes(raw) ? (raw as GuideSlug) : null;

  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Find your fix' }]} />
      <DiagnoseFlow initialIssue={initialIssue} />
    </div>
  );
}
