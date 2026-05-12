"use client";

import Link from "next/link";

import {
  CURRENT_PORTAL,
  PORTAL_DISPLAY_NAMES,
  PORTAL_URLS,
  MAIN_URL,
} from "@/config/portals.config";
import { useLogout } from "@/features/auth/queries/auth.query";
import { getAccessiblePortals } from "@/features/auth/utils/portal-access";

/**
 * Rendered by the dashboard layout when the authenticated user has no role
 * for THIS portal. Offers two ways forward:
 *   1. A link to each portal the user actually has access to.
 *   2. A logout button (so they can sign in as a different user).
 */
export function NotAuthorizedForPortal({ user }) {
  const accessible = getAccessiblePortals(user);
  const logout = useLogout();

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f7f9f8] p-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-2">
          Access denied
        </p>
        <h1 className="text-2xl font-bold text-[#111815] mb-2">
          No access to the {PORTAL_DISPLAY_NAMES[CURRENT_PORTAL]}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Signed in as{" "}
          <span className="font-medium text-[#111815]">{user?.email}</span>.
          Your account doesn&apos;t have the role required for this portal.
        </p>

        {accessible.length > 0 ? (
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Portals you can access
            </p>
            <ul className="space-y-2">
              {accessible.map((id) => (
                <li key={id}>
                  <Link
                    href={PORTAL_URLS[id]}
                    className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-[#111815] hover:bg-gray-50"
                  >
                    <span>{PORTAL_DISPLAY_NAMES[id]}</span>
                    <span className="text-gray-400">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
            Your account has no portal roles assigned. Contact your
            administrator or{" "}
            <a href={MAIN_URL} className="font-medium underline">
              return to the main site
            </a>
            .
          </div>
        )}

        <button
          type="button"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="w-full py-3 rounded-xl font-semibold text-[#111815] text-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-60"
        >
          {logout.isPending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </main>
  );
}
