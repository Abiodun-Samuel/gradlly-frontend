"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { AUTH_QUERY_KEYS } from "@/features/auth/queries/keys";
import { toastError } from "@/hooks/useToast";
import { setActiveOrgId } from "@/lib/api/active-org";

/**
 * Drives switching the active organisation within the current portal.
 *
 * Flow: write the active-org cookie → the next request (getMe) carries the new
 * X-Organisation-Id → the backend returns that org as `activeOrganisation`. We
 * drop all cached queries first so no org-scoped data leaks across the switch,
 * then refetch `me` so `useAuthUser`'s loading state drives the UI transition.
 */
export function useOrgSwitcher() {
  const qc = useQueryClient();
  const router = useRouter();
  const {
    orgId: activeOrgId,
    organisations,
    canSwitchOrganisation,
  } = useAuthUser();
  const [switchingTo, setSwitchingTo] = useState(null);

  async function switchOrganisation(nextOrgId) {
    if (!nextOrgId || nextOrgId === activeOrgId || switchingTo) return;

    setSwitchingTo(nextOrgId);
    try {
      // Point every subsequent request at the new org.
      setActiveOrgId(nextOrgId);

      // Clear org-scoped caches so the previous org's data never flashes through,
      // then refetch the profile under the new org context.
      qc.removeQueries();
      await qc.refetchQueries({ queryKey: AUTH_QUERY_KEYS.me() });

      // Refresh server components (layouts, etc.) that read the session.
      router.refresh();
    } catch {
      // Revert the cookie so the UI and header stay consistent on failure.
      setActiveOrgId(activeOrgId);
      toastError("Couldn't switch organisation. Please try again.");
    } finally {
      setSwitchingTo(null);
    }
  }

  return {
    organisations,
    activeOrgId,
    canSwitchOrganisation,
    switchingTo,
    isSwitching: Boolean(switchingTo),
    switchOrganisation,
  };
}
