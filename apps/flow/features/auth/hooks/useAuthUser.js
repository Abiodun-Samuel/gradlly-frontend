"use client";

import { useMe } from "@/features/auth/queries/auth.query";

const MANAGE_ROLES = new Set(["owner", "admin"]);

export function useAuthUser() {
  const { data, isLoading, isError, error } = useMe();
  const activeOrganisation = data?.activeOrganisation ?? null;
  const userRoles = activeOrganisation?.roles ?? [];
  const orgId = activeOrganisation?.organisation?.id ?? null;

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
