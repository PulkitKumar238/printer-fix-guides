import Link from 'next/link';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { pageMetadata } from '@/lib/metadata';
import { site, legalLastUpdated } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Terms & Conditions',
  description:
    'The terms that govern your use of PrinterFix Guides, an independent printer troubleshooting resource.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Terms & Conditions' }]} />
      <article className="prose-guide">
        <h1 className="text-3xl font-bold sm:text-4xl lg:text-[2.75rem]">
          Terms &amp; Conditions
        </h1>
        <p className="mt-2 text-sm text-slate/80">Last updated: {legalLastUpdated}</p>

        <p className="mt-6">
          These terms and conditions (“Terms”) govern your use of {site.name}
          (the “site”). By accessing or using the site, you agree to these Terms.
          If you do not agree, please do not use the site.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Use of the site</h2>
        <p>
          You may use the site for your own personal, non-commercial
          troubleshooting purposes. You agree not to misuse the site, including
          by attempting to disrupt it, access it through automated means at a
          scale that burdens our servers, or use it in any way that breaks
          applicable law.
        </p>

        <h2 className="mt-8 text-2xl font-bold">No warranty</h2>
        <p>
          The guides are provided “as is” and for general information only. As
          set out in our{' '}
          <Link href="/disclaimer">disclaimer</Link>, we make no warranty that
          the content is accurate, complete, or suitable for your specific
          printer, and you follow the guides at your own risk.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, {site.name} and its author will
          not be liable for any direct, indirect, or consequential loss or damage
          — including damage to equipment, loss of data, or voided warranties —
          arising from your use of, or inability to use, the site or its content.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Intellectual property</h2>
        <p>
          The original text, layout, and design of the site are the property of
          {' '}{site.name} and may not be copied or republished in bulk without
          permission. You are welcome to follow the guides and share links to
          them. Brand and product names mentioned on the site belong to their
          respective owners and are used only for identification.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Third-party links</h2>
        <p>
          The site may link to third-party websites, such as manufacturer support
          and driver download pages. We provide these links for convenience only
          and are not responsible for the content, products, or practices of any
          third-party site.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Changes to the site and Terms</h2>
        <p>
          We may update, change, or remove content and these Terms at any time
          without notice. The “last updated” date above shows when the Terms were
          last revised. Continuing to use the site after changes means you accept
          the updated Terms.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Governing law</h2>
        <p>
          These Terms are governed by the laws of the jurisdiction in which the
          site operator is based, without regard to conflict-of-law rules.
        </p>

      </article>
    </div>
  );
}
