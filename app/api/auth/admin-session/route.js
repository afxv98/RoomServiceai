import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';

// Admin credentials come exclusively from environment variables (never hardcoded).
// Set ADMIN_EMAIL and ADMIN_PASSWORD in Vercel / .env.local.
const ADMIN = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
};

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

/**
 * POST /api/auth/admin-session
 * Body: { email, password, userType }
 * Returns: { ok: true, userType } on success, 401 on bad credentials.
 * Sets an httpOnly admin_session cookie for admin logins (used by API proxy guards).
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { email, password, userType } = body;

  if (userType === 'admin') {
    // Admin credentials live in env vars only.
    if (!ADMIN.email || !ADMIN.password || email !== ADMIN.email || password !== ADMIN.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true, userType: 'admin' });
    response.cookies.set('admin_session', '1', {
      ...COOKIE_OPTS,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  }

  if (userType === 'hotel') {
    // Hotel manager credentials are stored in the database.
    let user;
    try {
      user = await prisma.hotelUser.findUnique({ where: { email } });
    } catch {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ ok: true, userType: 'hotel' });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}

/** DELETE /api/auth/admin-session — clear the session cookie (logout). */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set('admin_session', '', { ...COOKIE_OPTS, maxAge: 0 });
  return response;
}
