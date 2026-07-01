"use client";

import { useLayoutEffect } from "react";

import { PORTAL } from "@/config/portal.config";
import { useMe } from "@/features/auth/queries/auth.query";
import { setActiveOrgId } from "@/lib/api/active-org";

const MANAGE_ROLES = new Set(["owner", "admin"]);

/**
 * Public interface to the current authenticated user.
 *
 * Wraps useMe so consumers never import from the query layer directly.
 * All dashboard components should use this hook — never useMe.
 */
export function useAuthUser() {
  const { data, isLoading, isError, error } = useMe();

  const activeOrganisation = data?.activeOrganisation ?? null;
  const userRoles = activeOrganisation?.roles ?? [];
  const organisations = (data?.organisations ?? []).filter(
    (org) => org?.portalType === PORTAL.key,
  );
  const orgId =
    activeOrganisation?.organisation?.id ?? organisations[0]?.id ?? null;
  const canSwitchOrganisation = organisations.length > 1;

  // Write the cookie when we know the org; never clear it here — logout handles
  // that. Clearing on a transient null (e.g. /me refetch after accept-invite)
  // would strip X-Organisation-Id from dashboard queries mid-session.
  useLayoutEffect(() => {
    if (orgId) setActiveOrgId(orgId);
  }, [orgId]);

  return {
    user: data ?? null,
    activeOrganisation,
    organisations,
    canSwitchOrganisation,
    orgId,
    userRoles,
    canManageInvitations: userRoles.some((r) => MANAGE_ROLES.has(r)),
    isLoading,
    isError,
    error,
  };
}
