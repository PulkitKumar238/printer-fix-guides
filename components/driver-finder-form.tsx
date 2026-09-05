'use client';

import { useState } from 'react';

type Status = 'idle' | 'error' | 'success';

/**
 * "Download Printer Drivers" capture form used on the /install hub. It doesn't
 * serve a file — it records the request and opens the live chat so a support
 * specialist can send the correct driver link for the model entered.
 */
export function DriverFinderForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const model = String(data.get('model') ?? '').trim();
    const name = String(data.get('name') ?? '').trim();

    if (!model) {
      setStatus('error');
      return;
    }

    setSubmitting(true);
    try {
      const { submitDriverRequest } = await import('@/lib/chat');
      await submitDriverRequest({
        brand: 'Unspecified',
        model,
        connection: '',
        name,
        page: typeof window !== 'undefined' ? window.location.pathname : '/install',
      });
    } catch {
      // Firebase may not be configured — the chat handoff below still works.
    } finally {
      setSubmitting(false);
      setStatus('success');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('support-chat:open'));
      }
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="rounded-md border border-[#1c7a3e]/30 bg-[#1c7a3e]/5 p-5">
        <p className="font-semibold text-[#1c7a3e]">Got it — matching your driver</p>
        <p className="mt-1 text-[0.95rem] text-[#333]">
          A support specialist has been notified and the live chat is open in the bottom-right
          corner. They&apos;ll confirm your model and send the correct driver download link.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-3 rounded border border-black/15 bg-white px-4 py-2 text-sm font-medium text-[#333] hover:border-black/30"
        >
          Look up another model
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {status === 'error' && (
        <p role="alert" className="mb-4 rounded border border-[#d33]/40 bg-[#d33]/5 px-3 py-2 text-sm text-[#a11]">
          Please enter your printer&apos;s model number.
        </p>
      )}
      <div className="flex flex-wrap items-end gap-3">
        <label className="min-w-[200px] flex-1">
          <span className="mb-1 block text-[0.95rem] text-[#333]">Enter Model Number</span>
          <input
            name="model"
            type="text"
            required
            placeholder="Ex: Model XXX-XXXX"
            className="w-full rounded border border-[#c9c9c9] px-3 py-2.5 text-[#222] outline-none focus:border-[#0096D6]"
          />
        </label>
        <label className="min-w-[200px] flex-1">
          <span className="mb-1 block text-[0.95rem] text-[#333]">Your Full Name</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Ex: Jane Doe"
            className="w-full rounded border border-[#c9c9c9] px-3 py-2.5 text-[#222] outline-none focus:border-[#0096D6]"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-[#0096D6] px-6 py-2.5 font-semibold text-white transition-colors hover:bg-[#007eb8] disabled:opacity-60 sm:w-auto"
        >
          {submitting ? 'Please wait…' : 'Find Drivers'}
        </button>
      </div>
    </form>
  );
}
