export const COMMITMENT_QUERY_KEYS = {
  all: () => ["commitments"],
  list: (orgId, filters) => ["commitments", "list", orgId, filters ?? {}],
  detail: (orgId, id) => ["commitments", "detail", orgId, id],
};
