import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/crm/leads/[id]/delete-request — sales rep requests lead deletion
export async function POST(request, { params }) {
  try {
    const leadId = parseInt(params.id);
    const { requestedBy, reason } = await request.json();

    if (!requestedBy?.trim()) {
      return NextResponse.json({ error: 'requestedBy is required' }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Only one pending request at a time per lead
    const existing = await prisma.leadDeleteRequest.findFirst({
      where: { leadId, status: 'pending' },
    });
    if (existing) {
      return NextResponse.json({ error: 'A deletion request is already pending for this lead' }, { status: 409 });
    }

    const deleteRequest = await prisma.leadDeleteRequest.create({
      data: {
        leadId,
        requestedBy: requestedBy.trim(),
        reason: reason?.trim() || null,
        status: 'pending',
      },
    });

    return NextResponse.json(deleteRequest, { status: 201 });
  } catch (error) {
    console.error('POST /api/crm/leads/[id]/delete-request error:', error);
    return NextResponse.json({ error: 'Failed to submit deletion request' }, { status: 500 });
  }
}
