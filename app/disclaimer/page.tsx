import { Breadcrumbs } from '@/components/breadcrumbs';
import { pageMetadata } from '@/lib/metadata';
import { site, legalLastUpdated } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Disclaimer',
  description:
    'How to use the troubleshooting guides on PrinterFix Guides safely. The site is an independent, informational resource and is not affiliated with any printer manufacturer.',
  path: '/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Disclaimer' }]} />
      <article className="prose-guide">
        <h1 className="text-3xl font-bold sm:text-4xl lg:text-[2.75rem]">Disclaimer</h1>
        <p className="mt-2 text-sm text-slate/80">Last updated: {legalLastUpdated}</p>

        <h2 className="mt-8 text-2xl font-bold">Information only</h2>
        <p>
          {site.name} provides general troubleshooting guides for common printer
          problems. The content is offered for informational and educational
          purposes only. While we work to keep every guide accurate and up to
          date, printer models, drivers, and operating systems change often, and
          we make no warranty — express or implied — that the information is
          complete, current, or suitable for your specific device.
        </p>

        <h2 className="mt-8 text-2xl font-bold">No professional advice</h2>
        <p>
          The guides are not a substitute for the official documentation or
          support provided by your printer’s manufacturer. Always check your
          model’s manual before attempting a repair, especially anything that
          involves opening the printer, handling ink or toner, or work that may
          be covered by a warranty.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Use at your own risk</h2>
        <p>
          You follow these guides at your own risk. To the fullest extent
          permitted by law, {site.name} and its author accept no liability for
          any loss or damage — including damage to hardware, loss of data, or
          voided warranties — arising from the use of, or reliance on, the
          information on this site. If you are unsure about any step, stop and
          consult the manufacturer or a qualified technician.
        </p>

        <h2 className="mt-8 text-2xl font-bold">Not affiliated with any brand</h2>
        <p>
          {site.name} is an independent resource and is not affiliated with,
          endorsed by, or sponsored by HP, Canon, Epson, Brother, or any other
          printer manufacturer. Brand and product names are the property of their
          respective owners and are used only to identify the products these
          guides help with.
        </p>

        <h2 className="mt-8 text-2xl font-bold">External links</h2>
        <p>
          Some guides link to official manufacturer pages or other third-party
          websites. We do not control those sites and are not responsible for
          their content, accuracy, or any software you download from them. When
          we suggest downloading drivers or software, always use the official
          manufacturer source.
        </p>

      </article>
    </div>
  );
}
