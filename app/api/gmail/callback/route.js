import { NextResponse } from 'next/server';
import { getOAuth2Client } from '@/lib/gmail';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state') || 'admin';
  const isSales = state === 'sales';

  const base = new URL(request.url).origin;
  const errorRedirect = isSales ? `${base}/sales/email?gmail_error=auth_denied` : `${base}/admin/email?gmail_error=auth_denied`;

  if (error || !code) {
    return NextResponse.redirect(errorRedirect);
  }

  try {
    const client = getOAuth2Client();
    const { tokens } = await client.getToken(code);

    if (!tokens.refresh_token) {
      const noTokenRedirect = isSales
        ? `${base}/sales/email?gmail_error=no_refresh_token`
        : `${base}/admin/email?gmail_error=no_refresh_token`;
      return NextResponse.redirect(noTokenRedirect);
    }

    const cookieName = isSales ? 'sales_gmail_refresh_token' : 'gmail_refresh_token';
    const successRedirect = isSales ? `${base}/sales/email?gmail_connected=1` : `${base}/admin/email?gmail_connected=1`;

    const response = NextResponse.redirect(successRedirect);
    response.cookies.set(cookieName, tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    return response;
  } catch (err) {
    console.error('Gmail OAuth callback error:', err);
    const failRedirect = isSales ? `${base}/sales/email?gmail_error=auth_failed` : `${base}/admin/email?gmail_error=auth_failed`;
    return NextResponse.redirect(failRedirect);
  }
}
