export const STANDARD_QUERY_KEYS = {
  all: () => ["standards"],
  list: (orgId) => ["standards", "list", orgId],
  detail: (orgId, id) => ["standards", "detail", orgId, id],
};

export const PROGRAMME_QUERY_KEYS = {
  all: () => ["programmes"],
  list: (orgId) => ["programmes", "list", orgId],
  detail: (orgId, id) => ["programmes", "detail", orgId, id],
};
