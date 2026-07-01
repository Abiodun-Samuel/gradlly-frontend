export const PORTFOLIO_QUERY_KEYS = {
  all: () => ["portfolio"],
  evidence: (orgId, page, perPage) => [
    "portfolio",
    "evidence",
    orgId,
    { page, perPage },
  ],
  heatmap: (orgId, enrolmentId) => ["portfolio", "heatmap", orgId, enrolmentId],
  learnerDocument: (orgId) => ["portfolio", "learner-document", orgId],
};
