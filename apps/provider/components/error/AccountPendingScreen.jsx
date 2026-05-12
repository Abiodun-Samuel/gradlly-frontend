"use client";

import Button from "@/components/ui/Button";
import { CURRENT_PORTAL } from "@/config/portals.config";
import { useLogout } from "@/features/auth/queries/auth.query";

/**
 * Shown when the user is authenticated but has no role assigned yet
 * (typical for a brand-new signup awaiting onboarding).
 *
 * Critically, this is rendered IN PLACE — it does not redirect — so
 * the user doesn't end up in a redirect loop between the proxy and
 * the layout.
 */
export function AccountPendingScreen({ user }) {
  const { mutateAsync: signOut, isPending } = useLogout();

  return (
    <main className="min-h-dvh flex items-center justify-center px-4 bg-[#f7f8f7]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#2d7a50] mb-2">
          Almost there
        </p>
        <h1 className="text-[26px] font-bold text-[#111815] tracking-tight leading-tight mb-3">
          Your account is being set up
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Hi {user?.firstName ?? "there"} — we&apos;ve received your signup.
          Access to the {CURRENT_PORTAL} portal will be enabled once your
          account has been reviewed. We&apos;ll email you at {user?.email} when
          it&apos;s ready.
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
