import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/crm/delete-requests/[id] — admin approves or denies a deletion request
// body: { action: 'approve' | 'deny' }
export async function PATCH(request, { params }) {
  try {
    const requestId = parseInt(params.id);
    const { action } = await request.json();

    if (!['approve', 'deny'].includes(action)) {
      return NextResponse.json({ error: 'action must be "approve" or "deny"' }, { status: 400 });
    }

    const deleteRequest = await prisma.leadDeleteRequest.findUnique({
      where: { id: requestId },
    });
    if (!deleteRequest) {
      return NextResponse.json({ error: 'Delete request not found' }, { status: 404 });
    }
    if (deleteRequest.status !== 'pending') {
      return NextResponse.json({ error: 'This request has already been reviewed' }, { status: 409 });
    }

    if (action === 'approve') {
      // Delete the lead (cascades to activities, notes, etc.) and mark request approved
      await prisma.$transaction([
        prisma.leadDeleteRequest.update({
          where: { id: requestId },
          data: { status: 'approved', reviewedAt: new Date() },
        }),
        prisma.lead.delete({ where: { id: deleteRequest.leadId } }),
      ]);
      return NextResponse.json({ success: true, action: 'approved' });
    } else {
      // Deny — keep lead, mark request denied
      const updated = await prisma.leadDeleteRequest.update({
        where: { id: requestId },
        data: { status: 'denied', reviewedAt: new Date() },
      });
      return NextResponse.json({ success: true, action: 'denied', request: updated });
    }
  } catch (error) {
    console.error('PATCH /api/crm/delete-requests/[id] error:', error);
    return NextResponse.json({ error: 'Failed to process delete request' }, { status: 500 });
  }
}
