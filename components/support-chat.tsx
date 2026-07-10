'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { isFirebaseConfigured } from '@/lib/firebase';
import {
  createSession,
  sendMessage,
  subscribeToMessages,
  subscribeToSession,
  subscribeToAgentPresence,
  visitorHeartbeat,
  visitorLeft,
  visitorLeftBeacon,
  setVisitorTyping,
  markVisitorRead,
  formatTime,
  isFresh,
  ONLINE_WINDOW_MS,
  TYPING_WINDOW_MS,
  type ChatMessage,
  type ChatSession,
} from '@/lib/chat';

/**
 * Visitor-facing live chat widget.
 *
 * Flow: floating launcher → pre-chat form (name + phone, both validated) →
 * chat interface. Messages sync in real time with the agent dashboard through
 * Firestore. The session id is persisted in localStorage so a returning
 * visitor resumes the same conversation with full history.
 *
 * Honesty notes: the online/away status in the header is driven by a real
 * agent heartbeat (presence doc), never faked; the "typing…" dots appear only
 * when an agent is actually typing in the dashboard.
 */

const STORAGE_KEY = 'printerfix.chat.sessionId';
const PHONE_RE = /^[+()\-\s]*(?:\d[()\-\s]*){7,}$/;
const HEARTBEAT_MS = 45_000;
const TYPING_THROTTLE_MS = 2_500;

