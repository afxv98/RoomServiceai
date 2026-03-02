import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

async function getCallerIdentity() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin_session')?.value;
  if (adminSession === '1') return { type: 'admin', repId: null };

  const salesSession = cookieStore.get('sales_session')?.value;
  if (salesSession) {
    const repId = parseInt(salesSession);
    if (!isNaN(repId)) return { type: 'sales', repId };
  }
  return null;
}

// PUT /api/calendar/events/[id]
export async function PUT(request, { params }) {
  try {
    const caller = await getCallerIdentity();
    if (!caller) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

    const id = parseInt(params.id);
    const existing = await prisma.calendarEvent.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    // Sales can only edit events they own
    if (caller.type === 'sales') {
      const owns = existing.createdById === caller.repId || existing.assignedToId === caller.repId;
      if (!owns) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, startTime, endTime, type, leadId, assignedToId } = body;

    const data = {};
    if (title !== undefined) data.title = title.trim();
    if (description !== undefined) data.description = description?.trim() || null;
    if (startTime !== undefined) data.startTime = new Date(startTime);
    if (endTime !== undefined) data.endTime = endTime ? new Date(endTime) : null;
    if (type !== undefined) data.type = type;
    if (leadId !== undefined) data.leadId = leadId ? parseInt(leadId) : null;
    // Only admin can reassign
    if (caller.type === 'admin' && assignedToId !== undefined) {
      data.assignedToId = assignedToId ? parseInt(assignedToId) : null;
    }

    const event = await prisma.calendarEvent.update({
      where: { id },
      data,
      include: {
        lead: { select: { id: true, hotelName: true, contactName: true } },
        createdBy: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('PUT /api/calendar/events/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE /api/calendar/events/[id]
export async function DELETE(request, { params }) {
  try {
    const caller = await getCallerIdentity();
    if (!caller) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

    const id = parseInt(params.id);
    const existing = await prisma.calendarEvent.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    if (caller.type === 'sales') {
      const owns = existing.createdById === caller.repId || existing.assignedToId === caller.repId;
      if (!owns) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.calendarEvent.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/calendar/events/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
