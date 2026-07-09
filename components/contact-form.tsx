'use client';

import { useState } from 'react';

type Status = 'idle' | 'error' | 'failed' | 'success';

const topics = ['A guide helped', 'Spotted a mistake', 'Suggest a guide or error code', 'Something else'];

/**
 * Contact form for asynchronous email-style messages. For live help, the
 * SupportChat widget (bottom-right, staffed by a real agent) is the faster path.
 * Submissions are stored in Firestore (`contactMessages`); the module is
 * imported on submit so Firebase stays out of the page's initial bundle.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const topic = String(data.get('topic') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    if (!name || !email || !message || !/.+@.+\..+/.test(email)) {
      setStatus('error');
      return;
    }

    setSubmitting(true);
    try {
      const { submitContactMessage } = await import('@/lib/chat');
      await submitContactMessage(name, email, topic, message);
      setStatus('success');
      form.reset();
    } catch {
      setStatus('failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="rounded-2xl border border-success/30 bg-success/5 p-6 text-ink"
      >
        <h2 className="text-xl font-bold text-success">Thanks — message received</h2>
        <p className="mt-2 text-slate">
          Your message has been noted. Because this is a small independent resource,
          email replies can take a few days. Need help sooner? Use the live chat in the
          bottom-right corner and a real person will pick it up.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="focus-ring mt-4 rounded-full border border-ink/15 bg-surface px-4 py-2 text-sm font-medium text-ink hover:border-ink/30"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {status === 'error' && (
        <p role="alert" className="rounded-xl border border-amber/40 bg-amber/5 px-4 py-3 text-sm text-ink">
          Please fill in your name, a valid email, and a message.
        </p>
      )}
      {status === 'failed' && (
        <p role="alert" className="rounded-xl border border-amber/40 bg-amber/5 px-4 py-3 text-sm text-ink">
          Sorry — your message couldn’t be sent just now. Please try again in a
          moment, or use the live chat in the bottom-right corner instead.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name">
          <input id="name" name="name" type="text" autoComplete="name" required className={inputClass} />
        </Field>
        <Field label="Email" htmlFor="email">
          <input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
        </Field>
      </div>

      <Field label="What’s this about?" htmlFor="topic">
        <select id="topic" name="topic" className={inputClass} defaultValue={topics[0]}>
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>

      <Field label="Message" htmlFor="message">
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder="Tell us what happened, which printer you have, and what you’ve already tried."
          className={`${inputClass} resize-y`}
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="focus-ring inline-flex items-center justify-center rounded-full bg-amber px-6 py-3 font-medium text-surface transition-colors hover:bg-amber/90 disabled:opacity-60"
      >
        {submitting ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}

const inputClass =
  'focus-ring w-full rounded-xl border border-ink/15 bg-surface px-4 py-3 text-ink placeholder:text-slate/60';

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
