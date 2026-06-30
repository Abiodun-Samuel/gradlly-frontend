export const OTJ_QUERY_KEYS = {
  all: () => ["otj-log-entries"],
  list: (orgId, params = {}) => ["otj-log-entries", "list", orgId, params],
  detail: (orgId, id) => ["otj-log-entries", "detail", orgId, id],
  categories: (orgId) => ["otj-log-entries", "categories", orgId],
};
