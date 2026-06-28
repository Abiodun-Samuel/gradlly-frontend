export const PROGRAMME_QUERY_KEYS = {
  all: () => ["programmes"],
  list: (orgId, page = 1, perPage = 20) => [
    "programmes",
    "list",
    orgId,
    { page, perPage },
  ],
  // All programmes for an org, used to populate selectors (single high-perPage page).
  options: (orgId) => ["programmes", "options", orgId],
  detail: (orgId, id) => ["programmes", "detail", orgId, id],
};
