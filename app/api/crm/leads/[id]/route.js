import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/crm/leads/[id] - fetch a single lead
export async function GET(request, { params }) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        activities: { orderBy: { timestamp: 'asc' } },
        notes: { orderBy: { timestamp: 'asc' } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error('GET /api/crm/leads/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
  }
}

// PUT /api/crm/leads/[id] - update a lead
export async function PUT(request, { params }) {
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
      status,
      value,
      nextActionDate,
      lastActivity,
      assignedToId,
    } = body;

    const updateData = {};
    if (hotelName !== undefined) updateData.hotelName = hotelName;
    if (contactName !== undefined) updateData.contactName = contactName;
    if (role !== undefined) updateData.role = role;
    if (phone !== undefined) updateData.phone = phone;
    if (mobile !== undefined) updateData.mobile = mobile;
    if (email !== undefined) updateData.email = email;
    if (city !== undefined) updateData.city = city;
    if (country !== undefined) updateData.country = country;
    if (timezone !== undefined) updateData.timezone = timezone;
    if (status !== undefined) updateData.status = status;
    if (value !== undefined) updateData.value = parseInt(value) || 0;
    if (nextActionDate !== undefined) {
      updateData.nextActionDate = nextActionDate ? new Date(nextActionDate) : null;
    }
    if (lastActivity !== undefined) updateData.lastActivity = lastActivity;
    if (assignedToId !== undefined) updateData.assignedToId = assignedToId ? parseInt(assignedToId) : null;

    const lead = await prisma.lead.update({
      where: { id: parseInt(params.id) },
      data: updateData,
      include: {
        activities: { orderBy: { timestamp: 'asc' } },
        notes: { orderBy: { timestamp: 'asc' } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error('PUT /api/crm/leads/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

// DELETE /api/crm/leads/[id] - delete a lead
export async function DELETE(request, { params }) {
  try {
    await prisma.lead.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/crm/leads/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
