export const REPORTING_QUERY_KEYS = {
  all: () => ["reporting"],
  learnerSummary: (orgId) => ["reporting", "learner-summary", orgId],
};
