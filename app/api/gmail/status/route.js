import { NextResponse } from 'next/server';
import { getRefreshToken, getGmailClient } from '@/lib/gmail';

export async function GET(request) {
  const refreshToken = getRefreshToken(request);
  if (!refreshToken) {
    return NextResponse.json({ connected: false });
  }

  // Do a lightweight profile call to verify the token is still valid.
  try {
    const gmail = getGmailClient(refreshToken);
    const profile = await gmail.users.getProfile({ userId: 'me' });
    return NextResponse.json({
      connected: true,
      email: profile.data.emailAddress,
    });
  } catch {
    return NextResponse.json({ connected: false, error: 'token_invalid' });
  }
}
