/**
 * Portal access — minimal, pure helpers.
 *
 * The platform has four portals; each user's `roles: string[]` lists the
 * portal ids they may enter. There is no fancy routing across portals; each
 * portal is a standalone app that asks "does this user have my role?"
 *
 *   - userHasAccessToPortal(user, portalId) — boolean
 *   - getAccessiblePortals(user)             — array of portal ids
 *
 * That's the whole API.
 */

import { ALL_PORTAL_IDS } from "@/config/portals.config";

function getRoles(user) {
  return Array.isArray(user?.roles) ? user.roles : [];
}

export function userHasAccessToPortal(user, portalId) {
  return getRoles(user).includes(portalId);
}

export function getAccessiblePortals(user) {
  const roles = new Set(getRoles(user));
  return ALL_PORTAL_IDS.filter((id) => roles.has(id));
}
