import type { Metadata } from 'next';
import { Inter, Zilla_Slab, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SupportChatLoader } from '@/components/support-chat-loader';
import { JsonLd } from '@/components/json-ld';
import { websiteSchema } from '@/lib/schema';
import { site, absoluteUrl } from '@/lib/site';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const zilla = Zilla_Slab({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-zilla',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Fix Common Printer Problems`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  keywords: [
    'printer troubleshooting',
    'printer offline',
    'install printer drivers',
    'printer wifi',
    'paper jam',
    'printer error codes',
  ],
  openGraph: {
    type: 'website',
    locale: site.locale,
    siteName: site.name,
    title: `${site.name} — Fix Common Printer Problems`,
    description: site.description,
    url: site.url,
    images: [{ url: absoluteUrl('/images/site/hero.jpg'), width: 1152, height: 768, alt: site.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Fix Common Printer Problems`,
    description: site.description,
    images: [absoluteUrl('/images/site/hero.jpg')],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${zilla.variable} ${jetbrains.variable}`}>
      <body className="flex min-h-screen flex-col">
        <JsonLd data={websiteSchema()} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <SupportChatLoader />
      </body>
    </html>
  );
}
