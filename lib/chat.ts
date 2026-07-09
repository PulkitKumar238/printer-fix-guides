import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  setDoc,
  getDocs,
  writeBatch,
  increment,
  Timestamp,
  type Firestore,
  type Unsubscribe,
  type DocumentData,
} from 'firebase/firestore';
import { getDb } from './firebase';

/**
 * Chat data layer. All Firestore reads/writes for the support chat live here
 * so components stay declarative and the schema has a single source of truth.
 *
 * Firestore layout:
 *   chatSessions/{sessionId}                    ← one per visitor conversation
 *     ├─ name, phone, createdAt, status
 *     ├─ lastMessageText, lastMessageFrom, lastMessageAt
 *     ├─ unreadForAgent, unreadForVisitor
 *     ├─ visitorLastSeenAt (heartbeat), visitorTyping, agentTyping
 *     └─ startedOnPage, currentPage
 *   chatSessions/{sessionId}/messages/{msgId}   ← ordered by createdAt
 *     └─ from ('visitor' | 'agent'), text, createdAt
 *   presence/agents                             ← agent-online heartbeat
 *     └─ lastSeenAt
 */

export type Sender = 'visitor' | 'agent';

export interface ChatMessage {
  id: string;
  from: Sender;
  text: string;
  /** Millis since epoch; null until the server timestamp resolves. */
  createdAt: number | null;
}

export interface ChatSession {
  id: string;
  name: string;
  phone: string;
  status: 'open' | 'closed';
  createdAt: number | null;
  lastMessageText: string;
  lastMessageFrom: Sender | null;
  lastMessageAt: number | null;
  unreadForAgent: number;
  unreadForVisitor: number;
  /** Heartbeat while the visitor has the widget open — powers online dots. */
  visitorLastSeenAt: number | null;
  visitorTyping: number | null;
  agentTyping: number | null;
  /** Page the chat was started from, and the page the visitor is on now. */
  startedOnPage: string;
  currentPage: string;
}

const SESSIONS = 'chatSessions';
const PRESENCE_DOC = ['presence', 'agents'] as const;

/** Presence/typing freshness windows (ms). */
export const ONLINE_WINDOW_MS = 75_000;
export const TYPING_WINDOW_MS = 8_000;

function requireDb(): Firestore {
  const db = getDb();
  if (!db) {
    throw new Error(
      'Firebase is not configured. Set the NEXT_PUBLIC_FIREBASE_* environment variables.',
    );
  }
  return db;
}

function millis(value: unknown): number | null {
  return value instanceof Timestamp ? value.toMillis() : null;
}

function parseSession(id: string, data: DocumentData): ChatSession {
  return {
    id,
    name: (data.name as string) ?? '',
    phone: (data.phone as string) ?? '',
    status: (data.status as ChatSession['status']) ?? 'open',
    createdAt: millis(data.createdAt),
    lastMessageText: (data.lastMessageText as string) ?? '',
    lastMessageFrom: (data.lastMessageFrom as Sender | null) ?? null,
    lastMessageAt: millis(data.lastMessageAt),
    unreadForAgent: (data.unreadForAgent as number) ?? 0,
    unreadForVisitor: (data.unreadForVisitor as number) ?? 0,
    visitorLastSeenAt: millis(data.visitorLastSeenAt),
    visitorTyping: millis(data.visitorTyping),
    agentTyping: millis(data.agentTyping),
    startedOnPage: (data.startedOnPage as string) ?? '',
    currentPage: (data.currentPage as string) ?? '',
  };
}

/** Create a new visitor session and return its id. */
export async function createSession(name: string, phone: string, page: string): Promise<string> {
  const db = requireDb();
  const ref = await addDoc(collection(db, SESSIONS), {
    name,
    phone,
    status: 'open',
    createdAt: serverTimestamp(),
    lastMessageText: '',
    lastMessageFrom: null,
    lastMessageAt: serverTimestamp(),
    unreadForAgent: 0,
    unreadForVisitor: 0,
    visitorLastSeenAt: serverTimestamp(),
    visitorTyping: null,
    agentTyping: null,
    startedOnPage: page,
    currentPage: page,
  });
  return ref.id;
}

