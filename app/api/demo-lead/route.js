import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { fullName, email, hotelName, source } = await request.json();

    const leadSource = source || 'Website';

    // Save lead to CRM database (non-blocking — failure won't stop the user)
    try {
      await prisma.lead.create({
        data: {
          hotelName: hotelName || '',
          contactName: fullName || '',
          role: '',
          phone: '',
          mobile: '',
          email: email || '',
          city: '',
          country: '',
          lastActivity: `Lead from ${leadSource}`,
          activities: {
            create: [
              {
                type: 'lead_created',
                user: 'Website',
                note: `Submitted via ${leadSource}`,
              },
            ],
          },
        },
      });
    } catch (dbError) {
      console.error('Failed to save lead to CRM:', dbError);
    }

    // Forward to n8n webhook if configured
    const webhookUrl = process.env.n8n;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          hotelName,
          submittedAt: new Date().toISOString(),
          source: leadSource,
        }),
      }).catch((err) => console.error('n8n webhook error:', err));
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Demo lead submission error:', error);
    // Don't block the user if lead capture fails
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
