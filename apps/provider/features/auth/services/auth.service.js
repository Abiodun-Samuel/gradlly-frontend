import "server-only";
import { cache } from "react";

import { AUTH_API_PATHS } from "../constants";
import {
  writeSessionCookies,
  clearSessionCookies,
  readAccessToken,
  readRefreshToken,
} from "../server/session-cookies";
import { upstreamFetch, unwrap } from "../server/upstream-fetch";

/**
 * Auth service — orchestrates upstream calls and cookie writes.
 *
 * IMPORTANT — context separation:
 *
 *   • Functions that MUTATE cookies (`signup`, `login`, `logout`,
 *     `refresh`) are only safe to call from Server Actions or Route
 *     Handlers. Calling them from a Server Component will throw.
 *
 *   • `getMe()` is read-only and safe to call from anywhere (including
 *     Server Components and layouts). If the access token is missing
 *     or invalid, it returns `null` — it does NOT attempt to refresh,
 *     because refreshing writes cookies and that would crash a layout.
 *     The caller (e.g. `requireAuth`) handles `null` by redirecting to
 *     `/login`.
 *
 * For *authenticated upstream calls* from the browser, refresh is
 * handled inside the BFF route handler (`/api/auth/proxy/...`) where
 * cookie writes are permitted. That's the right place to rotate
 * tokens transparently.
 */

// ---------------------------------------------------------------------------
// Mutating operations (Server Actions / Route Handlers only)
// ---------------------------------------------------------------------------

export async function signup(payload) {
  const result = await upstreamFetch(AUTH_API_PATHS.SIGNUP, {
    method: "POST",
    body: payload,
  });
  const tokens = unwrap(result);
  await writeSessionCookies(tokens);
  return tokens;
}

export async function login(payload) {
  const result = await upstreamFetch(AUTH_API_PATHS.LOGIN, {
    method: "POST",
    body: payload,
  });
  const tokens = unwrap(result);
  await writeSessionCookies(tokens);
  return tokens;
}

/**
 * Refresh the access token using the stored refresh token.
 *
 * ⚠ Only call from a Server Action or Route Handler — this writes
 * cookies. From a Server Component, use `getMe()` and handle `null`.
 *
 * Returns the new token pair, or `null` if refresh failed (in which
 * case cookies are cleared).
 */
export async function refresh() {
  const refreshToken = await readRefreshToken();
  if (!refreshToken) return null;

  try {
    const result = await upstreamFetch(AUTH_API_PATHS.REFRESH, {
      method: "POST",
      body: { refreshToken },
    });
    const tokens = unwrap(result);
    if (!tokens.accessToken) {
      await clearSessionCookies();
      return null;
    }
    const rotated = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken ?? refreshToken,
    };
    await writeSessionCookies(rotated);
    return rotated;
  } catch {
    await clearSessionCookies();
    return null;
  }
}

export async function logout() {
  const refreshToken = await readRefreshToken();
  if (refreshToken) {
    try {
      await upstreamFetch(AUTH_API_PATHS.LOGOUT, {
        method: "POST",
        body: { refreshToken },
      });
    } catch {
      // Server-side invalidation is best-effort; we always clear locally.
    }
  }
  await clearSessionCookies();
}

// ---------------------------------------------------------------------------
// Read-only operation — safe in Server Components
// ---------------------------------------------------------------------------

/**
 * Fetch the current user with the stored access token. Read-only —
 * does NOT touch cookies, so this is safe to call from layouts and
 * server components.
 *
 * Wrapped in React's `cache()` so multiple calls within the same
 * request share one upstream round-trip. Layout calls it, page calls
 * it, sidebar calls it — only one fetch happens.
 *
 * Returns `null` when:
 *   • there is no access token, or
 *   • the upstream returns 401 (access token expired or invalid)
 *
 * Callers handle `null` by redirecting to `/login`. The user re-logs
 * in, which sets fresh cookies via the login action — no in-render
 * refresh needed.
 */
export const getMe = cache(async () => {
  const accessToken = await readAccessToken();
  if (!accessToken) return null;

  try {
    const result = await upstreamFetch(AUTH_API_PATHS.ME, { accessToken });
    return unwrap(result);
  } catch (err) {
    if (err?.status === 401) return null;
    throw err;
  }
});
