"use client";

import { useEffect } from "react";

import { PORTAL } from "@/config/portal.config";
import { useMe } from "@/features/auth/queries/auth.query";
import { setActiveOrgId } from "@/lib/api/active-org";

const MANAGE_ROLES = new Set(["owner", "admin"]);

export function useAuthUser() {
  const { data, isLoading, isError, error } = useMe();

  const activeOrganisation = data?.activeOrganisation ?? null;
  const userRoles = activeOrganisation?.roles ?? [];
  const orgId = activeOrganisation?.organisation?.id ?? null;
  const memberId = data?.id ?? null;

  const organisations = (data?.organisations ?? []).filter(
    (org) => org?.portalType === PORTAL.key,
  );
  const canSwitchOrganisation = organisations.length > 1;

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
