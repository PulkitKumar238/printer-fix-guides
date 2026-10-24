/*
 * Shared full-width header / breadcrumb / footer chrome for the
 * /guide/model and /guide/steps pages only. Scoped here so no other
 * page (especially the homepage) is affected.
 */
import type { ReactNode } from "react";
import { Printer, Search, User } from "lucide-react";
import { breadcrumbColor } from "@/lib/printer-catalog";
import { brandName } from "@/lib/funnel";

const NAV_ITEMS = ["Home", "Printers", "Software & Drivers", "Support", "Contact"];

const FOOTER_COLUMNS = [
  { h: "Printer Support", items: ["Printer Identification", "Printer Setup", "Software & Drivers", "Driver Guidance", "Troubleshooting"] },
  { h: "Printer Types", items: ["Inkjet Printers", "Laser Printers", "Wireless Printers", "All-in-One Printers", "Office Printers"] },
  { h: "Help & Information", items: ["Support Information", "Frequently Asked Questions", "Product Guidance", "General Assistance", "Contact Information"] },
  { h: "Company", items: ["About Us", "Our Services", "Privacy Policy", "Terms of Service", "Independent Support Disclosure"] },
] as const;

export function SupportHeader({ brand }: { brand?: string }) {
  return (
    <>
      {/* Announcement strip */}
      <div className="w-full bg-support-navy text-support-on-dark">
        <p className="mx-auto w-full max-w-7xl px-6 py-2 text-center text-sm sm:px-10">
          Professional printer assistance — model identification, setup and troubleshooting guidance
        </p>
      </div>

      {/* Main header */}
      <header className="w-full bg-support-header text-support-header-foreground">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3 sm:px-10">
          <BrandBadge brand={brand} />
          <div className="flex items-center gap-5 opacity-80" aria-hidden>
            <Search className="h-5 w-5" />
            <User className="h-5 w-5" />
          </div>
        </div>
      </header>

      {/* Secondary navigation — display only */}
      <nav className="w-full border-b border-border bg-background" aria-label="Site sections">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap gap-x-8 gap-y-1 px-6 py-3 sm:px-10" aria-hidden>
          {NAV_ITEMS.map((item) => (
            <span key={item} className="cursor-default text-sm font-medium text-muted-foreground sm:text-base">
              {item}
            </span>
          ))}
        </div>
      </nav>
    </>
  );
}

/** Full-width brand-colored breadcrumb bar (Req 21). */
export function BreadcrumbBar({ brand, children }: { brand?: string; children: ReactNode }) {
  return (
    <div
      className="w-full text-white transition-colors"
      style={{ backgroundColor: breadcrumbColor(brand) }}
    >
      <p className="mx-auto w-full max-w-7xl px-6 py-4 text-sm font-medium sm:px-10" aria-hidden>
        {children}
      </p>
    </div>
  );
}

/** Local brand images, so logos load on Netlify as well as in development. */
const BRAND_ASSETS: Record<string, string> = {
  hp: "/images/brands/logos/hp.png",
  epson: "/images/brands/logos/epson.png",
  brother: "/images/brands/logos/brother.png",
};

/** Compact brand logo shown at the top-left of each brand page — no extra labels. */
export function BrandBadge({ brand }: { brand?: string | undefined }) {
  const label = brandName(brand);
  const asset = brand ? BRAND_ASSETS[brand] : undefined;
  if (asset) {
    return <img src={asset} alt={`${label} logo`} className="h-9 w-auto max-w-[140px] object-contain" loading="eager" />;
  }
  if (!label || brand === "other") return <span className="flex items-center gap-2 text-lg font-bold"><Printer className="h-7 w-7 text-primary" aria-hidden />Other Printers</span>;
  return (
    <span className="text-3xl font-black text-primary" aria-label={`${label} brand`}>
      {label}
    </span>
  );
}

export function SupportFooter() {
  return (
    <footer className="w-full bg-support-footer text-support-footer-foreground">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.h}>
              <p className="mb-4 text-lg font-bold">{col.h}</p>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item} className="text-sm opacity-80">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-support-footer-foreground/20 pt-6 text-sm opacity-80">
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
