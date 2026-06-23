export const STANDARD_QUERY_KEYS = {
  all: () => ["standards"],
  list: (orgId, page = 1, perPage = 20) => [
    "standards",
    "list",
    orgId,
    { page, perPage },
  ],
  // All standards for an org, used to populate selectors (single high-perPage page).
  options: (orgId) => ["standards", "options", orgId],
  detail: (orgId, id) => ["standards", "detail", orgId, id],
};
