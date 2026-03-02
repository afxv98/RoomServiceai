import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { valid: false, reason: 'Email is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.email_checker;

    if (!apiKey) {
      // Fail open if API key not configured — don't block users
      console.warn('email_checker env var not set; skipping API verification');
      return NextResponse.json({ valid: true }, { status: 200 });
    }

    const response = await fetch(
      `https://client.myemailverifier.com/verifier/validate_single/${encodeURIComponent(email)}/${apiKey}`,
      { next: { revalidate: 0 } }
    );

    if (!response.ok) {
      // Fail open on API errors
      console.error('MyEmailVerifier API error:', response.status);
      return NextResponse.json({ valid: true }, { status: 200 });
    }

    const data = await response.json();

    const status = (data.Status || '').toLowerCase();
    const isDisposable = data.Disposable_Domain === 'true';

    if (isDisposable) {
      return NextResponse.json(
        { valid: false, reason: 'Please use a valid business email address.' },
        { status: 200 }
      );
    }

    if (status === 'invalid') {
      return NextResponse.json(
        { valid: false, reason: 'This email address appears to be invalid. Please double-check it.' },
        { status: 200 }
      );
    }

    // Accept: valid, catch-all (common for hotel/corporate domains), unknown
    return NextResponse.json({ valid: true }, { status: 200 });

  } catch (error) {
    console.error('Email verification error:', error);
    // Fail open — never block a user due to our own API issues
    return NextResponse.json({ valid: true }, { status: 200 });
  }
}
