export const LEVY_EXCHANGE_QUERY_KEYS = {
  all: () => ["levy-exchange"],
  donorLinks: (orgId) => ["levy-exchange", "donor-links", orgId],
  surplus: (orgId) => ["levy-exchange", "surplus", orgId],
  matches: (orgId) => ["levy-exchange", "matches", orgId],
  matchApplications: (orgId, page, perPage) => [
    "levy-exchange",
    "match-applications",
    orgId,
    { page, perPage },
  ],
  transferPreferences: (orgId) => [
    "levy-exchange",
    "transfer-preferences",
    orgId,
  ],
};
