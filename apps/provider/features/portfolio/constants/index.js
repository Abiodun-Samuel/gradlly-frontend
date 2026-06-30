// ─── Paths (four controllers under the portfolio/KSB domain) ─────────────────
export const PORTFOLIO_PATHS = Object.freeze({
  // KSB definitions — asymmetric: create/list nested under standard, mutate flat.
  ksbDefinitionsForStandard: (standardId) =>
    `/api/v1/standards/${standardId}/ksb-definitions`,
  ksbDefinitionById: (id) => `/api/v1/ksb-definitions/${id}`,

  // Heatmap + coverage.
  ksbHeatmap: "/api/v1/portfolio/ksb-heatmap",
  ksbCoverage: (enrolmentId, ksbDefinitionId) =>
    `/api/v1/portfolio/enrolments/${enrolmentId}/ksb-coverage/${ksbDefinitionId}`,

  // Evidence items.
  evidenceItems: "/api/v1/ksb-evidence-items",
  evidenceItemById: (id) => `/api/v1/ksb-evidence-items/${id}`,
  evidenceReview: (id) => `/api/v1/ksb-evidence-items/${id}/review`,
  evidenceAccept: (id) => `/api/v1/ksb-evidence-items/${id}/accept`,
  evidenceReturn: (id) => `/api/v1/ksb-evidence-items/${id}/return`,

  // EPA pack jobs.
  epaPackJobs: "/api/v1/portfolio/epa-pack-jobs",
  epaPackJobById: (id) => `/api/v1/portfolio/epa-pack-jobs/${id}`,
});

// ─── KSB kind ────────────────────────────────────────────────────────────────
export const KSB_KIND = Object.freeze({
  KNOWLEDGE: "knowledge",
  SKILL: "skill",
  BEHAVIOUR: "behaviour",
});

export const KSB_KIND_LABELS = Object.freeze({
  knowledge: "Knowledge",
  skill: "Skill",
  behaviour: "Behaviour",
});

export const KSB_KIND_SHORT = Object.freeze({
  knowledge: "K",
  skill: "S",
  behaviour: "B",
});

export const KSB_KIND_OPTIONS = [
  { value: KSB_KIND.KNOWLEDGE, text: "Knowledge" },
  { value: KSB_KIND.SKILL, text: "Skill" },
  { value: KSB_KIND.BEHAVIOUR, text: "Behaviour" },
];

export const KSB_KIND_VALUES = Object.values(KSB_KIND);

// ─── Heatmap strength (derived) ──────────────────────────────────────────────
export const KSB_STRENGTH = Object.freeze({
  NONE: "none",
  LOW: "low",
  ADEQUATE: "adequate",
});

export const KSB_STRENGTH_LABELS = Object.freeze({
  none: "No evidence",
  low: "Low",
  adequate: "Adequate",
});

// ─── Coverage assessment (tutor manual) ──────────────────────────────────────
export const COVERAGE_ASSESSMENT = Object.freeze({
  SUFFICIENT: "sufficient",
  NEEDS_MORE: "needs_more",
});

export const COVERAGE_ASSESSMENT_LABELS = Object.freeze({
  sufficient: "Sufficient",
  needs_more: "Needs more",
});

// ─── Evidence type ───────────────────────────────────────────────────────────
export const EVIDENCE_TYPE = Object.freeze({
  FILE: "file",
  LINK: "link",
  TEXT: "text",
});

export const EVIDENCE_TYPE_LABELS = Object.freeze({
  file: "File",
  link: "Link",
  text: "Text",
});

// ─── Evidence status ─────────────────────────────────────────────────────────
export const EVIDENCE_STATUS = Object.freeze({
  DRAFT: "draft",
  SUBMITTED: "submitted",
  REVIEWED: "reviewed",
  ACCEPTED: "accepted",
});

export const EVIDENCE_STATUS_LABELS = Object.freeze({
  draft: "Draft",
  submitted: "Submitted",
  reviewed: "Reviewed",
  accepted: "Accepted",
});

export const EVIDENCE_STATUS_FILTER_OPTIONS = [
  { value: "", text: "All statuses" },
  { value: EVIDENCE_STATUS.SUBMITTED, text: "Submitted" },
  { value: EVIDENCE_STATUS.REVIEWED, text: "Reviewed" },
  { value: EVIDENCE_STATUS.ACCEPTED, text: "Accepted" },
  { value: EVIDENCE_STATUS.DRAFT, text: "Draft" },
];

// ─── EPA pack job status ─────────────────────────────────────────────────────
export const EPA_PACK_STATUS = Object.freeze({
  QUEUED: "queued",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
});

export const EPA_PACK_TERMINAL = new Set([
  EPA_PACK_STATUS.COMPLETED,
  EPA_PACK_STATUS.FAILED,
]);

// ─── Evidence review-action gating (mirror the backend transitions) ──────────
export function getEvidenceActions(item) {
  const status = item?.status ?? null;
  return {
    review: status === EVIDENCE_STATUS.SUBMITTED,
    accept: status === EVIDENCE_STATUS.REVIEWED,
    return:
      status === EVIDENCE_STATUS.SUBMITTED ||
      status === EVIDENCE_STATUS.REVIEWED,
  };
}
