export const COMMITMENT_QUERY_KEYS = {
  all: () => ["commitment-statements"],
  list: (orgId, params = {}) => [
    "commitment-statements",
    "list",
    orgId,
    params,
  ],
  // Statements for a single enrolment (the 1:1 group, all versions).
  byEnrolment: (orgId, enrolmentId) => [
    "commitment-statements",
    "by-enrolment",
    orgId,
    enrolmentId,
  ],
  detail: (orgId, id) => ["commitment-statements", "detail", orgId, id],
};
