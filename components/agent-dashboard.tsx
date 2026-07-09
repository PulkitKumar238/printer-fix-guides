'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { isFirebaseConfigured, getFirebaseAuth } from '@/lib/firebase';
import {
  subscribeToSessions,
  subscribeToMessages,
  sendMessage,
  markSessionRead,
  setAgentTyping,
  closeSession,
  reopenSession,
  deleteSessionWithMessages,
  agentHeartbeat,
  formatTime,
  formatRelative,
  isFresh,
  ONLINE_WINDOW_MS,
  TYPING_WINDOW_MS,
  type ChatSession,
  type ChatMessage,
} from '@/lib/chat';

/**
 * Support-agent dashboard. Access is gated by Firebase Authentication — the
 * Firestore security rules only allow listing sessions (visitor names + phone
 * numbers) to a signed-in, allow-listed agent. Everything updates in real time
 * via Firestore snapshots; replies appear instantly in the visitor widget.
 *
 * While signed in, the dashboard heartbeats `presence/agents` so the visitor
 * widget can show a truthful online/away status.
 */

const AGENT_HEARTBEAT_MS = 30_000;
const TYPING_THROTTLE_MS = 2_500;

/** Canned openers/questions agents reach for constantly. */
const QUICK_REPLIES = [
  'Hi! I’m looking at your issue now — which printer model do you have?',
  'Could you power the printer off, wait 30 seconds, and turn it back on?',
  'Are you printing from Windows or a Mac?',
  'Is there an error code or message on the printer’s screen?',
  'Glad that fixed it! Anything else I can help with?',
];

type StatusFilter = 'open' | 'closed' | 'all';

export function AgentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setAuthReady(true);
      return;
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
  }, []);

  if (!isFirebaseConfigured) {
    return (
      <Centered>
        <h1 className="text-2xl font-bold text-ink">Firebase not configured</h1>
        <p className="mt-2 text-slate">
          Set the <code className="rounded bg-ink/5 px-1">NEXT_PUBLIC_FIREBASE_*</code> environment
          variables to enable the agent dashboard.
        </p>
      </Centered>
    );
  }

  if (!authReady) {
    return (
      <Centered>
        <p className="text-slate">Loading…</p>
      </Centered>
    );
  }

  if (!user) return <AgentLogin />;

  return <Dashboard user={user} />;
}

function AgentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const auth = getFirebaseAuth();
    if (!auth) return;
    setBusy(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch {
      setError('Sign-in failed. Check the agent email and password.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Centered>
      <div className="w-full max-w-sm rounded-3xl border border-ink/10 bg-surface p-8 shadow-card">
        <h1 className="text-2xl font-bold text-ink">Agent sign in</h1>
        <p className="mt-1.5 text-sm text-slate">Support team access only.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="focus-ring w-full rounded-xl border border-ink/15 bg-surface px-4 py-3 text-base text-ink"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="focus-ring w-full rounded-xl border border-ink/15 bg-surface px-4 py-3 text-base text-ink"
            />
          </label>
          {error && <p role="alert" className="text-sm text-amber">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="focus-ring w-full rounded-full bg-amber px-6 py-3 font-semibold text-surface hover:bg-amber/90 disabled:opacity-60"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </Centered>
  );
}

function Dashboard({ user }: { user: User }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('open');
  const [search, setSearch] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  // Ticker so relative times / online dots decay without new snapshots.
  const [, setTick] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastTypingSentRef = useRef(0);
  const prevUnreadRef = useRef(0);

  // Live list of all conversations.
  useEffect(() => subscribeToSessions(setSessions), []);

  // Presence heartbeat: tells visitor widgets an agent is really online.
  useEffect(() => {
    const beat = () =>
      agentHeartbeat().catch((e) =>
        console.warn('[chat] agent heartbeat rejected — are the latest firestore.rules published?', e),
      );
    beat();
    const t = setInterval(beat, AGENT_HEARTBEAT_MS);
    return () => clearInterval(t);
  }, []);

  // Relative-time / freshness re-render tick.
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 10_000);
    return () => clearInterval(t);
  }, []);

  // Live messages for the open conversation.
  useEffect(() => {
    setConfirmingDelete(false);
    if (!activeId) {
      setMessages([]);
      return;
    }
    const unsub = subscribeToMessages(activeId, setMessages);
    return () => unsub();
  }, [activeId]);

  // Keep the open conversation marked read as new messages stream in.
  const activeUnread = sessions.find((s) => s.id === activeId)?.unreadForAgent ?? 0;
  useEffect(() => {
    if (activeId && activeUnread > 0) markSessionRead(activeId).catch(() => {});
  }, [activeId, activeUnread, messages.length]);

  // New-message alert: beep + unread count in the tab title.
  const totalUnread = sessions.reduce((n, s) => n + s.unreadForAgent, 0);
  useEffect(() => {
    if (totalUnread > prevUnreadRef.current) beep();
    prevUnreadRef.current = totalUnread;
    document.title = totalUnread > 0 ? `(${totalUnread}) Support inbox` : 'Support inbox';
    return () => {
      document.title = 'Support inbox';
    };
  }, [totalUnread]);

  const active = sessions.find((s) => s.id === activeId) ?? null;
  const visitorTypingActive = isFresh(active?.visitorTyping ?? null, TYPING_WINDOW_MS);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, visitorTypingActive]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sessions.filter((s) => {
      if (filter !== 'all' && s.status !== filter) return false;
      if (q && !`${s.name} ${s.phone}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [sessions, filter, search]);

  const reply = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const text = draft.trim();
      if (!text || !activeId) return;
      setDraft('');
      await sendMessage(activeId, 'agent', text);
    },
    [draft, activeId],
  );

  function onDraftChange(value: string) {
    setDraft(value);
    if (activeId && value && Date.now() - lastTypingSentRef.current > TYPING_THROTTLE_MS) {
      lastTypingSentRef.current = Date.now();
      setAgentTyping(activeId).catch(() => {});
    }
  }

  async function onDelete() {
    if (!activeId) return;
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    const id = activeId;
    setActiveId(null);
    setConfirmingDelete(false);
    await deleteSessionWithMessages(id).catch(() => {});
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-surface px-4 py-3 sm:px-5">
        <div>
          <h1 className="font-slab text-xl font-bold text-ink">Support inbox</h1>
          <p className="text-xs text-slate">
            {sessions.length} conversation{sessions.length === 1 ? '' : 's'}
            {totalUnread > 0 && <span className="font-semibold text-amber"> · {totalUnread} unread</span>}
            {' · '}
            {user.email}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const auth = getFirebaseAuth();
            if (auth) signOut(auth);
          }}
          className="focus-ring rounded-full border border-ink/15 bg-surface px-4 py-2 text-sm font-medium text-ink hover:border-ink/30"
        >
          Sign out
        </button>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[22rem_1fr]">
        {/* Session list */}
        <aside
          className={`flex min-h-0 flex-col border-r border-ink/10 bg-paper ${
            activeId ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="space-y-2 border-b border-ink/10 bg-surface p-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or phone…"
              aria-label="Search conversations"
              className="focus-ring w-full rounded-full border border-ink/15 bg-paper px-4 py-2 text-sm text-ink"
            />
            <div className="flex gap-1.5" role="tablist" aria-label="Filter by status">
              {(['open', 'closed', 'all'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}
                  className={`focus-ring rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    filter === f ? 'bg-ink text-paper' : 'bg-ink/5 text-slate hover:bg-ink/10'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="p-5 text-sm text-slate">
                {sessions.length === 0 ? 'No conversations yet.' : 'Nothing matches this filter.'}
              </p>
            )}
            <ul className="divide-y divide-ink/5">
              {filtered.map((s) => {
                const online = isFresh(s.visitorLastSeenAt, ONLINE_WINDOW_MS);
                const typing = isFresh(s.visitorTyping, TYPING_WINDOW_MS);
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(s.id)}
                      className={`focus-ring flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-surface ${
                        s.id === activeId ? 'bg-surface' : ''
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-1.5">
                          <span
                            title={online ? 'Visitor online' : 'Visitor offline'}
                            className={`h-2 w-2 shrink-0 rounded-full ${online ? 'bg-success' : 'bg-ink/20'}`}
                          />
                          <span className="truncate font-semibold text-ink">{s.name || 'Visitor'}</span>
                          {s.status === 'closed' && (
                            <span className="shrink-0 rounded-full bg-ink/5 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-slate">
                              Closed
                            </span>
                          )}
                        </span>
                        <span className="shrink-0 text-[0.7rem] text-slate">{formatRelative(s.lastMessageAt)}</span>
                      </span>
                      <span className="font-mono text-xs text-slate">{s.phone}</span>
                      <span className="flex items-center justify-between gap-2">
                        <span className={`truncate text-sm ${typing ? 'italic text-amber' : 'text-slate'}`}>
                          {typing
                            ? 'typing…'
                            : `${s.lastMessageFrom === 'agent' ? 'You: ' : ''}${s.lastMessageText || 'New conversation'}`}
                        </span>
                        {s.unreadForAgent > 0 && (
                          <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-amber px-1.5 text-[0.7rem] font-semibold text-surface">
                            {s.unreadForAgent}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Conversation */}
        <section className={`min-h-0 flex-col ${activeId ? 'flex' : 'hidden md:flex'}`}>
          {active ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 bg-surface px-4 py-3 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveId(null)}
                    className="focus-ring rounded-full p-1 text-slate hover:text-ink md:hidden"
                    aria-label="Back to list"
                  >
                    ←
                  </button>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 font-semibold text-ink">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          isFresh(active.visitorLastSeenAt, ONLINE_WINDOW_MS) ? 'bg-success' : 'bg-ink/20'
                        }`}
                      />
                      <span className="truncate">{active.name || 'Visitor'}</span>
                    </p>
                    <p className="truncate text-xs text-slate">
                      <a href={`tel:${active.phone}`} className="font-mono text-amber hover:underline">
                        {active.phone}
                      </a>
                      {' · '}
                      {isFresh(active.visitorLastSeenAt, ONLINE_WINDOW_MS)
                        ? `online now, viewing ${active.currentPage || '…'}`
                        : active.visitorLastSeenAt
                          ? `last seen ${formatRelative(active.visitorLastSeenAt)} ago`
                          : 'offline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {active.status === 'open' ? (
                    <button
                      type="button"
                      onClick={() => closeSession(active.id).catch(() => {})}
                      className="focus-ring rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink hover:border-ink/30"
                    >
                      Mark resolved
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => reopenSession(active.id).catch(() => {})}
                      className="focus-ring rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink hover:border-ink/30"
                    >
                      Reopen
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onDelete}
                    onBlur={() => setConfirmingDelete(false)}
                    className={`focus-ring rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      confirmingDelete
                        ? 'bg-amber text-surface'
                        : 'border border-ink/15 text-slate hover:border-ink/30 hover:text-ink'
                    }`}
                  >
                    {confirmingDelete ? 'Click again to delete' : 'Delete'}
                  </button>
                </div>
              </div>

              <div ref={scrollRef} className="min-h-0 flex-1 space-y-2.5 overflow-y-auto bg-paper px-4 py-4 sm:px-5">
                {active.startedOnPage && (
                  <p className="mx-auto w-fit rounded-full bg-ink/5 px-3 py-1 text-center text-[0.7rem] text-slate">
                    Chat started on {active.startedOnPage}
                  </p>
                )}
                {messages.map((m) => (
                  <AgentBubble key={m.id} msg={m} />
                ))}
                {visitorTypingActive && (
                  <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-sm bg-surface px-4 py-3 shadow-card">
                    <Dot /> <Dot /> <Dot />
                    <span className="ml-1 text-xs text-slate">{active.name || 'Visitor'} is typing</span>
                  </div>
                )}
              </div>

              <div className="border-t border-ink/10 bg-surface p-3">
                <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1">
                  {QUICK_REPLIES.map((qr) => (
                    <button
                      key={qr}
                      type="button"
                      onClick={() => {
                        setDraft(qr);
                        inputRef.current?.focus();
                      }}
                      className="focus-ring shrink-0 rounded-full border border-ink/10 bg-paper px-3 py-1.5 text-xs text-slate transition-colors hover:border-amber/40 hover:text-ink"
                    >
                      {qr.length > 44 ? `${qr.slice(0, 44)}…` : qr}
                    </button>
                  ))}
                </div>
                <form onSubmit={reply} className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => onDraftChange(e.target.value)}
                    placeholder={`Reply to ${active.name || 'visitor'}…`}
                    className="focus-ring flex-1 rounded-full border border-ink/15 bg-paper px-4 py-3 text-base text-ink sm:text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    className="focus-ring rounded-full bg-amber px-6 py-3 text-sm font-semibold text-surface hover:bg-amber/90 disabled:opacity-40"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="grid flex-1 place-items-center bg-paper p-8 text-center">
              <p className="text-slate">Select a conversation to reply.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function AgentBubble({ msg }: { msg: ChatMessage }) {
  const mine = msg.from === 'agent';
  return (
    <div className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-card ${
          mine ? 'rounded-br-sm bg-amber text-surface' : 'rounded-bl-sm bg-surface text-ink'
        }`}
      >
        {msg.text}
      </div>
      <span className="mt-1 px-1 text-[0.65rem] text-slate">
        {mine ? 'You' : 'Visitor'} · {formatTime(msg.createdAt)}
      </span>
    </div>
  );
}

function Dot() {
  return <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate/60 [animation-duration:1s]" />;
}

/** Short, quiet new-message chime via WebAudio — no asset file needed. */
function beep() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // Audio not available (autoplay policy, etc.) — silently skip.
  }
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="grid min-h-[calc(100dvh-4rem)] place-items-center px-4 text-center">{children}</div>;
}
