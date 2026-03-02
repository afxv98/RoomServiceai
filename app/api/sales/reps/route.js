import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';

// GET /api/sales/reps — list all sales reps (with lead counts)
export async function GET() {
  try {
    const reps = await prisma.salesRep.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { leads: true } } },
    });
    return NextResponse.json(reps);
  } catch (error) {
    console.error('GET /api/sales/reps error:', error);
    return NextResponse.json({ error: 'Failed to fetch sales reps' }, { status: 500 });
  }
}

// POST /api/sales/reps — create a new sales rep
export async function POST(request) {
  try {
    const { name, email, password, region } = await request.json();
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const rep = await prisma.salesRep.create({
      data: { name: name.trim(), email: email.trim().toLowerCase(), passwordHash, region: region?.trim() ?? '' },
      include: { _count: { select: { leads: true } } },
    });

    const { passwordHash: _, ...safe } = rep;
    return NextResponse.json(safe, { status: 201 });
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A sales rep with this email already exists' }, { status: 409 });
    }
    console.error('POST /api/sales/reps error:', error);
    return NextResponse.json({ error: 'Failed to create sales rep' }, { status: 500 });
  }
}
