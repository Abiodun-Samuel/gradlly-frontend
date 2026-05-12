import "server-only";
import { NextResponse } from "next/server";

import { refresh } from "@/features/auth/services/auth.service";

/**
 * GET /api/auth/refresh?callbackUrl=<path>
 *
 * Why this route exists:
 * ----------------------
 * Server Components and layouts cannot write cookies. When a layout
 * detects that the access token has expired but the refresh token is
 * still valid, it cannot itself rotate the tokens — it has to bounce
 * through a Route Handler, which can.
 *
 * Flow (e.g. user navigates to `/` after their access token expired):
 *   1. Layout calls `getMe()` → null
 *   2. `requireAuth()` redirects to `/api/auth/refresh?callbackUrl=/`
 *   3. This handler reads the refresh cookie, calls upstream
 *      /auth/refresh, writes the new tokens into the response cookies,
 *      then 307s back to `/`
 *   4. Browser follows the redirect with fresh cookies attached
 *   5. Layout re-runs, `getMe()` succeeds, the dashboard renders
 *
 * If refresh fails, `refresh()` clears the cookies itself, and we send
 * the user to /login (preserving their original destination so they
 * land where they wanted after re-login).
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// callbackUrl must be a same-origin path (start with "/", not "//").
const SAFE_CALLBACK = /^\/(?!\/)/;

function safeCallback(raw) {
  if (typeof raw !== "string") return "/";
  if (!SAFE_CALLBACK.test(raw)) return "/";
  return raw;
}

export async function GET(req) {
  const url = new URL(req.url);
  const callback = safeCallback(url.searchParams.get("callbackUrl") ?? "/");

  const rotated = await refresh();

  const target = new URL(rotated ? callback : "/login", url.origin);
  if (!rotated && callback !== "/") {
    target.searchParams.set("callbackUrl", callback);
  }

  return NextResponse.redirect(target, 307);
}
