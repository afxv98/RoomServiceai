import { NextResponse } from 'next/server';
import { getOAuth2Client } from '@/lib/gmail';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const base = new URL(request.url).origin;

  if (error || !code) {
    return NextResponse.redirect(`${base}/admin/email?gmail_error=auth_denied`);
  }

  try {
    const client = getOAuth2Client();
    const { tokens } = await client.getToken(code);

    if (!tokens.refresh_token) {
      // Refresh token is only returned on first authorization or when prompt=consent.
      // If it's missing, the account was already authorized — direct the admin to
      // revoke access in Google and re-connect.
      return NextResponse.redirect(
        `${base}/admin/email?gmail_error=no_refresh_token`,
      );
    }

    // Store the refresh token in a long-lived httpOnly cookie.
    // This is the primary persistence mechanism for serverless deployments.
    const response = NextResponse.redirect(`${base}/admin/email?gmail_connected=1`);
    response.cookies.set('gmail_refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    return response;
  } catch (err) {
    console.error('Gmail OAuth callback error:', err);
    return NextResponse.redirect(`${base}/admin/email?gmail_error=auth_failed`);
  }
}
