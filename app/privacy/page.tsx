import { Breadcrumbs } from '@/components/breadcrumbs';
import { pageMetadata } from '@/lib/metadata';
import { site, legalLastUpdated } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'How PrinterFix Guides handles your information. We are an independent troubleshooting resource and collect as little personal data as possible.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Privacy Policy' }]} />
      <article className="prose-guide">
        <h1 className="text-3xl font-bold sm:text-4xl lg:text-[2.75rem]">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate/80">Last updated: {legalLastUpdated}</p>

        <p className="mt-6">
          {site.name} ("we", "us", "our") respects your privacy. This policy
          explains what information we collect when you visit the site, how we
          use it, and the choices you have. We aim to collect as little personal
          data as possible.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Information we collect</h2>
        <ul>
          <li>
            <strong>Information you give us.</strong> If you contact us — for
            example, by sending a message or email — we receive the details you
            choose to share, such as your name, email address, and the contents
            of your message.
          </li>
          <li>
            <strong>Usage data.</strong> Like most websites, our hosting and
            analytics tools may automatically record basic technical information
            such as your browser type, device, approximate region, the pages you
            visit, and the date and time of your visit. This is used in
            aggregate to understand how the site is used and is not used to
            identify you personally.
          </li>
        </ul>

        <h2 className="mt-8 text-2xl font-bold">How we use your information</h2>
        <ul>
          <li>To respond to questions or messages you send us.</li>
          <li>To operate, maintain, and improve the site and its guides.</li>
          <li>To keep the site secure and prevent abuse.</li>
          <li>To comply with legal obligations where required.</li>
        </ul>
        <p>
          We do not sell your personal information, and we do not use your data
          to send you marketing unless you have specifically asked us to.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Cookies and analytics</h2>
        <p>
          The site may use cookies or similar technologies that are necessary for
          it to function, and privacy-respecting analytics to measure traffic in
          aggregate. You can control or block cookies through your browser
          settings; doing so should not affect your ability to read the guides.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Third-party services</h2>
        <p>
          We rely on trusted third parties to host the site and provide analytics
          and form handling. These providers process data on our behalf and only
          to the extent needed to deliver their service. Our guides may also link
          to external sites (such as manufacturer support pages); their privacy
          practices are governed by their own policies, not this one.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Data retention</h2>
        <p>
          We keep the information you send us only for as long as needed to
          respond to you and for our legitimate record-keeping, after which it is
          deleted. Aggregate analytics data may be retained for longer because it
          does not identify you.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Your rights</h2>
        <p>
          Depending on where you live, you may have the right to access, correct,
          or delete the personal information we hold about you, or to object to
          how we use it. To make a request, contact us using the details below
          and we will respond within a reasonable time.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Children's privacy</h2>
        <p>
          This site is intended for a general audience and is not directed at
          children. We do not knowingly collect personal information from
          children.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Changes to this policy</h2>
        <p>
          We may update this policy from time to time. When we do, we will revise
          the "last updated" date at the top of this page. Significant changes
          will be highlighted on the site where appropriate.
        </p>

      </article>
    </div>
  );
}