/** Append a message to a session and update its summary fields. */
export async function sendMessage(sessionId: string, from: Sender, text: string): Promise<void> {
  const db = requireDb();
  const trimmed = text.trim();
  if (!trimmed) return;

  await addDoc(collection(db, SESSIONS, sessionId, 'messages'), {
    from,
    text: trimmed,
    createdAt: serverTimestamp(),
  });

  const summary: Record<string, unknown> = {
    lastMessageText: trimmed,
    lastMessageFrom: from,
    lastMessageAt: serverTimestamp(),
  };
  if (from === 'visitor') {
    summary.unreadForAgent = increment(1);
    summary.visitorTyping = null;
    // A visitor writing into a resolved conversation reopens it.
    summary.status = 'open';
  } else {
    summary.unreadForVisitor = increment(1);
    summary.agentTyping = null;
  }
  await updateDoc(doc(db, SESSIONS, sessionId), summary);
}

/** Subscribe to a single session's messages in real time (visitor + agent). */
export function subscribeToMessages(
  sessionId: string,
  onChange: (messages: ChatMessage[]) => void,
): Unsubscribe {
  const db = requireDb();
  const q = query(collection(db, SESSIONS, sessionId, 'messages'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snap) => {
    onChange(
      snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          from: data.from as Sender,
          text: data.text as string,
          createdAt: millis(data.createdAt),
        };
      }),
    );
  });
}

/**
 * Subscribe to one session document (visitor side: presence, typing, unread,
 * status). `onChange(null)` fires if the session was deleted by an agent.
 */
export function subscribeToSession(
  sessionId: string,
  onChange: (session: ChatSession | null) => void,
  onError?: (e: Error) => void,
): Unsubscribe {
  const db = requireDb();
  return onSnapshot(
    doc(db, SESSIONS, sessionId),
    (snap) => onChange(snap.exists() ? parseSession(snap.id, snap.data()) : null),
    (e) => onError?.(e),
  );
}

/** Subscribe to all sessions, newest activity first (agent dashboard only). */
export function subscribeToSessions(onChange: (sessions: ChatSession[]) => void): Unsubscribe {
  const db = requireDb();
  const q = query(collection(db, SESSIONS), orderBy('lastMessageAt', 'desc'));
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => parseSession(d.id, d.data())));
  });
}

/** Reset the agent's unread counter once they open a conversation. */
export async function markSessionRead(sessionId: string): Promise<void> {
  const db = requireDb();
  await updateDoc(doc(db, SESSIONS, sessionId), { unreadForAgent: 0 });
}

/** Reset the visitor's unread counter once they're looking at the chat. */
export async function markVisitorRead(sessionId: string): Promise<void> {
  const db = requireDb();
  await updateDoc(doc(db, SESSIONS, sessionId), { unreadForVisitor: 0 });
}

/** Visitor heartbeat: "I'm here, on this page" — drives the online dot. */
export async function visitorHeartbeat(sessionId: string, page: string): Promise<void> {
  const db = requireDb();
  await updateDoc(doc(db, SESSIONS, sessionId), {
    visitorLastSeenAt: serverTimestamp(),
    currentPage: page,
  });
}

/** Visitor ended the chat — clear their presence so the dashboard dot drops instantly. */
export async function visitorLeft(sessionId: string): Promise<void> {
  const db = requireDb();
  await updateDoc(doc(db, SESSIONS, sessionId), {
    visitorLastSeenAt: null,
    visitorTyping: null,
  });
}

/**
 * Same as visitorLeft, but sent as a keepalive fetch straight to the Firestore
 * REST API so it survives the page being closed (the SDK's WebChannel write
 * gets killed mid-flight on unload). Fire-and-forget by design.
 */
