export const ENROLMENT_QUERY_KEYS = {
  all: () => ["enrolments"],
  list: (orgId, page = 1, perPage = 20) => [
    "enrolments",
    "list",
    orgId,
    { page, perPage },
  ],
  detail: (orgId, id) => ["enrolments", "detail", orgId, id],
  participantOptions: (orgId, id) => [
    "enrolments",
    "participant-options",
    orgId,
    id,
  ],
  journey: (orgId, id) => ["enrolments", "journey", orgId, id],
};
