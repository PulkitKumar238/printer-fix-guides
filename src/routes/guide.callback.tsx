import { createFileRoute, Link } from "@tanstack/react-router";
import { CallbackForm } from "@/components/funnel/Assistance";
import { BreadcrumbBar, SupportFooter, SupportHeader } from "@/components/funnel/SupportChrome";
import { issueLabel, useFunnel } from "@/lib/funnel";

export const Route = createFileRoute("/guide/callback")({
  head: () => ({
    meta: [
      { title: "Request a Callback | NextGuide" },
      { name: "description", content: "Request a call about your selected printer issue." },
    ],
  }),
  component: CallbackPage,
});

function CallbackPage() {
  const { session, update } = useFunnel();

  if (!session) {
    return <main className="mx-auto max-w-2xl px-6 py-24 text-center text-lg text-muted-foreground">Loading…</main>;
  }

  if (!session.issue || !session.brand || !session.model) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center text-xl">
        Please <Link to="/" className="text-primary underline">start from the beginning</Link>.
      </main>
    );
  }

  return (
    <div data-printer-brand={session.brand} className="printer-brand-theme min-h-screen w-full bg-background">
      <SupportHeader brand={session.brand} />
      <BreadcrumbBar brand={session.brand}>
        Home <span className="mx-2">›</span> Printer Support <span className="mx-2">›</span> {issueLabel(session.issue)}
      </BreadcrumbBar>

      <main className="w-full px-6 py-10 sm:px-10 sm:py-14">
        <div className="mx-auto w-full max-w-2xl">
          <Link to="/guide/steps" className="text-base font-medium text-primary hover:underline">← Back to support options</Link>
          <h1 className="mt-8 text-3xl font-bold text-foreground">Request a Callback</h1>
          <p className="mt-2 text-lg text-muted-foreground">Enter your phone number and choose your country below.</p>
          <CallbackForm session={session} update={update} />
        </div>
      </main>

      <SupportFooter />
    </div>
  );
}
