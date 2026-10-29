import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { brandName, useFunnel } from "@/lib/funnel";
import { SupportHeader, BreadcrumbBar, SupportFooter } from "@/components/funnel/SupportChrome";
import { ModelSearch } from "@/components/funnel/ModelSearch";

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

function ModelPage() {
  const { session, update } = useFunnel();
  const nav = useNavigate();
  const [model, setModel] = useState("");

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

  const choose = (value: string) => { update({ model: value, result: undefined, callbackSent: false }); nav({ to: "/guide/steps" }); };

  return (
    <div data-printer-brand={session.brand} className="printer-brand-theme flex min-h-screen w-full flex-col bg-background">
      <SupportHeader brand={session.brand} />

      <BreadcrumbBar brand={session.brand}>
        Home <span className="mx-2">›</span> Printer Support <span className="mx-2">›</span> Identify Your Printer
      </BreadcrumbBar>

      <main className="flex w-full flex-1 items-center px-6 py-16 sm:px-10">
        <div className="mx-auto w-full max-w-[620px] text-center lg:mx-0">
          <h1 className="text-left text-3xl font-bold text-foreground sm:text-4xl">
            {session.brand === "other" ? "Other Printer" : brandName(session.brand)} Support and Troubleshooting
          </h1>
          <h2 className="mt-4 text-left text-xl font-bold text-foreground sm:text-2xl">
            Enter your printer model number
          </h2>
          <ModelSearch id="top" model={model} onChange={setModel} onSubmit={choose} />
          <ol className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-2 sm:gap-4" aria-label="Progress">
            {["Identify", "Troubleshooting", "Resolution"].map((step, index) => (
              <li key={step} className="flex items-center gap-2">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{index + 1}</span>
                <span className={`hidden text-sm font-semibold sm:inline ${index === 0 ? "text-foreground" : "text-muted-foreground"}`}>{step}</span>
                {index < 2 && <span className="mx-1 h-px w-6 bg-border sm:w-14" />}
              </li>
            ))}
          </ol>
        </div>
      </main>

      <SupportFooter brand={session.brand} />
    </div>
  );
}
