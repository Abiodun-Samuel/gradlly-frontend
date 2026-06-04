export const OTJ_PATHS = Object.freeze({
  BASE: "/api/v1/otj-log-entries",
  bulkApprove: () => "/api/v1/otj-log-entries/bulk-approve",
  bulkReject: () => "/api/v1/otj-log-entries/bulk-reject",
  detail: (id) => `/api/v1/otj-log-entries/${id}`,
});

export const OTJ_STATUSES = Object.freeze({
  DRAFT: "draft",
  SUBMITTED: "submitted",
  APPROVED: "approved",
  REJECTED: "rejected",
});
