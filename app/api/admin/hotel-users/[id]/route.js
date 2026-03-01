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

/** PATCH /api/admin/hotel-users/[id] — update name, email, and/or password. */
export async function PATCH(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const id = parseInt((await params).id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { name, email, password } = body;
  const data = {};

  if (name !== undefined) data.name = name;
  if (email !== undefined) {
    if (!email) return NextResponse.json({ error: 'email cannot be empty' }, { status: 422 });
    data.email = email;
  }
  if (password !== undefined && password !== '') {
    if (password.length < 8) {
      return NextResponse.json({ error: 'password must be at least 8 characters' }, { status: 422 });
    }
    data.passwordHash = await hashPassword(password);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 422 });
  }

  try {
    const user = await prisma.hotelUser.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, createdAt: true },
    });
    return NextResponse.json(user);
  } catch (err) {
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'An account with that email already exists' }, { status: 409 });
    }
    throw err;
  }
}

/** DELETE /api/admin/hotel-users/[id] — remove a hotel manager account. */
export async function DELETE(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const id = parseInt((await params).id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  try {
    await prisma.hotelUser.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    throw err;
  }
}
