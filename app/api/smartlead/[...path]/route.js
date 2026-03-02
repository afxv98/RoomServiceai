import { NextResponse } from 'next/server';

const SMARTLEAD_BASE = 'https://server.smartlead.ai/api/v1';

async function proxy(request, { params }) {
  // Require a valid server-side admin session cookie.
  const sessionCookie = request.cookies.get('admin_session');
  if (!sessionCookie?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.smartlead;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'SmartLead API key not configured. Add the `smartlead` env var in Vercel.' },
      { status: 500 },
    );
  }

  try {
    // Build the target URL
    const pathSegments = (await params).path;
    const path = pathSegments.join('/');

    // Forward any query params from the original request, plus inject the api_key
    const incomingUrl = new URL(request.url);
    const qs = new URLSearchParams(incomingUrl.searchParams);
    qs.set('api_key', apiKey);

    const targetUrl = `${SMARTLEAD_BASE}/${path}?${qs.toString()}`;

    const options = {
      method: request.method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (!['GET', 'HEAD'].includes(request.method)) {
      const text = await request.text();
      if (text) options.body = text;
    }

    const upstream = await fetch(targetUrl, options);

    // Try JSON first, fall back to text
    let data;
    const ct = upstream.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      data = await upstream.json();
    } else {
      data = { raw: await upstream.text() };
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    console.error('SmartLead proxy error:', err);
    return NextResponse.json({ error: 'Proxy request failed' }, { status: 502 });
  }
}

export const GET    = proxy;
export const POST   = proxy;
export const PUT    = proxy;
export const PATCH  = proxy;
export const DELETE = proxy;
