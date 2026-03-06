import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/crm/delete-requests?status=pending — admin fetches deletion requests
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    const requests = await prisma.leadDeleteRequest.findMany({
      where: status === 'all' ? {} : { status },
      include: {
        lead: {
          select: {
            id: true,
            hotelName: true,
            contactName: true,
            status: true,
            value: true,
            assignedTo: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('GET /api/crm/delete-requests error:', error);
    return NextResponse.json({ error: 'Failed to fetch delete requests' }, { status: 500 });
  }
}
