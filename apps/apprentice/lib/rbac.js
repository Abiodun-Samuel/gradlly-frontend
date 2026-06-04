/**
 * Role-based access control helpers.
 *
 * Organisation roles are hierarchical:
 *   owner (3) ≥ admin (2) ≥ member (1)
 *
 * A user holds an array of roles. Access is decided by the user's HIGHEST role,
 * so an owner implicitly satisfies any admin/member check, an admin satisfies any
 * member check, and so on.
 *
 * These functions are pure (no React) so they can be used anywhere — services,
 * route guards, hooks, or components.
 */

export const ROLES = Object.freeze({
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
});

const RANK = Object.freeze({
  member: 1,
  admin: 2,
  owner: 3,
});

export function roleRank(role) {
  return RANK[role] ?? 0;
}

/** Highest rank among the user's roles (0 when they have none). */
export function maxRoleRank(userRoles = []) {
  if (!Array.isArray(userRoles)) return 0;
  return userRoles.reduce((max, role) => Math.max(max, roleRank(role)), 0);
}

/**
 * Hierarchy-aware: true when the user meets AT LEAST the required role.
 *   hasMinRole(["owner"], "admin") === true
 *   hasMinRole(["member"], "admin") === false
 */
export function hasMinRole(userRoles, requiredRole) {
  return maxRoleRank(userRoles) >= roleRank(requiredRole);
}

/**
 * True when the user meets at least the LOWEST of the allowed roles
 * (hierarchy-aware). Useful for "owner or admin" style checks.
 *   hasAnyRole(["admin"], ["admin", "owner"]) === true
 *   hasAnyRole(["member"], ["admin", "owner"]) === false
 */
export function hasAnyRole(userRoles = [], allowed = []) {
  if (!allowed.length) return true;
  const lowest = Math.min(...allowed.map(roleRank));
  return maxRoleRank(userRoles) >= lowest;
}

/** Exact membership check (rarely needed; prefer the hierarchy helpers). */
export function hasExactRole(userRoles = [], role) {
  return Array.isArray(userRoles) && userRoles.includes(role);
}
