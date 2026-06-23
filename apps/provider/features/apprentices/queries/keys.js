export const APPRENTICE_QUERY_KEYS = {
  all: () => ["apprentices"],
  list: (orgId, page = 1, perPage = 20) => [
    "apprentices",
    "list",
    orgId,
    { page, perPage },
  ],
  // All apprentices for an org, used to populate selectors (single high-perPage page).
  options: (orgId) => ["apprentices", "options", orgId],
  detail: (orgId, id) => ["apprentices", "detail", orgId, id],
};
