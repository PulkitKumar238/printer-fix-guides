import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PrinterFix Guides — Printer Support Guides" },
      { name: "description", content: "Choose a printer issue and follow an independent support guide." },
      { property: "og:title", content: "PrinterFix Guides — Printer Support Guides" },
      { property: "og:description", content: "Choose a printer issue and follow an independent support guide." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const issues = [
  { slug: "setup", title: "New printer setup", description: "Unbox, connect, and print your first page — without the guesswork.", icon: "setup" },
  { slug: "offline", title: "Printer offline", description: 'Get a printer that says "offline" talking to your computer again.', icon: "offline" },
  { slug: "wifi", title: "Wi-Fi drops", description: "Stop a printer that connects fine, then drops off the network an hour later.", icon: "wifi" },
  { slug: "not-printing", title: "Not printing", description: "Connected and ready, but nothing comes out? Work through the causes in order.", icon: "not-printing" },
  { slug: "scanner", title: "Scanner issues", description: "Printer prints fine but scanning fails? Get the scanner responding again.", icon: "scanner" },
] as const;

function IssueIcon({ name }: { name: (typeof issues)[number]["icon"] }) {
  const shared = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...shared}>
      {name === "setup" && <><rect x="4" y="9" width="16" height="8" rx="1.5" /><path d="M7 9V5.5A1.5 1.5 0 0 1 8.5 4h7A1.5 1.5 0 0 1 17 5.5V9M7 17v2.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5V17m2.5-12.2.9.5M21 7.2l-1 .2" /><circle cx="16.5" cy="12.5" r="0.9" fill="currentColor" stroke="none" /></>}
      {name === "offline" && <><rect x="4" y="8" width="16" height="9" rx="1.5" /><path d="M7 8V5h10v3M9 21h6M4 4l16 16" /></>}
      {name === "wifi" && <><path d="M5 9.5a10 10 0 0 1 14 0M7.5 12.5a6.5 6.5 0 0 1 9 0M10 15.5a3 3 0 0 1 4 0" /><circle cx="12" cy="18.5" r="0.9" fill="currentColor" stroke="none" /></>}
      {name === "not-printing" && <><path d="M7 8V4h10v4M6 8h12a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2M5 16H5a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2" /><rect x="7" y="14" width="10" height="6" rx="1" /><path d="m10 16.5 4 3m0-3-4 3" /></>}
      {name === "scanner" && <><rect x="3.5" y="6" width="17" height="12" rx="1.5" /><path d="M4 12h16M7 9h6" /></>}
    </svg>
  );
}

function Index() {
  return (
    <main className="legacy-home min-h-screen bg-white text-[#123b63]">
      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h1 className="legacy-home-heading text-4xl font-bold sm:text-5xl">Choose your printer issue</h1>
          <p className="mt-4 text-xl text-[#48637a]">Select the topic that matches the problem you are experiencing.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => (
            <Link key={issue.slug} to="/guide/select/$issue" params={{ issue: issue.slug }} className="legacy-issue-card group flex h-full flex-col rounded-2xl border border-[#123b63]/10 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#146fd1]">
              <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-[#146fd1]/10 text-[#146fd1] transition-colors group-hover:bg-[#146fd1] group-hover:text-white"><IssueIcon name={issue.icon} /></span>
              <h2 className="legacy-home-heading text-xl font-bold">{issue.title}</h2>
              <p className="mt-1.5 flex-1 text-[0.95rem] leading-relaxed text-[#48637a]">{issue.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 font-medium text-[#146fd1]">Choose <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span></span>
            </Link>
          ))}
        </div>
      </section>
      <div className="h-2 bg-[#123b63]" aria-hidden="true" />
      <footer className="py-5 text-center text-sm text-[#48637a]">Independent printer assistance. Not affiliated with any printer manufacturer.</footer>
    </main>
  );
}
