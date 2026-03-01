import { NextResponse } from 'next/server';
import { getRefreshToken, getGmailClient, getHeader } from '@/lib/gmail';

export async function GET(request) {
  const refreshToken = getRefreshToken(request);
  if (!refreshToken) {
    return NextResponse.json({ error: 'not_connected' }, { status: 401 });
  }

  try {
    const gmail = getGmailClient(refreshToken);

    // 1. List threads in the inbox (most recent first)
    const listRes = await gmail.users.threads.list({
      userId: 'me',
      labelIds: ['INBOX'],
      maxResults: 25,
    });

    const threadItems = listRes.data.threads || [];
    if (threadItems.length === 0) {
      return NextResponse.json({ threads: [] });
    }

    // 2. Fetch metadata for each thread in parallel
    const threads = await Promise.all(
      threadItems.map(async ({ id }) => {
        try {
          const res = await gmail.users.threads.get({
            userId: 'me',
            id,
            format: 'METADATA',
            metadataHeaders: ['Subject', 'From', 'Date'],
          });

          const messages = res.data.messages || [];
          // Use the last (most recent) message for display
          const latest = messages[messages.length - 1];
          const headers = latest?.payload?.headers || [];
          const labelIds = latest?.labelIds || [];

          return {
            id,
            subject: getHeader(headers, 'Subject') || '(no subject)',
            from: getHeader(headers, 'From'),
            date: getHeader(headers, 'Date'),
            snippet: res.data.snippet || '',
            unread: labelIds.includes('UNREAD'),
            messageCount: messages.length,
          };
        } catch {
          return null;
        }
      }),
    );

    return NextResponse.json({
      threads: threads.filter(Boolean),
    });
  } catch (err) {
    console.error('Gmail threads fetch error:', err);
    return NextResponse.json({ error: 'fetch_failed' }, { status: 500 });
  }
}
