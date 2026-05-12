/**
 * Hierarchical React Query keys for the auth feature.
 * Centralizing keys prevents typos and makes cache management explicit.
 */

export const AUTH_QUERY_KEYS = Object.freeze({
  all: () => ["auth"],
  me: () => [...AUTH_QUERY_KEYS.all(), "me"],
});
