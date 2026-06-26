export const PORTFOLIO_PATHS = Object.freeze({
  EVIDENCE: "/api/v1/ksb-evidence-items",
  evidenceById: (id) => `/api/v1/ksb-evidence-items/${id}`,
  KSB_HEATMAP: "/api/v1/portfolio/ksb-heatmap",
  LEARNER_DOCUMENT: "/api/v1/learners/me/documents",
});

export const EVIDENCE_STATUS_LABELS = Object.freeze({
  draft: "Draft",
  submitted: "Submitted",
  in_review: "In review",
  accepted: "Accepted",
  returned: "Returned",
});

export const HEATMAP_STRENGTH_LABELS = Object.freeze({
  none: "None",
  weak: "Weak",
  adequate: "Adequate",
  strong: "Strong",
});
