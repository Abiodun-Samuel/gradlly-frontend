export const ENROLMENT_QUERY_KEYS = {
  all: () => ["enrolments"],
  list: (orgId) => ["enrolments", "list", orgId],
  detail: (orgId, id) => ["enrolments", "detail", orgId, id],
  journey: (orgId, id) => ["enrolments", "journey", orgId, id],
};
