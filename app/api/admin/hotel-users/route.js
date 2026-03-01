import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';

function requireAdmin(request) {
  const cookie = request.cookies.get('admin_session');
  if (!cookie?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

/** GET /api/admin/hotel-users — list all hotel manager accounts. */
export async function GET(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const users = await prisma.hotelUser.findMany({
    select: { id: true, email: true, name: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(users);
}

/** POST /api/admin/hotel-users — create a hotel manager account. */
export async function POST(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { email, password, name = '' } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'email and password are required' }, { status: 422 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'password must be at least 8 characters' }, { status: 422 });
  }

  const passwordHash = await hashPassword(password);

  try {
    const user = await prisma.hotelUser.create({
      data: { email, passwordHash, name },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'An account with that email already exists' }, { status: 409 });
    }
    throw err;
  }
}
