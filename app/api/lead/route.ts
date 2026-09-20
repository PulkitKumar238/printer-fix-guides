import { getContext } from '@netlify/functions';
import { NextResponse } from 'next/server';

const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/leads1928@gmail.com';

type LeadPayload = {
  name?: unknown;
  phone?: unknown;
  country?: unknown;
  brand?: unknown;
  model?: unknown;
  connection?: unknown;
  errorCode?: unknown;
};

type VisitorDetails = {
  ip: string;
  countryCode: string;
  countryName: string;
};

function visitorDetails(): VisitorDetails {
  try {
    const context = getContext();
    return {
      ip: context.ip ?? 'Unavailable',
      countryCode: context.geo?.country?.code?.toLowerCase() ?? '',
      countryName: context.geo?.country?.name ?? 'Unavailable',
    };
  } catch {
    // Netlify context is intentionally unavailable while running `next dev`.
    return { ip: 'Unavailable (local development)', countryCode: '', countryName: 'Unavailable' };
  }
}

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function GET() {
  const visitor = visitorDetails();
  return NextResponse.json({ countryCode: visitor.countryCode });
}

export async function POST(request: Request) {
  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name = text(payload.name);
  const phone = text(payload.phone);
  if (!name || !phone) {
    return NextResponse.json({ error: 'Name and mobile number are required.' }, { status: 400 });
  }

  const visitor = visitorDetails();
  const brand = text(payload.brand) || 'Printer';
  // FormSubmit normally learns this from the browser's referrer. This route
  // forwards requests server-to-server, so include the originating page
  // explicitly to keep FormSubmit from rejecting a valid submission.
  const formUrl = request.headers.get('referer') ?? request.headers.get('origin') ?? new URL(request.url).origin;
  const formOrigin = request.headers.get('origin') ?? new URL(formUrl).origin;
  const formSubmitResponse = await fetch(FORMSUBMIT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Origin: formOrigin,
      Referer: formUrl,
    },
    body: JSON.stringify({
      name,
      phone,
      selected_country: text(payload.country),
      detected_country: visitor.countryName,
      visitor_ip: visitor.ip,
      brand,
      model: text(payload.model),
      connection: text(payload.connection),
      error_code: text(payload.errorCode),
      _url: formUrl,
      _subject: `New ${brand} printer support lead`,
      _template: 'table',
    }),
  });

  const formSubmitBody = (await formSubmitResponse.json().catch(() => null)) as { success?: boolean | string } | null;
  if (!formSubmitResponse.ok || formSubmitBody?.success !== true && formSubmitBody?.success !== 'true') {
    return NextResponse.json({ error: 'Could not submit lead.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
