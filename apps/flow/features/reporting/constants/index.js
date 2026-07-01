export const REPORTING_PATHS = Object.freeze({
  SME_OVERVIEW: "/api/v1/reporting/sme-overview",
});

// FundingClaimStatus
export const FUNDING_CLAIM_STATUS = Object.freeze({
  SYNCED: "synced",
  NO_PAYMENTS: "no_payments",
  CLAWBACK_PENDING: "clawback_pending",
});

export const FUNDING_CLAIM_META = Object.freeze({
  synced: { label: "Funding synced", color: "green" },
  no_payments: { label: "No payments yet", color: "gray" },
  clawback_pending: { label: "Clawback pending", color: "red" },
});

// KPI tiles → deep links into the manage actions (shared, portal-scoped).
export const SME_KPI_LINKS = Object.freeze({
  apprentices: "/learners",
  approvals: "/approvals",
  reviews: "/reviews",
  funding: "/funding",
});

export const COMMITMENT_PIPELINE_LABELS = Object.freeze({
  none: "None",
  draft: "Draft",
  awaitingSignatures: "Awaiting signatures",
  signed: "Signed",
  cancelled: "Cancelled",
});
