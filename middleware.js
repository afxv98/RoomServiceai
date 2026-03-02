import { NextResponse } from 'next/server';

/**
 * Subdomain routing middleware.
 *
 * admin.roomserviceai.com  →  internal /admin/*  routes
 * sales.roomserviceai.com  →  internal /sales/*  routes
 *
 * Works for both production (*.roomserviceai.com) and local dev
 * (admin.localhost:3000 / sales.localhost:3000).
 *
 * Set NEXT_PUBLIC_ROOT_DOMAIN in your environment if the production
 * domain differs from the default "roomserviceai.com".
 */
export function middleware(request) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const pathname = url.pathname;

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'roomserviceai.com';

  // ── Resolve subdomain ──────────────────────────────────────────────────────
  let subdomain = null;

  if (hostname.endsWith(`.${rootDomain}`)) {
    // Production:  admin.roomserviceai.com  →  "admin"
    subdomain = hostname.slice(0, -(rootDomain.length + 1));
  } else {
    // Local dev:  admin.localhost:3000  →  "admin"
    const hostWithoutPort = hostname.split(':')[0];
    const parts = hostWithoutPort.split('.');
    if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
      subdomain = parts.slice(0, -1).join('.');
    }
  }

  // ── Admin subdomain ────────────────────────────────────────────────────────
  // admin.roomserviceai.com/          →  /admin
  // admin.roomserviceai.com/users     →  /admin/users
  // admin.roomserviceai.com/login     →  /login  (shared login page, no rewrite)
  // admin.roomserviceai.com/admin/X   →  /admin/X (already prefixed, no change)
  // admin.roomserviceai.com/api/X     →  /api/X   (API routes, no rewrite)
  if (subdomain === 'admin') {
    if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/api') ||
      pathname === '/login' ||
      pathname === '/manifest.json' ||
      pathname === '/robots.txt'
    ) {
      return NextResponse.next();
    }
    url.pathname = pathname === '/' ? '/admin' : `/admin${pathname}`;
    return NextResponse.rewrite(url);
  }

  // ── Sales subdomain ────────────────────────────────────────────────────────
  // sales.roomserviceai.com/          →  /sales
  // sales.roomserviceai.com/login     →  /sales/login
  // sales.roomserviceai.com/sales/X   →  /sales/X  (already prefixed, no change)
  // sales.roomserviceai.com/api/X     →  /api/X    (API routes, no rewrite)
  if (subdomain === 'sales') {
    if (pathname.startsWith('/sales') || pathname.startsWith('/api')) {
      return NextResponse.next();
    }
    url.pathname = pathname === '/' ? '/sales' : `/sales${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run on all paths except Next.js internals and static assets.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
