import "server-only";
import { cookies } from "next/headers";

import { AUTH_COOKIES } from "../constants";

import { serverEnv } from "@/config/env/server";

/**
 * Session cookie operations.
 *
 * IMPORTANT — Next.js constraint:
 * Cookies can only be MUTATED from Server Actions and Route Handlers.
 * Reading them from a Server Component is fine; writing or clearing
 * from one throws at runtime.
 *
 * So this module is split by intent:
 *
 *   • read{Access,Refresh}Token()  — safe everywhere (read-only)
 *   • writeSessionCookies()        — only from actions / route handlers
 *   • clearSessionCookies()        — only from actions / route handlers
 *
 * Note on cookie lifetimes: the BACKEND owns real token expiry via the
 * JWT `exp` claim. The cookie `maxAge` here is just a generous upper
 * bound so the browser doesn't keep obviously dead values forever.
 * We give the access cookie a non-trivial maxAge (vs leaving it as a
 * session cookie) because some browsers in dev tools "disable cache"
 * mode handle session cookies inconsistently across navigations.
 */

const ACCESS_COOKIE_MAX_AGE = 60 * 60; // 1h — backend expires sooner
const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function baseOptions() {
  const isProd = serverEnv.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    domain: serverEnv.AUTH_COOKIE_DOMAIN || undefined,
  };
}

// ---------------------------------------------------------------------------
// Read — safe in any server context
// ---------------------------------------------------------------------------

export async function readAccessToken() {
  const store = await cookies();
  return store.get(AUTH_COOKIES.ACCESS)?.value ?? null;
}

export async function readRefreshToken() {
  const store = await cookies();
  return store.get(AUTH_COOKIES.REFRESH)?.value ?? null;
}

// ---------------------------------------------------------------------------
// Write — ONLY from Server Actions or Route Handlers
// ---------------------------------------------------------------------------

export async function writeSessionCookies({ accessToken, refreshToken }) {
  const store = await cookies();
  const opts = baseOptions();

  store.set({
    ...opts,
    name: AUTH_COOKIES.ACCESS,
    value: accessToken,
    maxAge: ACCESS_COOKIE_MAX_AGE,
  });
  store.set({
    ...opts,
    name: AUTH_COOKIES.REFRESH,
    value: refreshToken,
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });
}

export async function clearSessionCookies() {
  const store = await cookies();
  const opts = baseOptions();
  for (const name of [AUTH_COOKIES.ACCESS, AUTH_COOKIES.REFRESH]) {
    store.set({ ...opts, name, value: "", maxAge: 0 });
  }
}
