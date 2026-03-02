import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/crm/leads/bulk - create multiple leads from CSV upload
export async function POST(request) {
  try {
    const { leads } = await request.json();
    if (!Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json({ error: 'No leads provided' }, { status: 400 });
    }

    const created = await prisma.$transaction(
      leads.map((lead) =>
        prisma.lead.create({
          data: {
            hotelName:     lead.hotelName,
            contactName:   lead.contactName,
            role:          lead.role || '',
            phone:         lead.phone || '',
            mobile:        lead.mobile || '',
            email:         lead.email || '',
            city:          lead.city || '',
            country:       lead.country || '',
            timezone:      lead.timezone || 'UTC',
            status:        'lead',
            value:         parseInt(lead.value) || 0,
            nextActionDate: lead.nextActionDate ? new Date(lead.nextActionDate) : null,
            lastActivity:  'Lead created · CSV import',
            activities: {
              create: {
                type: 'lead_created',
                user: 'Admin',
                note: 'Lead imported via CSV',
              },
            },
          },
        })
      )
    );

    return NextResponse.json({ created: created.length }, { status: 201 });
  } catch (error) {
    console.error('POST /api/crm/leads/bulk error:', error);
    return NextResponse.json({ error: 'Failed to import leads' }, { status: 500 });
  }
}
