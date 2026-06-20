export const PORTFOLIO_QUERY_KEYS = {
  all: () => ["portfolio"],
  evidence: () => [...PORTFOLIO_QUERY_KEYS.all(), "evidence"],
  learnerDocument: () => [...PORTFOLIO_QUERY_KEYS.all(), "learner-document"],
};
