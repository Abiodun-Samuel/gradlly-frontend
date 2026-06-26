export const OTJ_QUERY_KEYS = {
  all: () => ["otj"],
  list: (orgId, filters) => ["otj", "list", orgId, filters],
  categories: (orgId) => ["otj", "categories", orgId],
  logs: () => ["otj", "logs"],
  learnerDocuments: (orgId) => ["otj", "learner-documents", orgId],
};
