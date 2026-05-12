import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { readAccessToken, readRefreshToken } from "../server/session-cookies";
import { getMe } from "../services/auth.service";

import { REQUIRED_ROLE, getPortalUrlForRole } from "@/config/portals.config";

/**
 * `requireAuth` — server-side authorization gate.
 *
 * Call at the top of any protected server component or layout.
 *
 * Decision tree:
 *
 *   ┌─ no access cookie AND no refresh cookie  → /login
 *   ├─ no access cookie BUT has refresh cookie → /api/auth/refresh
 *   ├─ has access cookie BUT getMe() returns null:
 *   │    ├─ has refresh cookie → /api/auth/refresh
 *   │    └─ no refresh cookie  → /login
 *   ├─ has user but no roles at all   → return { user, status: 'pending' }
 *   ├─ has user but wrong role:
 *   │    ├─ has a role they CAN use elsewhere → cross-portal redirect
 *   │    └─ no usable role                    → return { user, status: 'forbidden' }
 *   └─ has user with correct role             → return { user, status: 'ok' }
 *
 * The function returns rather than redirecting in the role-mismatch
 * cases so the layout can render an "awaiting access" screen instead
 * of bouncing the user into a redirect loop.
 */
export async function requireAuth({ requiredRole = REQUIRED_ROLE } = {}) {
  const accessToken = await readAccessToken();
  const refreshToken = await readRefreshToken();

  // No tokens at all — straight to login.
  if (!accessToken && !refreshToken) {
    redirect(await loginUrl());
  }

  // Has refresh but no access — bounce through refresh route to get a
  // new access token, then return here.
  if (!accessToken && refreshToken) {
    redirect(await refreshUrl());
  }

  // Has access token — try to resolve the user.
  const user = await getMe();

  if (!user) {
    // Access token rejected by backend. Try refresh if we can,
    // otherwise back to login.
    if (refreshToken) redirect(await refreshUrl());
    redirect(await loginUrl());
  }

  const roles = Array.isArray(user.roles) ? user.roles : [];

  if (!requiredRole) {
    // Caller didn't specify a role requirement (e.g. a non-portal page).
    return { user, status: "ok" };
  }

  if (roles.length === 0) {
    // Fresh account with no role assigned yet. Don't bounce — render
    // a "waiting for role assignment" screen.
    return { user, status: "pending" };
  }

  if (roles.includes(requiredRole)) {
    return { user, status: "ok" };
  }

  // Wrong role. If they have access to a different portal, send them
  // there. Otherwise show the forbidden screen — DO NOT redirect to
  // /login, the proxy would just bounce them back here.
  const fallbackRole = roles.find((r) => getPortalUrlForRole(r));
  if (fallbackRole) redirect(getPortalUrlForRole(fallbackRole));

  return { user, status: "forbidden" };
}

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

async function currentPath() {
  const h = await headers();
  return h.get("x-pathname") || h.get("x-invoke-path") || "/";
}

async function loginUrl() {
  const path = await currentPath();
  if (!path || path === "/" || path.startsWith("/login")) return "/login";
  return `/login?callbackUrl=${encodeURIComponent(path)}`;
}

async function refreshUrl() {
  const path = await currentPath();
  const cb = path && !path.startsWith("/api/") ? path : "/";
  return `/api/auth/refresh?callbackUrl=${encodeURIComponent(cb)}`;
}
