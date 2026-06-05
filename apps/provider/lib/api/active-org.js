// ============================================================
// Active-organisation holder
// ============================================================
//
// The API client is a plain module and cannot read React Query state, yet every
// authenticated request should carry the caller's active organisation as the
// `X-Organisation-Id` header — analogous to how `X-Portal-Type` is always sent.
//
// We keep the active org id in a tiny module-level holder that is kept in sync
// with the `me` query (see useAuthUser). The client reads it on each request and
// attaches the header automatically, while still letting an explicit per-call
// header override it (e.g. invitations acting on a specific org).

let activeOrgId = null;

export function setActiveOrgId(orgId) {
  activeOrgId = orgId ?? null;
}

export function getActiveOrgId() {
  return activeOrgId;
}
