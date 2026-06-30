export const COMMITMENT_PATHS = Object.freeze({
  BASE: "/api/v1/commitment-statements",
  byId: (id) => `/api/v1/commitment-statements/${id}`,
  versions: (groupId) => `/api/v1/commitment-statements/${groupId}/versions`,
  publish: (id) => `/api/v1/commitment-statements/${id}/publish`,
  cancel: (id) => `/api/v1/commitment-statements/${id}/cancel`,
  sign: (id) => `/api/v1/commitment-statements/${id}/sign`,
});

// ─── Status (`CommitmentStatementStatus`) ────────────────────────────────────
export const COMMITMENT_STATUS = Object.freeze({
  DRAFT: "draft",
  SUBMITTED: "submitted",
  AWAITING_SIGNATURES: "awaiting_signatures",
  SIGNED: "signed",
  SUPERSEDED: "superseded",
  CANCELLED: "cancelled",
});

export const COMMITMENT_STATUS_LABELS = Object.freeze({
  draft: "Draft",
  submitted: "Submitted",
  awaiting_signatures: "Awaiting signatures",
  signed: "Signed",
  superseded: "Superseded",
  cancelled: "Cancelled",
});

export const COMMITMENT_STATUS_OPTIONS = [
  { value: COMMITMENT_STATUS.DRAFT, text: "Draft" },
  { value: COMMITMENT_STATUS.SUBMITTED, text: "Submitted" },
  { value: COMMITMENT_STATUS.AWAITING_SIGNATURES, text: "Awaiting signatures" },
  { value: COMMITMENT_STATUS.SIGNED, text: "Signed" },
  { value: COMMITMENT_STATUS.SUPERSEDED, text: "Superseded" },
  { value: COMMITMENT_STATUS.CANCELLED, text: "Cancelled" },
];

// ─── Tripartite party (`TripartiteParty`) — sign in this order ───────────────
export const PARTY = Object.freeze({
  APPRENTICE: "apprentice",
  TUTOR: "tutor",
  EMPLOYER_MANAGER: "employer_manager",
});

export const PARTY_LABELS = Object.freeze({
  apprentice: "Apprentice",
  tutor: "Tutor",
  employer_manager: "Employer manager",
});

// Strict signing order.
export const PARTY_ORDER = [
  PARTY.APPRENTICE,
  PARTY.TUTOR,
  PARTY.EMPLOYER_MANAGER,
];

// ─── Lifecycle action keys (for the actions UI) ──────────────────────────────
export const COMMITMENT_ACTION = Object.freeze({
  PUBLISH: "publish",
  CANCEL: "cancel",
  NEW_VERSION: "new-version",
});

// ─── Transition guards (mirror the backend state machine) ────────────────────
//
// The backend is the source of truth; gating here only avoids predictable 400s
// and guides the user.

const CANCELLABLE = new Set([
  COMMITMENT_STATUS.DRAFT,
  COMMITMENT_STATUS.SUBMITTED,
  COMMITMENT_STATUS.AWAITING_SIGNATURES,
]);

const NEW_VERSION_FROM = new Set([
  COMMITMENT_STATUS.SIGNED,
  COMMITMENT_STATUS.CANCELLED,
]);

/**
 * Actions available for a statement given its status. The "sign" gating is
 * separate (it depends on nextParty + the signed-in user), handled in the UI.
 */
export function getCommitmentActions(statement) {
  const status = statement?.status ?? null;
  return {
    edit: status === COMMITMENT_STATUS.DRAFT,
    publish: status === COMMITMENT_STATUS.DRAFT,
    cancel: CANCELLABLE.has(status),
    newVersion: NEW_VERSION_FROM.has(status),
    downloadSigned:
      status === COMMITMENT_STATUS.SIGNED && !!statement?.finalSignedPdfKey,
  };
}

// True between submitted and awaiting_signatures: the snapshot PDF is still
// generating, so signing is not yet possible.
export function isAwaitingPdf(statement) {
  return statement?.status === COMMITMENT_STATUS.SUBMITTED;
}
