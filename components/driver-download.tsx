'use client';

import { useEffect, useState } from 'react';
import type { BrandKey } from '@/lib/types';

type FormStatus = 'idle' | 'error' | 'loading';
type Step = 'start' | 'booting' | 'choose' | 'checking' | 'failed' | 'detecting' | 'errorcode';
type Conn = 'USB' | 'Wi-Fi';

const CHECK_LABELS = ['Checking Printer Spooler…', 'Checking Installation Files…', 'Loading Error…'];
const CHECK_DURATIONS = [2200, 2000, 2000, 1600];

const DETECT_LABELS = ['', 'checking printer registry files…', 'verifying driver signatures…'];
const DETECT_DURATIONS = [1600, 2200, 1900, 900];

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
  const [step, setStep] = useState<Step>('start');
  const [conn, setConn] = useState<Conn>('USB');
  const [checkIdx, setCheckIdx] = useState(0);
  const [detectIdx, setDetectIdx] = useState(0);

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

  // "Booting" spinner -> connection choice.
  useEffect(() => {
    if (step !== 'booting') return;
    const t = setTimeout(() => setStep('choose'), 2500);
    return () => clearTimeout(t);
  }, [step]);

  // Run through the check stages, then land on the failure screen.
  useEffect(() => {
    if (step !== 'checking') return;
    if (checkIdx >= 4) {
      setStep('failed');
      return;
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
    setStep('start');
    setCheckIdx(0);
    setDetectIdx(0);
  }

  function runDetect() {
    setDetectIdx(0);
    setStep('detecting');
  }

  function openChat() {
    closeDialog();
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
    setStatus('loading');
    try {
      const { submitDriverRequest } = await import('@/lib/chat');
      await submitDriverRequest({
        brand: brandName,
        model,
        connection: '',
        page: typeof window !== 'undefined' ? window.location.pathname : `/install/${brand}`,
      });
    } catch {
      // Firebase may not be configured — the chat handoff still works.
    } finally {
      setStatus('idle');
      setStep('start');
      setCheckIdx(0);
      setDetectIdx(0);
      setOpen(true);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="max-w-lg">
        <label htmlFor="model" className="block text-lg text-[#333]">
          Model Number:
        </label>
        <input
          id="model"
          name="model"
          type="text"
          required
          className="mt-2 w-full rounded-lg border border-[#d7d7d7] bg-white px-4 py-3 text-[#222] shadow-[0_6px_18px_rgba(0,0,0,0.06)] outline-none focus:border-[#1a8cf5]"
        />
        {status === 'error' && (
          <p role="alert" className="mt-2 text-sm text-[#c1121f]">
            Please enter your printer&apos;s model number.
          </p>
        )}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#1a8cf5] px-5 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-[#1478d6] disabled:opacity-70 sm:w-auto sm:px-6 sm:text-lg"
        >
          {status === 'loading' ? 'Please wait…' : 'Quick Download & Install Drivers!'}
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
            aria-labelledby="qd-title"
            onClick={(e) => e.stopPropagation()}
            className="my-4 min-h-[24rem] w-full max-w-md rounded-lg bg-white shadow-[0_30px_80px_rgba(0,0,0,0.4)] sm:min-h-[26rem]"
          >
            <div className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-4 sm:px-6">
              <h3 id="qd-title" className="font-sans text-lg font-bold text-[#111] sm:text-xl">
                Quick Download Free Drivers
              </h3>
              <button
                type="button"
                aria-label="Close"
                onClick={closeDialog}
                className="-mr-1 grid h-8 w-8 place-items-center rounded text-black/50 transition-colors hover:bg-black/5 hover:text-black"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="px-4 py-8 sm:px-6">
              {step === 'start' && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep('booting')}
                    className="inline-flex items-center gap-2 rounded-md bg-[#1a8cf5] px-6 py-2.5 font-semibold text-white transition-colors hover:bg-[#1478d6]"
                  >
                    Let&apos;s Start <CircleArrow />
                  </button>
                  <p className="mt-3 font-semibold text-[#333]">Start Printer Setup Wizard</p>
                  <div className="mx-auto mt-8 max-w-[17rem]">
                    <BoxPrinterArt />
                  </div>
                </div>
              )}

              {step === 'booting' && (
                <div className="grid min-h-[18rem] place-items-center">
                  <Spinner size={56} />
                </div>
              )}

              {step === 'choose' && (
                <div>
                  <p className="text-[#555]">Select Wi-Fi or USB connection?</p>
                  <hr className="my-4 border-black/10" />
                  <div className="space-y-8">
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
                  <p className="text-[#555]">
                    Verify your printer&apos;s {conn} connection for a seamless setup process.
                  </p>
                  <hr className="my-4 border-black/10" />
                  <div className="mx-auto mt-4 max-w-[15rem]">
                    {conn === 'USB' ? <LaptopPrinterArt /> : <RouterPrinterArt />}
                  </div>
                  {checkIdx === 0 ? (
                    <div className="mt-6 text-center">
                      <p className="text-lg font-bold text-[#333]">Please wait…</p>
                      <div className="mt-6 flex justify-center">
                        <Spinner size={44} />
                      </div>
                    </div>
                  ) : (
                    <p className="mt-6 flex items-center justify-center gap-2 font-semibold">
                      <Spinner size={20} />
                      <span className={checkIdx === 3 ? 'text-[#e00]' : 'text-[#333]'}>
                        {CHECK_LABELS[checkIdx - 1]}
                      </span>
                    </p>
                  )}
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
                <div className="pt-6 text-center">
                  <div className="mx-auto w-16">
                    <PrinterErrorArt />
                  </div>
                  <p className="mt-3 text-lg font-bold text-[#222]">
                    Error Code <span className="underline decoration-1 underline-offset-2">C00022</span>
                  </p>
                  <p className="mx-auto mt-2 max-w-[24rem] text-[#666]">
                    Printer driver installation has been failed due to fatal error C00022
                    preventing product driver installation.
                    <br />
                    <span className="font-bold text-[#333]">
                      Please contact the live chat agent to fix it.
                    </span>
                  </p>
                </div>
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
    <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:gap-4">
      <div>
        <div className="mx-auto h-16 w-28">{art}</div>
        <p className="mt-1 text-[0.95rem]">
          <span className="font-bold">{label}</span> {text}
        </p>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="inline-flex shrink-0 items-center gap-2 rounded-md bg-[#1a8cf5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1478d6]"
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

/** Line-art "printer in an opened box" illustration for the wizard start screen. */
function BoxPrinterArt() {
  return (
    <svg viewBox="0 0 260 210" className="w-full" role="img" aria-label="Printer in an open box">
      <ellipse cx="130" cy="188" rx="112" ry="16" fill="#000" opacity="0.05" />
      <g fill="#f3f4f6" stroke="#c7cbd1" strokeWidth="2" strokeLinejoin="round">
        <path d="M40 70 L10 48 L70 40 L96 60 Z" />
        <path d="M220 70 L250 48 L190 40 L164 60 Z" />
        <path d="M96 60 L70 40 L130 30 L150 48 Z" />
        <path d="M164 60 L190 40 L130 30 L110 48 Z" />
      </g>
      <path d="M44 66 L216 66 L204 176 L56 176 Z" fill="#f8f9fb" stroke="#c7cbd1" strokeWidth="2" strokeLinejoin="round" />
      <g stroke="#9aa2ad" strokeWidth="2" strokeLinejoin="round">
        <rect x="78" y="84" width="104" height="66" rx="8" fill="#ffffff" />
        <rect x="92" y="150" width="76" height="20" rx="4" fill="#eef0f3" />
        <rect x="98" y="112" width="64" height="14" rx="3" fill="#e4e7eb" />
        <circle cx="150" cy="100" r="4" fill="#cdd2d8" stroke="none" />
      </g>
      <g fill="#8b93a0" stroke="#ffffff" strokeWidth="2">
        <circle cx="70" cy="128" r="11" />
        <circle cx="130" cy="96" r="11" />
        <circle cx="196" cy="120" r="11" />
      </g>
      <g fill="#ffffff" fontFamily="Georgia, serif" fontSize="13" fontStyle="italic" textAnchor="middle">
        <text x="70" y="133">i</text>
        <text x="130" y="101">i</text>
        <text x="196" y="125">i</text>
      </g>
    </svg>
  );
}

/** Printer outline with a red error badge. */
function PrinterErrorArt() {
  return (
    <svg viewBox="0 0 64 64" className="w-full" role="img" aria-label="Printer error">
      <g fill="none" stroke="#1f2937" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <path d="M16 24V10h32v14" />
        <path d="M12 24h40a4 4 0 0 1 4 4v16a2 2 0 0 1-2 2h-6" />
        <path d="M10 46H10a2 2 0 0 1-2-2V28a4 4 0 0 1 4-4" />
        <path d="M18 40h20v14H18z" />
        <path d="M22 46h12M22 50h8" />
      </g>
      <circle cx="48" cy="44" r="11" fill="#e11d1d" />
      <path d="M48 38v7" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="48" cy="50" r="1.8" fill="#fff" />
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
