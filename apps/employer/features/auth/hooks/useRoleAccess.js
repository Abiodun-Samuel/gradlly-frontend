"use client";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { ROLES, hasMinRole } from "@/lib/rbac";

/**
 * Hook exposing the current user's organisation-role permissions.
 *
 * Returns hierarchy-aware booleans plus a `can(minRole)` predicate so any
 * component can gate UI or behaviour by role without re-deriving the logic.
 *
 * Usage:
 *   const { isOwner, can } = useRoleAccess();
 *   if (can("admin")) { ... }   // owner OR admin
 */
export function useRoleAccess() {
  const { userRoles } = useAuthUser();
  const roles = userRoles ?? [];

  return {
    roles,
    isOwner: hasMinRole(roles, ROLES.OWNER),
    isAdmin: hasMinRole(roles, ROLES.ADMIN), // owners satisfy this too
    isMember: hasMinRole(roles, ROLES.MEMBER), // anyone with a role
    can: (minRole) => hasMinRole(roles, minRole),
  };
}
