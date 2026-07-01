export const ENROLMENT_QUERY_KEYS = {
  all: () => ["enrolments"],
  list: (orgId, params = {}) => ["enrolments", "list", orgId, params],
  detail: (orgId, id) => ["enrolments", "detail", orgId, id],
  journey: (orgId, id) => ["enrolments", "journey", orgId, id],
  apprentices: (orgId) => ["enrolments", "apprentices", orgId],
};
