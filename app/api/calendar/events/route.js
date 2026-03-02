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

// GET /api/calendar/events
// Admin: all events. Sales: events assigned to them or created by them.
export async function GET() {
  try {
    const caller = await getCallerIdentity();
    if (!caller) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

    const where = caller.type === 'admin'
      ? {}
      : {
          OR: [
            { assignedToId: caller.repId },
            { createdById: caller.repId },
          ],
        };

    const events = await prisma.calendarEvent.findMany({
      where,
      include: {
        lead: { select: { id: true, hotelName: true, contactName: true } },
        createdBy: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
      },
      orderBy: { startTime: 'asc' },
    });

    // For admin, also return the list of sales reps (for filtering/assigning)
    let salesReps = [];
    if (caller.type === 'admin') {
      salesReps = await prisma.salesRep.findMany({
        where: { isActive: true },
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' },
      });
    }

    return NextResponse.json({ events, salesReps, callerType: caller.type, callerId: caller.repId });
  } catch (error) {
    console.error('GET /api/calendar/events error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST /api/calendar/events
export async function POST(request) {
  try {
    const caller = await getCallerIdentity();
    if (!caller) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

    const body = await request.json();
    const { title, description, startTime, endTime, type, leadId, assignedToId } = body;

    if (!title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    if (!startTime) return NextResponse.json({ error: 'Start time is required' }, { status: 400 });

    const data = {
      title: title.trim(),
      description: description?.trim() || null,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : null,
      type: type || 'other',
      leadId: leadId ? parseInt(leadId) : null,
    };

    if (caller.type === 'sales') {
      // Sales reps always own their events; they cannot assign to others
      data.createdById = caller.repId;
      data.assignedToId = caller.repId;
    } else {
      // Admin: can assign to a sales rep or keep as an admin event
      data.createdById = null;
      data.assignedToId = assignedToId ? parseInt(assignedToId) : null;
    }

    const event = await prisma.calendarEvent.create({
      data,
      include: {
        lead: { select: { id: true, hotelName: true, contactName: true } },
        createdBy: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('POST /api/calendar/events error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
