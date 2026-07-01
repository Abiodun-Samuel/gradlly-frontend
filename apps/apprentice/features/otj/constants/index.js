export const OTJ_PATHS = Object.freeze({
  BASE: "/api/v1/otj-log-entries",
  CATEGORIES: "/api/v1/otj-log-entries/categories",
  LEARNER_DOCUMENTS: "/api/v1/learners/me/documents",
  byId: (id) => `/api/v1/otj-log-entries/${id}`,
});

export const OTJ_STATUS = Object.freeze({
  DRAFT: "draft",
  SUBMITTED: "submitted",
  APPROVED: "approved",
  REJECTED: "rejected",
});

export const OTJ_STATUS_LABELS = Object.freeze({
  draft: "Draft",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
});
