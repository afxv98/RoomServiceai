import { NextResponse } from 'next/server';
import { getSalesRefreshToken, getGmailClient, getHeader } from '@/lib/gmail';

export async function GET(request) {
  const refreshToken = getSalesRefreshToken(request);
  if (!refreshToken) return NextResponse.json({ error: 'not_connected' }, { status: 401 });

  try {
    const gmail = getGmailClient(refreshToken);
    const listRes = await gmail.users.threads.list({ userId: 'me', labelIds: ['INBOX'], maxResults: 25 });
    const threadItems = listRes.data.threads || [];
    if (!threadItems.length) return NextResponse.json({ threads: [] });

    const threads = await Promise.all(
      threadItems.map(async ({ id }) => {
        try {
          const res = await gmail.users.threads.get({ userId: 'me', id, format: 'METADATA', metadataHeaders: ['Subject', 'From', 'Date'] });
          const messages = res.data.messages || [];
          const latest = messages[messages.length - 1];
          const headers = latest?.payload?.headers || [];
          const labelIds = latest?.labelIds || [];
          return { id, subject: getHeader(headers, 'Subject') || '(no subject)', from: getHeader(headers, 'From'), date: getHeader(headers, 'Date'), snippet: res.data.snippet || '', unread: labelIds.includes('UNREAD'), messageCount: messages.length };
        } catch { return null; }
      }),
    );
    return NextResponse.json({ threads: threads.filter(Boolean) });
  } catch (err) {
    console.error('Sales Gmail threads error:', err);
    return NextResponse.json({ error: 'fetch_failed' }, { status: 500 });
  }
}