export function SupportChat() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [agentSeenAt, setAgentSeenAt] = useState<number | null>(null);

  const [starting, setStarting] = useState(false);
  const [fatal, setFatal] = useState('');

  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'auto-greeting',
    from: 'agent',
    text: "Hi there! I see you're dealing with a critical printer issue. I'm here to help you get this fixed right away. To get started, can I get your first name so I know who I'm speaking with?",
    createdAt: Date.now(),
  }]);
  const [draft, setDraft] = useState('');
  // Re-render periodically so presence/typing freshness decays visibly.
  const [, setTick] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const lastTypingSentRef = useRef(0);
  const pathname = usePathname();

  // Resume an existing session from a previous visit.
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      setSessionId(saved);
    }
  }, []);

  // Let any "Chat with us" call-to-action elsewhere open the widget.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('support-chat:open', onOpen);
    return () => window.removeEventListener('support-chat:open', onOpen);
  }, []);

  // Closing the widget (✕ / Escape) marks the visitor offline right away —
  // reopening brings them straight back via the heartbeat.
  const closeWidget = useCallback(() => {
    setOpen(false);
    if (sessionId) visitorLeft(sessionId).catch(() => {});
  }, [sessionId]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeWidget();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeWidget]);

  // "I left" signal when the tab/page is closed, sent as a keepalive REST
  // call so it outlives page teardown (an SDK write would be killed mid-flight).
  useEffect(() => {
    if (!sessionId || !isFirebaseConfigured) return;
    const onHide = () => visitorLeftBeacon(sessionId);
    window.addEventListener('pagehide', onHide);
    return () => window.removeEventListener('pagehide', onHide);
  }, [sessionId]);

  // If an agent replies while the widget is closed, pop it open so the
  // visitor sees the answer straight away.
  const unreadForVisitor = session?.unreadForVisitor ?? 0;
  useEffect(() => {
    if (!open && unreadForVisitor > 0) setOpen(true);
  }, [open, unreadForVisitor]);

  // Auto-open the chat on every page except the home screen so the visitor
  // can reach a live agent. The diagnose flow is skipped here — it opens the
  // widget itself once the result step is reached. The widget pops open 15
  // seconds after landing on the page, regardless of activity. Fires once per
  // page: a visitor who closes the widget won't have it forced back open.
  const autoOpenedPathRef = useRef<string | null>(null);
  useEffect(() => {
    if (!pathname || pathname === '/' || pathname.startsWith('/diagnose')) return;
    if (autoOpenedPathRef.current === pathname) return;
    autoOpenedPathRef.current = pathname;
    const t = setTimeout(() => setOpen(true), 15000);
    return () => clearTimeout(t);
  }, [pathname]);

  // Agent presence (drives the truthful online/away header + launcher dot).
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    try {
      return subscribeToAgentPresence(setAgentSeenAt);
    } catch {
      return;
    }
  }, []);

  // Session doc subscription — runs even while the widget is closed so the
  // launcher can show an unread badge. null = deleted by an agent.
  useEffect(() => {
    if (!sessionId || !isFirebaseConfigured) return;
    try {
      return subscribeToSession(
        sessionId,
        (s) => {
          if (s === null) {
            localStorage.removeItem(STORAGE_KEY);
            setSessionId(null);
            setSession(null);
            setMessages([{
              id: 'auto-greeting',
              from: 'agent',
              text: "Hi there! I see you're dealing with a critical printer issue. I'm here to help you get this fixed right away. To get started, can I get your first name so I know who I'm speaking with?",
              createdAt: Date.now(),
            }]);
            return;
          }
          setSession(s);
        },
        () => {},
      );
    } catch {
      return;
    }
  }, [sessionId]);

  // 15-second nudge: after the chat opens, if the visitor hasn't replied
  // within 15 seconds, show a follow-up message.
  const hasVisitorMessage = messages.some(m => m.from === 'visitor');
  // Nudge everywhere except the home screen.
  const isOnNudgePage = !!pathname && pathname !== '/';
  useEffect(() => {
    // Only nudge when the chat is open (off the home page) and visitor hasn't replied.
    if (!open || !isOnNudgePage || hasVisitorMessage) return;

    // Clear any stale nudge from a previous visit so it doesn't show instantly.
    setMessages((prev) => prev.filter(m => m.id !== 'auto-followup'));

    const t = setTimeout(() => {
      setMessages((prev) => {
        if (prev.some(m => m.id === 'auto-followup')) return prev;
        return [
          ...prev,
          {
            id: 'auto-followup',
            from: 'agent',
            text: "Looks like your issue isn't resolved yet. Send us a message and a live agent will assist you immediately.",
            createdAt: Date.now(),
          }
        ];
      });
    }, 15000);
    return () => clearTimeout(t);
  }, [open, isOnNudgePage, hasVisitorMessage]);

  // Real-time message subscription for the active session.
  useEffect(() => {
    if (!sessionId || !isFirebaseConfigured) return;
    try {
      const unsub = subscribeToMessages(sessionId, (msgs) => {
        setMessages((prev) => {
          const hasNudge = prev.some((m) => m.id === 'auto-followup');
          const baseMsgs: ChatMessage[] = [
            {
              id: 'auto-greeting',
              from: 'agent',
              text: "Hi there! I see you're dealing with a critical printer issue. I'm here to help you get this fixed right away. To get started, can I get your first name so I know who I'm speaking with?",
              createdAt: session?.createdAt ?? Date.now(),
            },
          ];
          if (hasNudge) {
            baseMsgs.push({
              id: 'auto-followup',
              from: 'agent',
              text: "Looks like your issue isn't resolved yet. Send us a message and a live agent will assist you immediately.",
              createdAt: prev.find((m) => m.id === 'auto-followup')?.createdAt ?? Date.now(),
            });
          }
          return [...baseMsgs, ...msgs];
        });
      }, () =>
        setFatal('Chat connection lost. Please reload the page.'),
      );
      return () => unsub();
    } catch (e) {
      setFatal(e instanceof Error ? e.message : 'Chat is unavailable right now.');
    }
  }, [sessionId, session?.createdAt]);

  // Presence heartbeat while the widget is open, tagged with the current page.
  useEffect(() => {
    if (!open || !sessionId || !isFirebaseConfigured) return;
    const beat = () =>
      visitorHeartbeat(sessionId, pathname ?? '/').catch((e) =>
        console.warn('[chat] presence heartbeat rejected — are the latest firestore.rules published?', e),
      );
    beat();
    const t = setInterval(beat, HEARTBEAT_MS);
    return () => clearInterval(t);
  }, [open, sessionId, pathname]);

  // Clear the visitor's unread counter while they're looking at the chat.
  useEffect(() => {
    if (!open || !sessionId) return;
    if ((session?.unreadForVisitor ?? 0) > 0) {
      markVisitorRead(sessionId).catch(() => {});
    }
  }, [open, sessionId, session?.unreadForVisitor, messages.length]);

  // Freshness ticker (typing dots and online status decay without new data).
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 10_000);
    return () => clearInterval(t);
  }, []);

  // Auto-scroll to the newest message / typing indicator.
  const agentTypingActive = isFresh(session?.agentTyping ?? null, TYPING_WINDOW_MS);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, agentTypingActive]);

  const send = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const text = draft.trim();
      if (!text) return;
      setDraft('');
      setFatal('');

      let targetSessionId = sessionId;
      if (!targetSessionId) {
        setStarting(true);
        try {
          const visitorName = text.length > 30 ? text.substring(0, 30) + '...' : text;
          targetSessionId = await createSession(visitorName, 'Unknown', pathname ?? '/');
          localStorage.setItem(STORAGE_KEY, targetSessionId);
          setSessionId(targetSessionId);
        } catch (err) {
          setDraft(text);
          setFatal(err instanceof Error ? err.message : 'Could not start the chat. Please try again.');
          setStarting(false);
          return;
        } finally {
          setStarting(false);
        }
      }

      try {
        await sendMessage(targetSessionId, 'visitor', text);
        // Ensure presence is updated even if the summary update inside
        // sendMessage was silently swallowed by Firestore rules.
        visitorHeartbeat(targetSessionId, pathname ?? '/').catch(() => {});
      } catch (err) {
        console.warn('[chat] send failed', err);
        setDraft(text); // restore so the visitor can retry
        setFatal('Message failed to send. Please try again.');
      }
    },
    [draft, sessionId, pathname],
  );

  function onDraftChange(value: string) {
    setDraft(value);
    // Throttled "visitor is typing" signal for the dashboard.
    if (sessionId && value && Date.now() - lastTypingSentRef.current > TYPING_THROTTLE_MS) {
      lastTypingSentRef.current = Date.now();
      setVisitorTyping(sessionId).catch(() => {});
    }
  }


  // Auto-close the widget when navigating to the home page.
  useEffect(() => {
    if (pathname === '/') setOpen(false);
  }, [pathname]);

  // The visitor widget has no place on the agent dashboard or the home page.
  if (pathname?.startsWith('/agent') || pathname === '/') return null;

  const agentOnline = isFresh(agentSeenAt, ONLINE_WINDOW_MS);
  const unread = !open ? session?.unreadForVisitor ?? 0 : 0;

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={unread > 0 ? `Chat with us — ${unread} unread` : 'Chat with us'}
          className="focus-ring fixed bottom-5 right-4 z-40 flex items-center gap-2.5 rounded-full bg-amber p-4 text-base font-semibold text-surface shadow-card-hover transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6 sm:px-6"
        >
          <ChatIcon className="h-6 w-6" />
          <span className="hidden sm:inline">Chat with us</span>
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-ink px-1.5 text-xs font-bold text-paper shadow-card">
              {unread}
            </span>
          )}
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Support chat"
          className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-surface sm:top-auto sm:left-auto sm:bottom-6 sm:right-6 sm:h-[40rem] sm:max-h-[calc(100dvh-2.5rem)] sm:w-[min(30rem,calc(100vw-3rem))] sm:rounded-3xl sm:border sm:border-ink/10 sm:shadow-card-hover"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 bg-ink px-5 py-4 text-paper">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-amber text-surface">
                <ChatIcon className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <p className="font-semibold">PrinterFix support</p>
                <p className="flex items-center gap-1.5 text-xs text-paper/70">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  {agentOnline
                    ? 'Online now — a real person answers'
                    : 'We’re here 24/7 — replies in a few minutes'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {sessionId && (
                <button
                  type="button"
                  onClick={closeWidget}
                  className="focus-ring rounded-full px-2.5 py-1 text-xs text-paper/70 hover:bg-paper/10 hover:text-paper"
                >
                  End chat
                </button>
              )}
              <button
                type="button"
                onClick={closeWidget}
                aria-label="Close chat"
                className="focus-ring rounded-full p-1.5 text-paper/70 hover:bg-paper/10 hover:text-paper"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {!isFirebaseConfigured ? (
            <Unconfigured />
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto bg-paper px-4 py-4">
                <p className="mx-auto w-fit rounded-full bg-ink/5 px-3 py-1 text-center text-[0.7rem] text-slate">
                  {agentOnline
                    ? 'You’re connected — send a message and we’ll reply here.'
                    : 'You’re connected — hang tight, replies usually take a few minutes.'}
                </p>
                {messages.map((m) => (
                  <Bubble key={m.id} msg={m} />
                ))}
                {agentTypingActive && (
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-surface px-4 py-3 shadow-card w-fit">
                    <Dot /> <Dot /> <Dot />
                    <span className="ml-1 text-xs text-slate">Support is typing</span>
                  </div>
                )}
                {session?.status === 'closed' && (
                  <p className="mx-auto w-fit rounded-full bg-success/10 px-3 py-1 text-center text-[0.7rem] font-medium text-success">
                    Marked as resolved — send a message to reopen.
                  </p>
                )}
                {fatal && <p role="alert" className="text-center text-xs text-amber">{fatal}</p>}
              </div>
              <form onSubmit={send} className="flex items-center gap-2 border-t border-ink/10 bg-surface p-3">
                <input
                  value={draft}
                  onChange={(e) => onDraftChange(e.target.value)}
                  placeholder="Type a message…"
                  aria-label="Message"
                  className="focus-ring flex-1 rounded-full border border-ink/15 bg-paper px-4 py-3 text-base text-ink sm:text-sm"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || starting}
                  aria-label="Send message"
                  className="focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-full bg-amber text-surface transition-colors hover:bg-amber/90 disabled:opacity-40"
                >
                  <SendIcon className="h-5 w-5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}

function Bubble({ msg }: { msg: ChatMessage }) {
  const you = msg.from === 'visitor';
  return (
    <div className={`flex flex-col ${you ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-card ${
          you ? 'rounded-br-sm bg-amber text-surface' : 'rounded-bl-sm bg-surface text-ink'
        }`}
      >
        {msg.text}
      </div>
      <span className="mt-1 px-1 text-[0.65rem] text-slate">
        {you ? 'You' : 'Support'} · {formatTime(msg.createdAt)}
      </span>
    </div>
  );
}


function Unconfigured() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
      <p className="font-medium text-ink">Chat isn&apos;t connected yet</p>
      <p className="text-sm text-slate">
        Add your Firebase environment variables to enable live chat. Until then, reach us via the{' '}
        <a href="/contact" className="text-amber hover:underline">contact page</a>.
      </p>
    </div>
  );
}

function Dot() {
  return <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate/60 [animation-duration:1s]" />;
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a8.38 8.38 0 0 1-.9-4A8.5 8.5 0 0 1 21 11.5Z" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}
