import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ContentBlocks } from '@/components/content-blocks';
import { pageMetadata } from '@/lib/metadata';
import { allGuides } from '@/content/guides';
import { errorCodes } from '@/content/errors';
import { site } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'About PrinterFix Guides',
  description:
    'What PrinterFix Guides is, who maintains it, and why it exists — an independent, ad-light printer troubleshooting resource with no phone lines or upsells.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'About' }]} />
      <article className="max-w-prose">
        <h1 className="text-3xl font-bold sm:text-4xl lg:text-[2.75rem]">
          About {site.name}
        </h1>

        <figure className="my-6 overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-card">
          <div className="relative aspect-[3/2]">
            <Image
              src="/images/site/desk.jpg"
              alt="A home office with printers set up on a desk"
              fill
              sizes="(max-width: 768px) 100vw, 65ch"
              className="object-cover"
            />
          </div>
        </figure>

        <ContentBlocks
          blocks={[
            {
              type: 'paragraph',
              text: `${site.name} is a small, independent collection of printer troubleshooting guides. It exists for one reason: when a printer stops working, most of the help you find online is either a thin page padded with keywords that ends in "call this number", or a manufacturer support article so cautious it never quite tells you what to do. This site is the opposite — specific steps, written plainly, with nothing to sell you.`,
            },
            {
              type: 'paragraph',
              text: `Every guide is built around the actual sequence you’d follow if you were standing in front of the printer: the most likely cause first, then the next, with the exact menus to open ("Settings > Bluetooth & devices > Printers & scanners", not "check your settings"). Where a fix differs between Windows and macOS, or between HP, Canon, Epson, and Brother, the difference is spelled out rather than glossed over.`,
            },
            {
              type: 'paragraph',
              text: 'What you will not find here, on purpose:',
            },
            {
              type: 'list',
              items: [
                'No phone numbers and no "call a technician now" buttons.',
                'No live-chat pop-ups or fake "an agent is waiting" widgets.',
                'No pressure to download a "driver updater" tool — we always point you to the official manufacturer software.',
                'No affiliation with any printer brand. Brand names appear only to identify the products these guides help with.',
              ],
            },
            {
              type: 'paragraph',
              text: `The content is currently maintained as a personal project by its author, drawing on hands-on experience fixing the same handful of problems again and again — printers that say "offline" for no clear reason, drivers that won’t install, Wi-Fi that drops overnight, and the cryptic error codes each brand throws. The guides are reviewed and updated as operating systems and printer software change.`,
            },
            {
              type: 'note',
              text: 'These guides aim to be accurate and safe, but every printer model is a little different. For anything involving the inside of the printer or warranty-covered repairs, always check your model’s official manual first.',
            },
            {
              type: 'paragraph',
              text: `Right now the site covers ${allGuides.length} core problem guides, ${errorCodes.length} common error codes, and dedicated hubs for the four biggest brands. It grows as new problems and codes come up.`,
            },
          ]}
        />

        <div className="mt-8">
          <Link
            href="/"
            className="focus-ring rounded-full border border-ink/15 bg-surface px-5 py-2.5 font-medium text-ink hover:border-ink/30"
          >
            Browse the guides
          </Link>
        </div>
      </article>
    </div>
  );
}
