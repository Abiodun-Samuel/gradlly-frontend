"use client";

import { useEffect } from "react";

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
  const memberId = data?.id ?? null;

  // Organisations the user can switch to *within this portal*. Cross-portal
  // organisations are intentionally excluded — switching only ever stays on the
  // current portal, so the active-org header always matches X-Portal-Type.
  const organisations = (data?.organisations ?? []).filter(
    (org) => org?.portalType === PORTAL.key,
  );
  const canSwitchOrganisation = organisations.length > 1;

  // Keep the active-org cookie in sync with the session so the API client always
  // sends the correct X-Organisation-Id. Runs as an effect (a cookie write is a
  // side-effect) and only when the id actually changes.
  useEffect(() => {
    setActiveOrgId(orgId);
  }, [orgId]);

  return {
    user: data ?? null,
    activeOrganisation,
    organisations,
    canSwitchOrganisation,
    orgId,
    memberId,
    userRoles,
    canManageInvitations: userRoles.some((r) => MANAGE_ROLES.has(r)),
    isLoading,
    isError,
    error,
  };
}
