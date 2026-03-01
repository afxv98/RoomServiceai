import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const formData = await request.json();

    // Build the phone string (countryCode may or may not be present)
    const phone = formData.countryCode
      ? `${formData.countryCode} ${formData.phone || ''}`.trim()
      : (formData.phone || '');

    // Save lead to CRM database (non-blocking — failure won't stop the user)
    try {
      await prisma.lead.create({
        data: {
          hotelName: formData.property || formData.hotelName || '',
          contactName: formData.fullName || '',
          role: '',
          phone,
          mobile: '',
          email: formData.email || '',
          city: formData.city || '',
          country: formData.country || '',
          lastActivity: 'Lead from website contact form',
          activities: {
            create: [
              {
                type: 'lead_created',
                user: 'Website',
                note: 'Submitted via contact form',
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
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone,
          email: formData.email,
          country: formData.country,
          city: formData.city,
          property: formData.property || formData.hotelName,
          submittedAt: new Date().toISOString(),
          source: 'RoomService AI Website Contact Form',
        }),
      });

      if (!webhookResponse.ok) {
        console.error(`n8n webhook returned status ${webhookResponse.status}`);
      }
    }

    return NextResponse.json(
      { success: true, message: 'Form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again.' },
      { status: 500 }
    );
  }
}
