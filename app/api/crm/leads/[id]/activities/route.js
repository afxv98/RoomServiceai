import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/crm/leads/[id]/activities - add an activity to a lead
export async function POST(request, { params }) {
  try {
    const body = await request.json();
    const { type, user, note, duration, lastActivity } = body;

    const [activity] = await prisma.$transaction([
      prisma.activity.create({
        data: {
          leadId: parseInt(params.id),
          type,
          user: user || 'Admin',
          note: note || null,
          duration: duration ? parseInt(duration) : null,
          timestamp: new Date(),
        },
      }),
      ...(lastActivity
        ? [
            prisma.lead.update({
              where: { id: parseInt(params.id) },
              data: { lastActivity },
            }),
          ]
        : []),
    ]);

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error('POST /api/crm/leads/[id]/activities error:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}
