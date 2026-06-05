"use client";

import { useMe } from "@/features/auth/queries/auth.query";
import { setActiveOrgId } from "@/lib/api/active-org";

const MANAGE_ROLES = new Set(["owner", "admin"]);

export function useAuthUser() {
  const { data, isLoading, isError, error } = useMe();
  const activeOrganisation = data?.activeOrganisation ?? null;
  const userRoles = activeOrganisation?.roles ?? [];
  const orgId = activeOrganisation?.organisation?.id ?? null;

  // Keep the API client's active-org header in sync with the session. Cheap and
  // idempotent, so safe to call on every render.
  setActiveOrgId(orgId);

  return {
    user: data ?? null,
    activeOrganisation,
    orgId,
    userRoles,
    canManageInvitations: userRoles.some((r) => MANAGE_ROLES.has(r)),
    isLoading,
    isError,
    error,
  };
}
