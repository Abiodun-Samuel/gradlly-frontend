export const AT_RISK_QUERY_KEYS = Object.freeze({
  all: () => ["at-risk"],
  list: () => [...AT_RISK_QUERY_KEYS.all(), "list"],
  detail: (id) => [...AT_RISK_QUERY_KEYS.all(), "detail", id],
  interventions: (id) => [...AT_RISK_QUERY_KEYS.all(), id, "interventions"],
});
