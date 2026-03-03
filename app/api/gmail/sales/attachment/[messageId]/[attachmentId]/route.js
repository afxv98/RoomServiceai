import { NextResponse } from 'next/server';
import { getSalesRefreshToken, getGmailClient } from '@/lib/gmail';

export async function GET(request, { params }) {
  const refreshToken = getSalesRefreshToken(request);
  if (!refreshToken) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const { messageId, attachmentId } = params;
    const url = new URL(request.url);
    const filename = url.searchParams.get('filename') || 'attachment';
    const mimeType = url.searchParams.get('type') || 'application/octet-stream';

    const gmail = getGmailClient(refreshToken);
    const res = await gmail.users.messages.attachments.get({ userId: 'me', messageId, id: attachmentId });

    const buffer = Buffer.from((res.data.data || '').replace(/-/g, '+').replace(/_/g, '/'), 'base64');
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Content-Length': String(buffer.length),
      },
    });
  } catch (err) {
    console.error('Sales attachment fetch error:', err);
    return new NextResponse('Failed to fetch attachment', { status: 500 });
  }
}
