import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

// POST /api/auth/sales-session — sales rep login
export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const rep = await prisma.salesRep.findUnique({ where: { email: email.toLowerCase() } });
    if (!rep || !rep.isActive) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!(await verifyPassword(password, rep.passwordHash))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true, id: rep.id, name: rep.name, email: rep.email });
    response.cookies.set('sales_session', String(rep.id), { ...COOKIE_OPTS, maxAge: 60 * 60 * 24 * 7 });
    return response;
  } catch (error) {
    console.error('POST /api/auth/sales-session error:', error);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}

// DELETE /api/auth/sales-session — logout
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set('sales_session', '', { ...COOKIE_OPTS, maxAge: 0 });
  return response;
}
