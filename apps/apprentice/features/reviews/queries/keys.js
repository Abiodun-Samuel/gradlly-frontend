export const REVIEW_QUERY_KEYS = {
  all: () => ["reviews"],
  list: (orgId, page, perPage) => ["reviews", "list", orgId, { page, perPage }],
};
