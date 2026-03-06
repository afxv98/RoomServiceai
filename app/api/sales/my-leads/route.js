import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// GET /api/sales/my-leads — return leads assigned to the logged-in sales rep
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sales_session')?.value;
    if (!sessionId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

    const repId = parseInt(sessionId);
    if (isNaN(repId)) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

    const rep = await prisma.salesRep.findUnique({ where: { id: repId } });
    if (!rep || !rep.isActive) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

    const leads = await prisma.lead.findMany({
      where: { assignedToId: repId },
      include: {
        activities: { orderBy: { timestamp: 'asc' } },
        notes: { orderBy: { timestamp: 'asc' } },
        deleteRequests: {
          where: { status: 'pending' },
          select: { id: true, status: true, reason: true, createdAt: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ rep: { id: rep.id, name: rep.name, email: rep.email }, leads });
  } catch (error) {
    console.error('GET /api/sales/my-leads error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
