export const OTJ_QUERY_KEYS = {
  all: () => ["otj"],
  logs: () => [...OTJ_QUERY_KEYS.all(), "logs"],
  learnerDocuments: () => [...OTJ_QUERY_KEYS.all(), "learner-documents"],
};
