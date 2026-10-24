import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Wrench, Download, LifeBuoy } from "lucide-react";
import { brandName, issueLabel, useFunnel } from "@/lib/funnel";
import { SupportHeader, BreadcrumbBar, SupportFooter } from "@/components/funnel/SupportChrome";
import { Button } from "@/components/ui/button";
import { ModelSearch } from "@/components/funnel/ModelSearch";
import {
  popularModels, OTHER_BRANDS, CATALOG_BRAND_NAMES,
  type CatalogBrand,
} from "@/lib/printer-catalog";

export const Route = createFileRoute("/guide/model")({
  head: () => ({
    meta: [
      { title: "Enter Your Printer Model Number | NextGuide" },
      { name: "description", content: "Enter your printer model number or product name to get matching step-by-step support." },
      { property: "og:title", content: "Enter Your Printer Model Number | NextGuide" },
      { property: "og:description", content: "Enter your printer model number or product name to get matching step-by-step support." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ModelPage,
});

const SUPPORT_CARDS = [
  {
    t: "Printer Setup",
    d: "Get information about setting up and connecting your printer.",
    Icon: Wrench,
  },
  {
    t: "Software & Drivers",
    d: "Find information about printer software and driver compatibility.",
    Icon: Download,
  },
  {
    t: "Printer Troubleshooting",
    d: "Explore information about common printer problems.",
    Icon: LifeBuoy,
  },
] as const;

function ModelPage() {
  const { session, update } = useFunnel();
  const nav = useNavigate();
  const [model, setModel] = useState("");
  const [selectionVersion, setSelectionVersion] = useState(0);
  const searchRef = useRef<HTMLElement>(null);


  useEffect(() => { if (session?.model) setModel(session.model); }, [session?.model]);

  if (!session) {
    return (
      <div className="min-h-screen w-full bg-background">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 text-center lg:px-10">
          <p className="text-lg text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  if (!session.issue || !session.brand) {
    return (
      <div className="min-h-screen w-full bg-background">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 text-center lg:px-10">
          <p className="text-xl">
            Please <Link to="/" className="text-primary underline">choose your issue and brand</Link> first.
          </p>
        </div>
      </div>
    );
  }

  const isOther = session.brand === "other";
  const name = isOther ? "" : brandName(session.brand) + " ";

  // Brand filtering: dedicated pages search only their own brand; the Other
  // page searches only the six approved brands (Req 3 & 4).
  const brandFilter: readonly CatalogBrand[] = isOther ? OTHER_BRANDS : [session.brand as CatalogBrand];


  // Popular models: one column per brand, filtered to the page's brand(s) (Req 2 & 4).
  const popularColumns = isOther
    ? OTHER_BRANDS.map((b) => ({ brand: b, name: `${CATALOG_BRAND_NAMES[b]} Printers`, models: popularModels(b, 4) }))
    : [{ brand: session.brand, name: `${brandName(session.brand)} Printers`, models: popularModels(session.brand, 8) }];

  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    searchRef.current?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
  };
  const fill = (value: string) => { setModel(value); setSelectionVersion((version) => version + 1); };
  const choose = (value: string) => { update({ model: value, result: undefined, callbackSent: false }); nav({ to: "/guide/steps" }); };
  const searchProps = { model, brands: brandFilter, selectionVersion, onChange: setModel, onSelect: fill, onSubmit: choose };

  return (
    <div data-printer-brand={session.brand} className="printer-brand-theme min-h-screen w-full bg-background">
      <SupportHeader brand={session.brand} />

      {/* Brand-colored breadcrumb bar */}
      <BreadcrumbBar brand={session.brand}>
        Home <span className="mx-2">›</span> Printer Support <span className="mx-2">›</span> Identify Your Printer
      </BreadcrumbBar>

      <main className="w-full">
        {/* Search section — primary focus */}
        <section ref={searchRef} className="w-full scroll-mt-6 px-6 py-8 sm:px-10 sm:py-10">
          <div className="mx-auto w-full max-w-3xl text-center">
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-primary">
                Issue: {issueLabel(session.issue)}
              </span>
              <span className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-primary">
                Brand: {brandName(session.brand)}
              </span>
            </div>
                        <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
              Enter Your {name}Printer Model Number
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Enter your printer model number or product name.
            </p>

            <ModelSearch id="top" {...searchProps} />

            <p className="mt-6 text-sm text-muted-foreground">
              Independent printer assistance — not affiliated with or endorsed by any printer manufacturer.
            </p>

            <ol className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-2 sm:gap-4" aria-label="Progress">
              {["Identify", "Troubleshooting", "Resolution"].map((s, i) => (
                <li key={s} className="flex items-center gap-2">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
                  <span className={`hidden text-sm font-semibold sm:inline ${i === 0 ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                  {i < 2 && <span className="mx-1 h-px w-6 bg-border sm:w-14" />}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Where to find your model name */}
        <section className="w-full border-y border-border bg-muted/40 px-6 py-12 sm:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <h2 className="text-2xl font-bold text-foreground">Where to find your model name</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { t: "Front panel", d: "Printed near the brand logo or control panel." },
                { t: "Inside the cover", d: "Lift the ink/toner access door and check the label." },
                { t: "Back or bottom", d: "Look for the sticker with model and serial number." },
              ].map((w, i) => (
                <div key={w.t} className="rounded-2xl border border-border bg-card p-5">
                  <div className="relative mx-auto mb-3 h-16 w-24 rounded-md border-2 border-foreground/40 bg-background">
                    <div className="absolute inset-x-3 top-2 h-1.5 rounded bg-foreground/20" />
                    <span className={`absolute h-4 w-4 rounded-full bg-primary ring-4 ring-primary/30 ${i === 0 ? "bottom-2 left-2" : i === 1 ? "left-1/2 top-1 -translate-x-1/2" : "bottom-2 right-2"}`} />
                  </div>
                  <p className="font-semibold text-foreground">{w.t}</p>
                  <p className="text-sm text-muted-foreground">{w.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular models and synchronized second search */}
        <section className="w-full border-b border-border bg-muted/40 px-6 py-12 sm:px-10">
          <div className="mx-auto grid w-full max-w-7xl items-start gap-10 lg:grid-cols-2">
            <div>
            <h2 className="text-2xl font-bold text-foreground">Popular {name}Printer Models</h2>
            <div className="mt-3 h-1 w-24 rounded-full bg-primary" aria-hidden />
            <div className={`mt-8 grid gap-6 ${isOther ? "sm:grid-cols-2" : "grid-cols-1"}`}>
              {popularColumns.map((col) => (
                <div key={col.brand} data-printer-brand={col.brand} className="printer-brand-theme border-t border-border pt-4">
                  <p className="mb-3 text-base font-bold text-foreground">{col.name}</p>
                  <ul className="divide-y divide-border">
                    {col.models.map((m) => (
                      <li key={m}>
                        <Button
                          type="button" variant="link"
                          onClick={() => fill(m)}
                          className="h-auto w-full justify-start whitespace-normal px-0 py-3 text-left text-base font-medium text-primary"
                        >
                          {m}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            </div>
            <div className="min-w-0 border-t border-border pt-4 lg:sticky lg:top-8">
              <h2 className="text-2xl font-bold text-foreground">Enter Your {name}Printer Model Number</h2>
              <ModelSearch id="secondary" {...searchProps} />
            </div>
          </div>
        </section>

        {/* You might also need — clickable, scrolls to the search field */}
        <section className="w-full px-6 py-12 sm:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <h2 className="text-2xl font-bold text-foreground">You Might Also Need</h2>
            <div className="mt-3 h-1 w-24 rounded-full bg-primary" aria-hidden />
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {SUPPORT_CARDS.map(({ t, d, Icon }) => (
                <Button
                  variant="outline"
                  key={t}
                  type="button"
                  onClick={() => scrollToSearch()}
                  className="flex h-auto flex-col items-start justify-start whitespace-normal rounded-md border border-border bg-card p-6 text-left transition-colors hover:border-primary/50"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
                    <Icon className="h-7 w-7 text-primary" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-foreground">{t}</h3>
                  <p className="mt-2 text-base text-muted-foreground">{d}</p>
                </Button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SupportFooter />
    </div>
  );
}
