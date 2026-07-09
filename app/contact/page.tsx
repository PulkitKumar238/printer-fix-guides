import { Breadcrumbs } from '@/components/breadcrumbs';
import { ContactForm } from '@/components/contact-form';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Contact PrinterFix Guides',
  description:
    'Get in touch about a guide, a correction, or a printer problem you’re stuck on. Use the live chat for a quick answer from a real person, or send us a message.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Contact' }]} />
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">Contact us</h1>
        <p className="mt-3 text-lg text-slate">
          Followed a guide and still stuck, or spotted something we got wrong? For a quick answer, use the
          live chat button in the bottom-right corner — a real person replies there. Prefer email? Send a
          message below.
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
