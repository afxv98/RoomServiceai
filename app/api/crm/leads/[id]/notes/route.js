import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/crm/leads/[id]/notes - add a note to a lead
export async function POST(request, { params }) {
  try {
    const body = await request.json();
    const { text, user } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Note text is required' }, { status: 400 });
    }

    const note = await prisma.note.create({
      data: {
        leadId: parseInt(params.id),
        text: text.trim(),
        user: user || 'Admin',
        timestamp: new Date(),
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('POST /api/crm/leads/[id]/notes error:', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}
