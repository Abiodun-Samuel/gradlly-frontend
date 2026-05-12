"use client";

import Button from "@/components/ui/Button";
import { CURRENT_PORTAL } from "@/config/portals.config";
import { useLogout } from "@/features/auth/queries/auth.query";

/**
 * Shown when the user is authenticated and has at least one role, but
 * none of their roles match this portal AND none maps to a portal we
 * know how to redirect to.
 *
 * Like AccountPendingScreen, this is rendered IN PLACE — never a
 * redirect from here — to avoid loops.
 */
export function AccessDeniedScreen() {
  const { mutateAsync: signOut, isPending } = useLogout();

  return (
    <main className="min-h-dvh flex items-center justify-center px-4 bg-[#f7f8f7]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-red-600 mb-2">
          Access denied
        </p>
        <h1 className="text-[26px] font-bold text-[#111815] tracking-tight leading-tight mb-3">
          You don&apos;t have access here
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Your account doesn&apos;t have permission to use the {CURRENT_PORTAL}{" "}
          portal. If you believe this is a mistake, contact your administrator.
        </p>

        <Button
          onClick={() => signOut()}
          loading={isPending}
          fullWidth
          variant="secondary"
        >
          Sign out
        </Button>
      </div>
    </main>
  );
}
