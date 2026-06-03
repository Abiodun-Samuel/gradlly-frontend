// lib/react-query/query.config.js

function shouldRetry(failureCount, error) {
  const MAX_RETRIES = 3;
  if (failureCount >= MAX_RETRIES) return false;

  const status = error?.status ?? error?.response?.status;

  if (typeof status === "number" && status >= 400 && status < 500) {
    return false;
  }

  return true;
}

function retryDelay(attemptIndex) {
  return Math.min(1000 * 2 ** attemptIndex, 30000);
}

export const STALE_TIMES = {
  USER_SESSION: 30 * 1000,
  DEFAULT: 60 * 1000,
};

export const queryConfig = {
  queries: {
    staleTime: STALE_TIMES.DEFAULT,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: shouldRetry,
    retryDelay,
  },
  mutations: {
    retry: (failureCount, error) =>
      failureCount < 1 && shouldRetry(failureCount, error),
    retryDelay,
  },
};
