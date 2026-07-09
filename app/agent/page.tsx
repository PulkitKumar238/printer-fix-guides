import type { Metadata } from 'next';
import { AgentDashboard } from '@/components/agent-dashboard';

export const metadata: Metadata = {
  title: 'Agent dashboard',
  // Internal tool — keep it out of search engines entirely.
  robots: { index: false, follow: false },
};

export default function AgentPage() {
  return <AgentDashboard />;
}
