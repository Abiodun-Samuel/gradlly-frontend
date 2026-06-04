"use client";

import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";

/**
 * RoleGate
 *
 * Declaratively render children only when the current user meets a minimum
 * organisation role (hierarchy-aware: owner ≥ admin ≥ member).
 *
 * @param {object}          props
 * @param {"owner"|"admin"|"member"} [props.role="member"]  minimum role required
 * @param {React.ReactNode} [props.fallback=null]           rendered when not permitted
 * @param {React.ReactNode} props.children
 *
 * Usage:
 *   <RoleGate role="owner">
 *     <DangerZone />
 *   </RoleGate>
 *
 *   <RoleGate role="admin" fallback={<NoAccess />}>
 *     <InviteButton />
 *   </RoleGate>
 */
export function RoleGate({ role = "member", fallback = null, children }) {
  const { can } = useRoleAccess();
  return can(role) ? <>{children}</> : <>{fallback}</>;
}
