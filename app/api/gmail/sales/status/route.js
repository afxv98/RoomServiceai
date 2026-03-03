import { NextResponse } from 'next/server';
import { getSalesRefreshToken, getGmailClient } from '@/lib/gmail';

export async function GET(request) {
  const refreshToken = getSalesRefreshToken(request);
  if (!refreshToken) return NextResponse.json({ connected: false });

  try {
    const gmail = getGmailClient(refreshToken);
    const profile = await gmail.users.getProfile({ userId: 'me' });
    return NextResponse.json({ connected: true, email: profile.data.emailAddress });
  } catch {
    return NextResponse.json({ connected: false, error: 'token_invalid' });
  }
}
