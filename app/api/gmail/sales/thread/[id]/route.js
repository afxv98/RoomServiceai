import { NextResponse } from 'next/server';
import { getSalesRefreshToken, getGmailClient, getHeader, extractBody, extractAttachments } from '@/lib/gmail';

export async function GET(request, { params }) {
  const refreshToken = getSalesRefreshToken(request);
  if (!refreshToken) return NextResponse.json({ error: 'not_connected' }, { status: 401 });

  try {
    const gmail = getGmailClient(refreshToken);
    const { id } = params;
    const res = await gmail.users.threads.get({ userId: 'me', id, format: 'FULL' });
    const messages = (res.data.messages || []).map((msg) => {
      const headers = msg.payload?.headers || [];
      return {
        id: msg.id,
        from: getHeader(headers, 'From'),
        to: getHeader(headers, 'To'),
        date: getHeader(headers, 'Date'),
        subject: getHeader(headers, 'Subject'),
        messageId: getHeader(headers, 'Message-ID'),
        references: getHeader(headers, 'References'),
        body: extractBody(msg.payload),
        attachments: extractAttachments(msg.payload || {}, msg.id),
        unread: (msg.labelIds || []).includes('UNREAD'),
      };
    });
    gmail.users.threads.modify({ userId: 'me', id, requestBody: { removeLabelIds: ['UNREAD'] } }).catch(() => {});
    return NextResponse.json({ messages });
  } catch (err) {
    console.error('Sales Gmail thread error:', err);
    return NextResponse.json({ error: 'fetch_failed' }, { status: 500 });
  }
}
