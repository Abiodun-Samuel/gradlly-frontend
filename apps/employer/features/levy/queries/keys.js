export const LEVY_QUERY_KEYS = {
  all: () => ["levy"],
  surplus: (orgId) => ["levy", "surplus", orgId],
  expiryCalendar: (orgId) => ["levy", "expiry-calendar", orgId],
  donorLinks: (orgId) => ["levy", "donor-links", orgId],
  transferPreferences: (orgId) => ["levy", "transfer-preferences", orgId],
  matchApplications: (orgId) => ["levy", "match-applications", orgId],
};
