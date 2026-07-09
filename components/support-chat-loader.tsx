'use client';

import dynamic from 'next/dynamic';

/**
 * Defers the chat widget (and the Firebase SDK it pulls in) into a lazily
 * loaded client chunk, so it stays out of every page's initial bundle. The
 * floating launcher appears just after hydration — standard for chat widgets.
 */
const SupportChat = dynamic(
  () => import('./support-chat').then((m) => m.SupportChat),
  { ssr: false },
);

export function SupportChatLoader() {
  return <SupportChat />;
}
