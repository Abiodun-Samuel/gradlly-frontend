export const AI_PROGRAMME_QUERY_KEYS = Object.freeze({
  all: () => ["ai-programmes"],
  catalogue: (orgId) => ["ai-programmes", "catalogue", orgId],
  programme: (orgId, programmeId) => [
    "ai-programmes",
    "catalogue",
    orgId,
    programmeId,
  ],
  progress: (orgId, enrolmentId) => [
    "ai-programmes",
    "progress",
    orgId,
    enrolmentId,
  ],
});
