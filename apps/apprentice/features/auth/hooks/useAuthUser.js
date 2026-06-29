"use client";

import { useLayoutEffect } from "react";

import { PORTAL } from "@/config/portal.config";
import { useMe } from "@/features/auth/queries/auth.query";
import { setActiveOrgId } from "@/lib/api/active-org";

const MANAGE_ROLES = new Set(["owner", "admin"]);

export function useAuthUser() {
  const { data, isLoading, isError, error } = useMe();

  const activeOrganisation = data?.activeOrganisation ?? null;
  const userRoles = activeOrganisation?.roles ?? [];
  const memberId = data?.id ?? null;

  // Apprentices are members of their training provider's organisation (portalType
  // "provider"), not a separate apprentice org type.
  const allOrganisations = data?.organisations ?? [];
  const organisations =
    PORTAL.key === "apprentice"
      ? allOrganisations.filter((org) => org?.portalType === "provider")
      : allOrganisations.filter((org) => org?.portalType === PORTAL.key);

  const providerOrgId = organisations[0]?.id ?? null;
  const activeOrgId = activeOrganisation?.organisation?.id ?? null;
  const activeIsProvider =
    activeOrganisation?.organisation?.portalType === "provider";

  const orgId =
    PORTAL.key === "apprentice"
      ? (providerOrgId ?? (activeIsProvider ? activeOrgId : null))
      : (activeOrgId ?? organisations[0]?.id ?? null);

  const canSwitchOrganisation = organisations.length > 1;

  // Write the cookie when we know the org; never clear it here — logout handles
  // that. Clearing on a transient null (e.g. /me refetch after accept-invite)
  // would strip X-Organisation-Id from uploads mid-session.
  useLayoutEffect(() => {
    if (orgId) setActiveOrgId(orgId);
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
