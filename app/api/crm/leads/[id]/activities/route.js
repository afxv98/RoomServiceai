import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// POST /api/crm/leads/[id]/activities - add an activity to a lead
export async function POST(request, { params }) {
  try {
    const body = await request.json();
    const { type, user, note, duration, lastActivity, eventDate, assignedToId } = body;

    const leadId = parseInt(params.id);

    const [activity] = await prisma.$transaction([
      prisma.activity.create({
        data: {
          leadId,
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
              where: { id: leadId },
              data: { lastActivity },
            }),
          ]
        : []),
    ]);

    // Auto-create calendar event for demo_scheduled activities
    if (type === 'demo_scheduled') {
      const lead = await prisma.lead.findUnique({
        where: { id: leadId },
        select: { hotelName: true, assignedToId: true },
      });

      const startTime = eventDate ? new Date(eventDate) : new Date();
      const calAssignedToId = assignedToId
        ? parseInt(assignedToId)
        : lead?.assignedToId || null;

      await prisma.calendarEvent.create({
        data: {
          title: `Demo: ${lead?.hotelName || 'Lead'}`,
          description: note || null,
          startTime,
          type: 'demo',
          leadId,
          assignedToId: calAssignedToId,
        },
      });
    }

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error('POST /api/crm/leads/[id]/activities error:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}
