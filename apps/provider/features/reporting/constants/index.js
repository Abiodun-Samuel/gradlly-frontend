export const REPORTING_PATHS = Object.freeze({
  providerDashboard: "/api/v1/reporting/provider-dashboard",
  employerDirectory: "/api/v1/reporting/employer-directory",
});

// EIF RAG (dashboard) — mirrors the ofsted feature; null when uncomputed.
export const EIF_RAG = Object.freeze({
  RED: "red",
  AMBER: "amber",
  GREEN: "green",
});

// ─── Commitment pipeline status (employer directory) ─────────────────────────
export const COMMITMENT_PIPELINE = Object.freeze({
  NONE: "none",
  DRAFT: "draft",
  AWAITING_SIGNATURES: "awaiting_signatures",
  SIGNED: "signed",
  CANCELLED: "cancelled",
});

export const COMMITMENT_PIPELINE_LABELS = Object.freeze({
  none: "None",
  draft: "Draft",
  awaiting_signatures: "Awaiting signatures",
  signed: "Signed",
  cancelled: "Cancelled",
});

// KPI tiles → deep links into the owning features.
export const KPI_LINKS = Object.freeze({
  cohort: "/learners",
  atRisk: "/learners",
  eif: "/ofsted-hub",
  ilrPending: "/ilr",
});
