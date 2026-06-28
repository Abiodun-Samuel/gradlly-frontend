export const APPRENTICE_QUERY_KEYS = {
  all: () => ["apprentices"],
  list: (orgId) => ["apprentices", "list", orgId],
  detail: (orgId, id) => ["apprentices", "detail", orgId, id],
};
