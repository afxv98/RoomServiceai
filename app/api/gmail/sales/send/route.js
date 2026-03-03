import { NextResponse } from 'next/server';
import { getSalesRefreshToken, getGmailClient, buildEmailRaw } from '@/lib/gmail';

export async function POST(request) {
  const refreshToken = getSalesRefreshToken(request);
  if (!refreshToken) return NextResponse.json({ error: 'not_connected' }, { status: 401 });

  try {
    const { threadId, to, subject, body, inReplyTo, references, attachments } = await request.json();
    if (!to || !body) return NextResponse.json({ error: 'Missing required fields: to, body' }, { status: 400 });

    const raw = buildEmailRaw({ to, subject: subject || '', body, inReplyTo: inReplyTo || '', references: references || '', isReply: !!threadId, attachments: attachments || [] });
    const gmail = getGmailClient(refreshToken);
    await gmail.users.messages.send({ userId: 'me', requestBody: { raw, ...(threadId ? { threadId } : {}) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Sales Gmail send error:', err);
    return NextResponse.json({ error: 'send_failed' }, { status: 500 });
  }
}
