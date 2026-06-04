export const INVITATION_PATHS = Object.freeze({
  BASE: "/api/v1/invitations",
  ACCEPT: "/api/v1/invitations/accept",
  resend: (id) => `/api/v1/invitations/${id}/resend`,
  revoke: (id) => `/api/v1/invitations/${id}`,
});

// Backend-recognised roles.
export const INVITATION_ROLES = Object.freeze({
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
});

// UI-only pseudo role. Selecting "apprentice" sends role="member" to the
// backend, but routes the invitation through the apprentice portal via the
// X-Portal-Type override header. It is never a real backend role value.
export const APPRENTICE_ROLE = "apprentice";
export const APPRENTICE_PORTAL_TYPE = "apprentice";

export const INVITATION_ROLE_LABELS = Object.freeze({
  owner: "Owner",
  admin: "Admin",
  member: "Member",
  apprentice: "Apprentice",
});

// All selectable role options (UI level), in display order.
export const INVITE_ROLE_OPTIONS = [
  { value: INVITATION_ROLES.MEMBER, text: "Member" },
  { value: APPRENTICE_ROLE, text: "Apprentice" },
  { value: INVITATION_ROLES.ADMIN, text: "Admin" },
  // { value: INVITATION_ROLES.OWNER, text: "Owner" },
];

/**
 * Returns the role options a given set of org roles is allowed to assign.
 *   owner -> member, apprentice, admin, owner
 *   admin -> member, apprentice
 */
export function getAssignableRoleOptions(userRoles = []) {
  if (userRoles.includes(INVITATION_ROLES.OWNER)) return INVITE_ROLE_OPTIONS;
  if (userRoles.includes(INVITATION_ROLES.ADMIN)) {
    return INVITE_ROLE_OPTIONS.filter(
      (o) => o.value === INVITATION_ROLES.MEMBER || o.value === APPRENTICE_ROLE,
    );
  }
  return [];
}
