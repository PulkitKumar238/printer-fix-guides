import { Link } from "@tanstack/react-router";

const problemGuides = [
  { label: "New printer setup", issue: "setup" },
  { label: "Printer offline", issue: "offline" },
  { label: "Wi-Fi drops", issue: "wifi" },
  { label: "Not printing", issue: "not-printing" },
  { label: "Paper jam", issue: "paper-jam" },
  { label: "Scanner issues", issue: "scanner" },
] as const;

const brands = ["HP", "Canon", "Epson", "Brother", "Samsung", "Lexmark", "Xerox"] as const;
const sitePages = ["About", "Contact", "Disclaimer", "Privacy Policy", "Terms & Conditions"] as const;

/** The original full-width homepage footer, kept separate from the guide-page footer. */
export function HomeFooter() {
  const wrap = "mx-auto w-full px-6 sm:px-10 lg:px-16";

  return (
    <footer className="w-full border-t border-[#123B63]/10 bg-[#123B63] text-white">
      <div className={`${wrap} grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-8`}>
        <div className="max-w-sm">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-white/10 text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="4" y="9" width="16" height="8" rx="1.5" />
                <path d="M7 9V5h10v4M7 17v2h10v-2" />
                <circle cx="16.5" cy="12.5" r="0.9" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <span className="legacy-home-heading text-base font-bold">Printer<span className="text-[#146FD1]">Fix</span></span>
          </Link>
          <p className="mt-3 text-[0.6875rem] leading-relaxed text-white/65">
            Our guides can help you understand common printer problems and find the appropriate solution.
          </p>
        </div>

        <nav aria-label="Problem guides">
          <h2 className="mb-3 text-[0.625rem] font-semibold uppercase tracking-widest text-white/50">Problem guides</h2>
          <ul className="space-y-1.5 text-[0.6875rem]">
            {problemGuides.map(({ label, issue }) => (
              <li key={issue}>
                <Link to="/guide/select/$issue" params={{ issue }} className="text-white/85 transition-colors hover:text-[#146FD1]">{label}</Link>
              </li>
            ))}
            <li><span className="text-white/85">Find your fix (guided)</span></li>
          </ul>
        </nav>

        <nav aria-label="Brands and error codes">
          <h2 className="mb-3 text-[0.625rem] font-semibold uppercase tracking-widest text-white/50">By brand</h2>
          <ul className="space-y-1.5 text-[0.6875rem]">
            {brands.map((brand) => <li key={brand}><span className="text-white/85">{brand} printer help</span></li>)}
            <li><span className="text-white/85">All error codes (10)</span></li>
          </ul>
        </nav>

        <nav aria-label="Site">
          <h2 className="mb-3 text-[0.625rem] font-semibold uppercase tracking-widest text-white/50">Site</h2>
          <ul className="space-y-1.5 text-[0.6875rem]">
            {sitePages.map((page) => <li key={page}><span className="text-white/85">{page}</span></li>)}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className={`${wrap} flex flex-col gap-2 py-3 text-[0.625rem] text-white/55 lg:flex-row lg:items-center lg:justify-between`}>
          <p>© {new Date().getFullYear()} PrinterFix Guides. An independent help resource.</p>
          <p className="lg:max-w-2xl lg:text-right">
            Not affiliated with HP, Canon, Epson, Brother, or any printer manufacturer. Brand names are used only to identify the products these guides help with. Follow your printer’s manual for warranty-safe repairs.
          </p>
        </div>
      </div>
    </footer>
  );
}
