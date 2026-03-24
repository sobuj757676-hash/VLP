import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

export function proxy(req: NextRequest) {
  const url = req.nextUrl;

  const hostname = req.headers.get('host') || 'localhost:3000';

  // Extract subdomain or root domain
  let currentHost = hostname;
  if (process.env.NODE_ENV === 'production') {
    currentHost = hostname.replace('.abcd.com', '');
  } else {
    currentHost = hostname.replace('.localhost:3000', '');
  }

  // Root domains
  if (
    currentHost === 'localhost:3000' ||
    currentHost === 'abcd.com' ||
    currentHost === 'www' ||
    currentHost === 'www.abcd.com'
  ) {
    return NextResponse.rewrite(new URL(`/main${url.pathname}`, req.url));
  }

  // Admin Subdomain
  if (currentHost === 'admin') {
    return NextResponse.rewrite(new URL(`/admin${url.pathname}`, req.url));
  }

  // VPN Subdomain
  return NextResponse.rewrite(
    new URL(`/${currentHost}${url.pathname}`, req.url)
  );
}
