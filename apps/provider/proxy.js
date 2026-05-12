import { NextResponse } from "next/server";

import { AUTH_COOKIES } from "@/features/auth/constants";

/**
 * Next.js 16 Proxy (formerly middleware).
 *
 * One job: protect non-public routes by bouncing them to /login when
 * there is no auth cookie at all. Per Vercel guidance and CVE-2025-29927
 * we never validate the token here — the real check is `requireAuth()`
 * in the dashboard layout.
 *
 * Note: we deliberately do NOT redirect AWAY from /login or /signup
 * when a cookie is present. Reason: the cookie may be stale, may not
 * correspond to a valid session, or may not include the role this
 * portal requires. The layout decides; the proxy doesn't second-guess.
 * The previous "bounce logged-in user away from /login" rule caused a
 * redirect loop with the layout's role-mismatch redirect.
 *
 * Also stamps `x-pathname` so `requireAuth()` can build accurate
 * callbackUrls.
 */

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];
const SKIP = /^\/(_next|favicon\.ico|api\/auth\/|assets\/)/;

export function proxy(request) {
  const { pathname, search } = request.nextUrl;

  if (SKIP.test(pathname)) {
    const res = NextResponse.next();
    res.headers.set("x-pathname", pathname + search);
    return res;
  }

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (isPublic) {
    const res = NextResponse.next();
    res.headers.set("x-pathname", pathname + search);
    return res;
  }

  const hasSession =
    Boolean(request.cookies.get(AUTH_COOKIES.ACCESS)?.value) ||
    Boolean(request.cookies.get(AUTH_COOKIES.REFRESH)?.value);

  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    if (pathname && pathname !== "/") {
      url.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  res.headers.set("x-pathname", pathname + search);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/).*)"],
};
