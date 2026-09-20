'use client';

import { useEffect, useState } from 'react';
import type { BrandKey } from '@/lib/types';

type FormStatus = 'idle' | 'error' | 'loading';
type Step = 'choose' | 'checking' | 'failed' | 'detecting' | 'errorcode';
type Conn = 'USB' | 'Wi-Fi';

const CHECK_LABELS = [
  'Checking system requirements',
  'Checking system settings',
  'Identifying your printer model',
  'Printer model found',
  'Checking existing printer drivers',
  'Downloading the correct driver',
  'Installing the driver',
  'Preparing your support request',
];
// Eight 7.5-second stages make the full visual check last one minute.
const CHECK_DURATIONS = [7500, 7500, 7500, 7500, 7500, 7500, 7500, 7500];

const DETECT_LABELS = ['', 'checking printer registry files…', 'verifying driver signatures…'];
const DETECT_DURATIONS = [1600, 2200, 1900, 900];
const PHONE_COUNTRIES = [
  { value: 'nz', name: 'New Zealand', code: '+64' },
  { value: 'us', name: 'United States', code: '+1' },
  { value: 'uk', name: 'United Kingdom', code: '+44' },
  { value: 'ca', name: 'Canada', code: '+1' },
  { value: 'au', name: 'Australia', code: '+61' },
] as const;

/**
 * "Quick Download Free Drivers" form + setup-wizard dialog on the
 * /install/[brand] pages. Submitting the model records the request; the wizard
 * runs a mock connection check that ends by handing off to the live chat.
 */
