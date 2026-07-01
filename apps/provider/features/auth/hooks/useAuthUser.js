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
  const orgId = activeOrganisation?.organisation?.id ?? null;

  // Organisations the user can switch to *within this portal*. Cross-portal
  // organisations are intentionally excluded — switching only ever stays on the
  // current portal, so the active-org header always matches X-Portal-Type.
  const organisations = (data?.organisations ?? []).filter(
    (org) => org?.portalType === PORTAL.key,
  );
  const canSwitchOrganisation = organisations.length > 1;

  // Keep the active-org cookie in sync before child queries fire (layout effect
  // runs before paint; dashboard/reporting hooks read the cookie on first fetch).
  useLayoutEffect(() => {
    setActiveOrgId(orgId);
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
