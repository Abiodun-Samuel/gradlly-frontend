export const PORTFOLIO_QUERY_KEYS = {
  all: () => ["portfolio"],

  ksbDefinitions: (orgId, standardId) => [
    "portfolio",
    "ksb-definitions",
    orgId,
    standardId,
  ],

  heatmap: (orgId, enrolmentId) => ["portfolio", "heatmap", orgId, enrolmentId],

  evidenceList: (orgId, params = {}) => [
    "portfolio",
    "evidence",
    "list",
    orgId,
    params,
  ],
  evidenceDetail: (orgId, id) => ["portfolio", "evidence", "detail", orgId, id],

  epaPackJob: (orgId, id) => ["portfolio", "epa-pack-job", orgId, id],
};