export function visitorLeftBeacon(sessionId: string): void {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!projectId || !apiKey) return;
  const url =
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${SESSIONS}/${sessionId}` +
    `?updateMask.fieldPaths=visitorLastSeenAt&updateMask.fieldPaths=visitorTyping&key=${apiKey}`;
  try {
    void fetch(url, {
      method: 'PATCH',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: { visitorLastSeenAt: { nullValue: null }, visitorTyping: { nullValue: null } },
      }),
    }).catch(() => {});
  } catch {
    // Best effort — the heartbeat window handles the rest.
  }
}

export async function setVisitorTyping(sessionId: string): Promise<void> {
  const db = requireDb();
  await updateDoc(doc(db, SESSIONS, sessionId), { visitorTyping: serverTimestamp() });
}

export async function setAgentTyping(sessionId: string): Promise<void> {
  const db = requireDb();
  await updateDoc(doc(db, SESSIONS, sessionId), { agentTyping: serverTimestamp() });
}

/** Agent action: mark a conversation resolved (visitor can reopen by writing). */
export async function closeSession(sessionId: string): Promise<void> {
  const db = requireDb();
  await updateDoc(doc(db, SESSIONS, sessionId), { status: 'closed' });
}

export async function reopenSession(sessionId: string): Promise<void> {
  const db = requireDb();
  await updateDoc(doc(db, SESSIONS, sessionId), { status: 'open' });
}

/** Agent action: permanently delete a conversation and all its messages. */
export async function deleteSessionWithMessages(sessionId: string): Promise<void> {
  const db = requireDb();
  const msgs = await getDocs(collection(db, SESSIONS, sessionId, 'messages'));
  // Batched deletes, chunked below the 500-write batch limit.
  const docs = msgs.docs;
  for (let i = 0; i < docs.length; i += 450) {
    const batch = writeBatch(db);
    for (const d of docs.slice(i, i + 450)) batch.delete(d.ref);
    await batch.commit();
  }
  const finalBatch = writeBatch(db);
  finalBatch.delete(doc(db, SESSIONS, sessionId));
  await finalBatch.commit();
}

/**
 * Persist a contact-form submission. Stored in its own collection so the
 * security rules can keep it write-only for visitors (agents read it in the
 * Firebase console). Throws when Firebase isn't configured.
 */
export async function submitContactMessage(
  name: string,
  email: string,
  topic: string,
  message: string,
): Promise<void> {
  const db = requireDb();
  await addDoc(collection(db, 'contactMessages'), {
    name,
    email,
    topic,
    message,
    createdAt: serverTimestamp(),
  });
}

/** Agent-online heartbeat, written by the dashboard every ~30s. */
export async function agentHeartbeat(): Promise<void> {
  const db = requireDb();
  await setDoc(doc(db, ...PRESENCE_DOC), { lastSeenAt: serverTimestamp() }, { merge: true });
}

/** Subscribe to the agent-online heartbeat (readable by everyone). */
export function subscribeToAgentPresence(
  onChange: (lastSeenAtMillis: number | null) => void,
): Unsubscribe {
  const db = requireDb();
  return onSnapshot(
    doc(db, ...PRESENCE_DOC),
    (snap) => onChange(snap.exists() ? millis(snap.data().lastSeenAt) : null),
    (e) => {
      console.warn('[chat] cannot read agent presence — are the latest firestore.rules published?', e);
      onChange(null);
    },
  );
}

/** True when a heartbeat/typing timestamp is recent enough to count as live. */
export function isFresh(millisValue: number | null, windowMs: number): boolean {
  return millisValue !== null && Date.now() - millisValue < windowMs;
}

/** Format a message timestamp as a short local time, e.g. "3:42 PM". */
export function formatTime(millisValue: number | null): string {
  if (!millisValue) return '';
  return new Date(millisValue).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/** Compact relative time for list rows, e.g. "now", "5m", "2h", "3d". */
export function formatRelative(millisValue: number | null): string {
  if (!millisValue) return '';
  const s = Math.max(0, Math.floor((Date.now() - millisValue) / 1000));
  if (s < 60) return 'now';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}