export function DriverDownload({
  brand,
  brandName,
}: {
  brand: BrandKey;
  brandName: string;
}) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('choose');
  const [conn, setConn] = useState<Conn>('USB');
  const [checkIdx, setCheckIdx] = useState(0);
  const [detectIdx, setDetectIdx] = useState(0);
  const [modelNumber, setModelNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [phoneCountry, setPhoneCountry] = useState<(typeof PHONE_COUNTRIES)[number]['value']>('nz');
  const [contactError, setContactError] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Lock scroll + close on Escape while the dialog is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDialog();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Netlify supplies an approximate country based on the visitor's IP address.
  // Keep New Zealand selected when this is unavailable (such as during local development).
  useEffect(() => {
    fetch('/api/lead')
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { countryCode?: string } | null) => {
        const country = PHONE_COUNTRIES.find((item) => item.value === data?.countryCode?.toLowerCase());
        if (country) setPhoneCountry(country.value);
      })
      .catch(() => undefined);
  }, []);

  // Run through the check stages, then land on the failure screen.
  useEffect(() => {
    if (step !== 'checking') return;
    if (checkIdx >= CHECK_LABELS.length - 1) {
      const t = setTimeout(() => setStep('errorcode'), CHECK_DURATIONS[checkIdx]);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCheckIdx((i) => i + 1), CHECK_DURATIONS[checkIdx]);
    return () => clearTimeout(t);
  }, [step, checkIdx]);

  // "Detecting problems" progress, then the error-code screen.
  useEffect(() => {
    if (step !== 'detecting') return;
    if (detectIdx >= DETECT_LABELS.length) {
      setStep('errorcode');
      return;
    }
    const t = setTimeout(() => setDetectIdx((i) => i + 1), DETECT_DURATIONS[detectIdx]);
    return () => clearTimeout(t);
  }, [step, detectIdx]);

  function closeDialog() {
    setOpen(false);
    setStep('choose');
    setCheckIdx(0);
    setDetectIdx(0);
    setLeadSubmitted(false);
  }

  function runDetect() {
    setDetectIdx(0);
    setStep('detecting');
  }

  function openChat() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('support-chat:open'));
    }
  }

  function runChecks(next: Conn) {
    setConn(next);
    setCheckIdx(0);
    setStep('checking');
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const model = String(new FormData(e.currentTarget).get('model') ?? '').trim();
    if (!model) {
      setStatus('error');
      return;
    }
    setModelNumber(model);
    // Open directly at the connection choice; the old introductory wizard
    // screen added an unnecessary step before the visitor could continue.
    setStep('choose');
    setCheckIdx(0);
    setDetectIdx(0);
    setLeadSubmitted(false);
    setOpen(true);
  }

  async function submitSupportRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = contactName.trim();
    const phone = contactPhone.trim();
    const selectedPhoneCountry = PHONE_COUNTRIES.find((country) => country.value === phoneCountry) ?? PHONE_COUNTRIES[0];
    if (!name || !phone) {
      setContactError('Please enter your name and mobile number.');
      return;
    }

    setContactError('');
    setContactSubmitting(true);
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          phone: `${selectedPhoneCountry.code} ${phone}`,
          country: selectedPhoneCountry.name,
          brand: brandName,
          model: modelNumber,
          connection: conn,
          errorCode: '0x000025',
        }),
      });
      if (!response.ok) throw new Error('Form submission failed');
    } catch {
      setContactError('We could not send your details. Please try again.');
      setContactSubmitting(false);
      return;
    }
    setContactSubmitting(false);
    setLeadSubmitted(true);
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="max-w-lg">
        <label htmlFor="model" className="block text-xl font-medium text-[#333]">
          Model Number:
        </label>
        <input
          id="model"
          name="model"
          type="text"
          required
          className="mt-3 w-full rounded-lg border border-[#d7d7d7] bg-white px-5 py-4 text-xl text-[#222] shadow-[0_6px_18px_rgba(0,0,0,0.06)] outline-none focus:border-[#1a8cf5]"
        />
        {status === 'error' && (
          <p role="alert" className="mt-2 text-sm text-[#c1121f]">
            Please enter your printer&apos;s model number.
          </p>
        )}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#1a8cf5] px-7 py-4 text-center text-xl font-semibold text-white transition-colors hover:bg-[#1478d6] disabled:opacity-70 sm:w-auto"
        >
          {status === 'loading' ? 'Please wait…' : 'Get Started'}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" />
          </svg>
        </button>
      </form>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8"
          onClick={closeDialog}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Printer driver troubleshooting"
            onClick={(e) => e.stopPropagation()}
            className="my-6 min-h-[34rem] w-full max-w-5xl rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
          >
            <div className="flex justify-end border-b border-black/10 px-6 py-3 sm:px-10">
              <button
                type="button"
                aria-label="Close"
                onClick={closeDialog}
                className="-mr-2 grid h-12 w-12 place-items-center rounded text-black/50 transition-colors hover:bg-black/5 hover:text-black"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-8 sm:px-10 sm:py-10">
              {step === 'choose' && (
                <div>
                  <h3 className="font-sans text-3xl font-bold text-[#111]">Select Your Connection Type</h3>
                  <p className="text-xl text-[#555]">Choose how your printer connects to your computer.</p>
                  <div className="mt-8 space-y-6">
                    <ConnRow
                      art={<LaptopPrinterArt />}
                      label="USB:"
                      text="Connect via USB"
                      onStart={() => runChecks('USB')}
                    />
                    <ConnRow
                      art={<RouterPrinterArt />}
                      label="WIFI:"
                      text="Connect via Wifi."
                      onStart={() => runChecks('Wi-Fi')}
                    />
                  </div>
                </div>
              )}

              {step === 'checking' && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h4 className="font-sans text-3xl font-bold text-[#111]">Troubleshooting Status</h4>
                      <p className="mt-2 text-lg text-[#555]">
                        Checking your printer&apos;s {conn} connection and installation setup. This takes about one minute.
                      </p>
                    </div>
                    <div className="h-20 w-36 shrink-0">
                      {conn === 'USB' ? <LaptopPrinterArt /> : <RouterPrinterArt />}
                    </div>
                  </div>

                  <div
                    className="mt-8 h-4 overflow-hidden rounded-full bg-[#e6edf5]"
                    role="progressbar"
                    aria-label="Troubleshooting progress"
                    aria-valuemin={0}
                    aria-valuemax={CHECK_LABELS.length}
                    aria-valuenow={checkIdx + 1}
                  >
                    <div
                      className="h-full rounded-full bg-[#1a8cf5] transition-[width] duration-500"
                      style={{ width: `${((checkIdx + 1) / CHECK_LABELS.length) * 100}%` }}
                    />
                  </div>
                  <p className="mt-3 text-right text-base font-semibold text-[#555]">
                    Step {checkIdx + 1} of {CHECK_LABELS.length}
                  </p>

                  <ol className="mt-5 grid gap-3 sm:grid-cols-2" aria-live="polite">
                    {CHECK_LABELS.map((label, index) => {
                      const isComplete = index < checkIdx;
                      const isCurrent = index === checkIdx;
                      const isFailure = index === CHECK_LABELS.length - 1;
                      return (
                        <li
                          key={label}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-lg transition-colors ${
                            isCurrent
                              ? isFailure
                                ? 'border-[#d14343] bg-[#fff3f3] text-[#9b2525]'
                                : 'border-[#1a8cf5] bg-[#edf7ff] text-[#125eab]'
                              : isComplete
                                ? 'border-[#b8dec8] bg-[#f1fbf5] text-[#236a43]'
                                : 'border-black/10 bg-[#fafafa] text-[#667085]'
                          }`}
                        >
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-current text-sm font-bold">
                            {isComplete ? '✓' : index + 1}
                          </span>
                          <span className="font-medium">{label}</span>
                          {isCurrent && !isFailure ? <Spinner size={20} /> : null}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}

              {step === 'failed' && (
                <div>
                  <p className="text-[#555]">
                    Verify your printer&apos;s {conn} connection for a seamless setup process.
                  </p>
                  <hr className="my-4 border-black/10" />
                  <div className="mx-auto mt-2 max-w-[15rem]">
                    {conn === 'USB' ? <LaptopPrinterArt /> : <RouterPrinterArt />}
                  </div>
                  <p className="mt-4 text-center text-lg font-bold text-[#333]">
                    {conn} connection failed.
                  </p>
                  <div className="mt-4 divide-y divide-black/10 rounded-lg border border-black/10 text-center text-[#333]">
                    <p className="px-3 py-2.5">
                      Check {conn} on both ends.{' '}
                      <button type="button" onClick={runDetect} className="font-medium text-[#1a8cf5] hover:underline">
                        Retry
                      </button>
                    </p>
                    <p className="px-3 py-2.5">
                      Check {conn} drivers.{' '}
                      <button type="button" onClick={runDetect} className="font-medium text-[#1a8cf5] hover:underline">
                        Check Drivers
                      </button>
                    </p>
                  </div>
                  <div className="mt-5 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={runDetect}
                      className="rounded-md bg-[#1a8cf5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1478d6]"
                    >
                      Fix Issue
                    </button>
                    <button
                      type="button"
                      onClick={runDetect}
                      className="rounded-md bg-[#1a8cf5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1478d6]"
                    >
                      Need Assistance?
                    </button>
                  </div>
                </div>
              )}

              {step === 'detecting' && (
                <div className="pt-8">
                  <p className="text-center text-xl font-bold text-[#1a6ff5]">Detecting problems</p>
                  <div className="relative mx-auto mt-6 h-2 w-full max-w-xs overflow-hidden rounded bg-[#eef0f2]">
                    <div
                      className="absolute inset-y-0 left-0 w-1/3 rounded bg-[#1a6ff5]"
                      style={{ animation: 'wizard-indeterminate 1.15s ease-in-out infinite' }}
                    />
                  </div>
                  {DETECT_LABELS[detectIdx] ? (
                    <p className="mt-6 text-center text-[#666]">{DETECT_LABELS[detectIdx]}</p>
                  ) : null}
                </div>
              )}

              {step === 'errorcode' && (
                leadSubmitted ? (
                  <div className="mx-auto max-w-2xl py-16 text-center">
                    <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#eaf8ef] text-4xl font-bold text-[#20834c]">✓</span>
                    <h3 className="mt-6 font-sans text-3xl font-bold text-[#222]">Thank you — we received your request!</h3>
                    <p className="mx-auto mt-4 max-w-xl text-xl leading-relaxed text-[#555]">
                      A support technician will contact you shortly to help complete your printer setup.
                    </p>
                    <button
                      type="button"
                      onClick={closeDialog}
                      className="mt-8 rounded-xl bg-[#1a8cf5] px-8 py-4 text-xl font-semibold text-white transition-colors hover:bg-[#1478d6]"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div className="mx-auto max-w-3xl pt-10 text-center">
                    <p className="text-xl font-bold text-[#dc2626]">
                      The installation could not be completed due to a fatal error (0x000025)
                    </p>
                    <h3 className="mt-3 font-sans text-3xl font-bold text-[#222]">You&apos;re on the Right Track!</h3>
                    <p className="mx-auto mt-5 max-w-2xl text-xl leading-relaxed text-[#555]">
                      Your printer setup just needs a little extra help. A technician can guide you through the remaining steps.
                    </p>
                    <form onSubmit={submitSupportRequest} className="mx-auto mt-8 max-w-2xl rounded-2xl border border-[#cfe4fa] bg-[#f5faff] p-6 text-left sm:p-8">
                      <p className="text-xl font-semibold leading-relaxed text-[#333]">
                        Enter your details below for a quick call or live chat.
                      </p>
                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <label className="block text-lg font-semibold text-[#333]">
                          Your name
                          <input
                            type="text"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            autoComplete="name"
                            required
                            className="mt-2 w-full rounded-xl border border-[#b9cde1] bg-white px-4 py-3 text-xl font-normal outline-none focus:border-[#1a8cf5]"
                          />
                        </label>
                        <div>
                          <label className="block text-lg font-semibold text-[#333]">
                            Country / calling code
                            <select
                              value={phoneCountry}
                              onChange={(e) => setPhoneCountry(e.target.value as (typeof PHONE_COUNTRIES)[number]['value'])}
                              aria-label="Country calling code"
                              className="mt-2 w-full rounded-xl border border-[#b9cde1] bg-[#edf7ff] px-3 py-3 text-base font-semibold text-[#1a5e9e] outline-none focus:border-[#1a8cf5]"
                            >
                              {PHONE_COUNTRIES.map((country) => (
                                <option key={country.value} value={country.value}>
                                  {country.name} {country.code}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="mt-4 block text-lg font-semibold text-[#333]">
                            Mobile number
                            <input
                              type="tel"
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                              autoComplete="tel"
                              inputMode="tel"
                              required
                              className="mt-2 w-full rounded-xl border border-[#b9cde1] bg-white px-4 py-3 text-xl font-normal outline-none focus:border-[#1a8cf5]"
                            />
                          </label>
                        </div>
                      </div>
                      {contactError ? <p role="alert" className="mt-4 text-base font-medium text-[#b42318]">{contactError}</p> : null}
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <button
                          type="submit"
                          disabled={contactSubmitting}
                          className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#1a8cf5] px-8 py-4 text-xl font-semibold text-white transition-colors hover:bg-[#1478d6] disabled:opacity-70 sm:w-auto"
                        >
                          {contactSubmitting ? 'Please wait…' : 'Get a Quick Call'}
                        </button>
                        <button
                          type="button"
                          onClick={openChat}
                          className="inline-flex w-full items-center justify-center gap-3 rounded-xl border-2 border-[#1a8cf5] bg-white px-8 py-4 text-xl font-semibold text-[#126fc7] transition-colors hover:bg-[#edf7ff] sm:w-auto"
                        >
                          Live Chat Now
                        </button>
                      </div>
                    </form>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ConnRow({
  art,
  label,
  text,
  onStart,
}: {
  art: React.ReactNode;
  label: string;
  text: string;
  onStart: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-black/10 bg-[#f7f9fc] p-6 text-center sm:flex-row sm:justify-start sm:gap-16 sm:p-8">
      <div className="sm:text-left">
        <div className="mx-auto h-24 w-44 sm:mx-0">{art}</div>
        <p className="mt-3 text-2xl">
          <span className="font-bold">{label}</span> {text}
        </p>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="inline-flex shrink-0 items-center gap-3 rounded-xl bg-[#1a8cf5] px-8 py-4 text-xl font-semibold text-white transition-colors hover:bg-[#1478d6]"
      >
        Let&apos;s Start <CircleArrow />
      </button>
    </div>
  );
}

function CircleArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.25)" />
      <path d="m10 8 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" className="animate-spin" role="status" aria-label="Loading">
      <circle cx="25" cy="25" r="20" fill="none" stroke="#e2e8f0" strokeWidth="5" />
      <path d="M25 5a20 20 0 0 1 20 20" fill="none" stroke="#13b5a6" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/** Laptop connected by cable to a printer. */
function LaptopPrinterArt() {
  return (
    <svg viewBox="0 0 160 90" className="h-full w-full" role="img" aria-label="Laptop connected to printer">
      <g fill="none" stroke="#9aa2ad" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M18 22 h40 v34 h-40 z" />
        <path d="M10 62 h56 l-6 -6 h-44 z" />
        <path d="M70 50 q14 12 24 0" />
        <rect x="96" y="30" width="52" height="34" rx="4" />
        <path d="M104 30 v-8 h36 v8" />
        <path d="M104 64 v6 h36 v-6" />
        <rect x="106" y="44" width="30" height="10" rx="2" />
      </g>
    </svg>
  );
}

/** Wi-Fi router broadcasting to a printer. */
function RouterPrinterArt() {
  return (
    <svg viewBox="0 0 160 90" className="h-full w-full" role="img" aria-label="Wi-Fi router and printer">
      <g fill="none" stroke="#9aa2ad" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <rect x="14" y="46" width="46" height="18" rx="4" />
        <path d="M24 46 v-14 M50 46 v-14" />
        <circle cx="24" cy="56" r="1.6" fill="#9aa2ad" />
        <path d="M64 40 q8 -6 16 0 M60 34 q12 -10 24 0" stroke="#7cc6ff" />
        <rect x="98" y="30" width="52" height="34" rx="4" />
        <path d="M106 30 v-8 h36 v8" />
        <path d="M106 64 v6 h36 v-6" />
        <rect x="108" y="44" width="30" height="10" rx="2" />
      </g>
    </svg>
  );
}
