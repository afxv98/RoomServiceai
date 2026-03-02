import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/crm/leads - fetch all leads with activities and notes
export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        activities: { orderBy: { timestamp: 'asc' } },
        notes: { orderBy: { timestamp: 'asc' } },
        assignedTo: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error('GET /api/crm/leads error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

// POST /api/crm/leads - create a new lead
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      hotelName,
      contactName,
      role,
      phone,
      mobile,
      email,
      city,
      country,
      timezone,
      value,
      nextActionDate,
      user: createdBy,
    } = body;

    const lead = await prisma.lead.create({
      data: {
        hotelName,
        contactName,
        role,
        phone,
        mobile,
        email,
        city,
        country,
        timezone: timezone || 'UTC',
        status: 'lead',
        value: parseInt(value) || 0,
        nextActionDate: nextActionDate ? new Date(nextActionDate) : null,
        lastActivity: 'Lead created · Just now',
        activities: {
          create: {
            type: 'lead_created',
            user: createdBy || 'Admin',
            note: 'Lead created manually',
          },
        },
      },
      include: {
        activities: true,
        notes: true,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('POST /api/crm/leads error:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
