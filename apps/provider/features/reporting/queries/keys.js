export const REPORTING_QUERY_KEYS = {
  all: () => ["reporting"],
  providerDashboard: (orgId) => ["reporting", "provider-dashboard", orgId],
  cohort: (orgId, page = 1, perPage = 20) => [
    "reporting",
    "cohort",
    orgId,
    { page, perPage },
  ],
  interventionQueue: (orgId, page = 1, perPage = 20) => [
    "reporting",
    "intervention-queue",
    orgId,
    { page, perPage },
  ],
  ksbHeatmap: (orgId, enrolmentId) => [
    "reporting",
    "ksb-heatmap",
    orgId,
    enrolmentId,
  ],
  evidenceItems: (orgId, page = 1, perPage = 20) => [
    "reporting",
    "evidence-items",
    orgId,
    { page, perPage },
  ],
  commitments: (orgId, page = 1, perPage = 20) => [
    "reporting",
    "commitments",
    orgId,
    { page, perPage },
  ],
  eifScores: (orgId) => ["reporting", "eif-scores", orgId],
  ilrRecords: (orgId, page = 1, perPage = 20) => [
    "reporting",
    "ilr-records",
    orgId,
    { page, perPage },
  ],
  reviews: (orgId, page = 1, perPage = 20) => [
    "reporting",
    "reviews",
    orgId,
    { page, perPage },
  ],
  employerDirectory: (orgId, page = 1, perPage = 20) => [
    "reporting",
    "employer-directory",
    orgId,
    { page, perPage },
  ],
};
