import { NextResponse } from 'next/server';
import { getRefreshToken, getGmailClient, buildEmailRaw } from '@/lib/gmail';

export async function POST(request) {
  const refreshToken = getRefreshToken(request);
  if (!refreshToken) {
    return NextResponse.json({ error: 'not_connected' }, { status: 401 });
  }

  try {
    const {
      threadId,    // omit for compose (new) emails
      to,
      subject,
      body,
      inReplyTo,
      references,
      attachments, // [{ name, type, data }] — data is raw base64 (no data-URL prefix)
    } = await request.json();

    if (!to || !body) {
      return NextResponse.json(
        { error: 'Missing required fields: to, body' },
        { status: 400 },
      );
    }

    const raw = buildEmailRaw({
      to,
      subject: subject || '',
      body,
      inReplyTo: inReplyTo || '',
      references: references || '',
      isReply: !!threadId,
      attachments: attachments || [],
    });

    const gmail = getGmailClient(refreshToken);

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw,
        ...(threadId ? { threadId } : {}),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Gmail send error:', err);
    return NextResponse.json({ error: 'send_failed' }, { status: 500 });
  }
}
