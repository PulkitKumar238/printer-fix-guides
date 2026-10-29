import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/funnel/Shell";
import { BRANDS, issueLabel, useFunnel, type BrandId } from "@/lib/funnel";

export const Route = createFileRoute("/guide/select/$issue")({
  head: ({ params }) => ({
    meta: [
      { title: `Select Your Printer Brand — ${issueLabel(params.issue)} | NextGuide` },
      { name: "description", content: "Choose your printer brand to get simple, guided printer help." },
      { property: "og:title", content: "Select Your Printer Brand | NextGuide" },
      { property: "og:description", content: "Choose your printer brand to get simple, guided printer help." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BrandPage,
});

function BrandPage() {
  const { issue } = Route.useParams();
  const { session, update } = useFunnel();
  const nav = useNavigate();
  const [brand, setBrand] = useState<BrandId | undefined>();

  useEffect(() => {
    if (!session) return;
    if (session.brand && !brand) setBrand(session.brand);
  }, [session, issue]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (b: BrandId) => { setBrand(b); update({ issue, brand: b, model: undefined, result: undefined, callbackSent: false }); nav({ to: "/guide/model" }); };

  return (
    <Shell issue={issueLabel(issue)}>
      <h1 className="mb-6 text-center text-3xl font-bold text-foreground sm:text-4xl">Select Your Printer Brand</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {BRANDS.map((b) => (
          <button
            key={b.id}
            type="button"
            aria-label={`${b.name} printers`}
            onClick={() => pick(b.id)}
            aria-pressed={brand === b.id}
            className={`flex h-32 items-center justify-center rounded-2xl border-2 bg-card cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 sm:h-36 ${b.id === "other" ? "col-span-2 sm:col-span-1" : ""} ${
              brand === b.id ? "border-primary ring-4 ring-primary/15" : "border-border hover:border-primary/50"
            }`}
          >
            <BrandMark id={b.id} />
          </button>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-muted p-6">
        <h2 className="mb-3 text-xl font-bold text-foreground">How It Works</h2>
        <ol className="space-y-2 text-lg text-muted-foreground">
          <li>1. Tap your printer brand, then enter your printer model.</li>
          <li>2. Follow guided printer instructions.</li>
          <li>3. Get assistance if needed.</li>
        </ol>
      </div>
    </Shell>
  );
}

// Text wordmarks (no trademarked logo files) for brand recognition.
function BrandMark({ id }: { id: BrandId }) {
  const styles: Record<BrandId, string> = {
    hp: "font-bold italic text-4xl lowercase text-brand-hp sm:text-[2.625rem]",
    canon: "font-black text-4xl tracking-tight text-brand-canon sm:text-[2.625rem]",
    epson: "font-extrabold text-4xl tracking-wider text-brand-epson sm:text-[2.625rem]",
    brother: "font-bold text-3xl lowercase tracking-wide text-brand-brother sm:text-[2.125rem]",
    other: "font-semibold text-2xl text-foreground sm:text-[1.75rem]",
  };
  const label = { hp: "hp", canon: "Canon", epson: "EPSON", brother: "brother", other: "Other Brand" }[id];
  return <span className={styles[id]}>{label}</span>;
}
