import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';

// PUT /api/sales/reps/[id] — update name, email, region, isActive, optionally reset password
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const { name, email, password, region, isActive } = await request.json();

    const data = {};
    if (name !== undefined) data.name = name.trim();
    if (email !== undefined) data.email = email.trim().toLowerCase();
    if (region !== undefined) data.region = region.trim();
    if (isActive !== undefined) data.isActive = isActive;
    if (password?.trim()) data.passwordHash = await hashPassword(password.trim());

    const rep = await prisma.salesRep.update({
      where: { id },
      data,
      include: { _count: { select: { leads: true } } },
    });

    const { passwordHash: _, ...safe } = rep;
    return NextResponse.json(safe);
  } catch (error) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Sales rep not found' }, { status: 404 });
    if (error.code === 'P2002') return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    console.error('PUT /api/sales/reps/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update sales rep' }, { status: 500 });
  }
}

// DELETE /api/sales/reps/[id]
export async function DELETE(request, { params }) {
  try {
    await prisma.salesRep.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Sales rep not found' }, { status: 404 });
    console.error('DELETE /api/sales/reps/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete sales rep' }, { status: 500 });
  }
}
