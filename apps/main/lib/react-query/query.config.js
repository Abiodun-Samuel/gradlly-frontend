// lib/react-query/queryConfig.js

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

export const queryConfig = {
  queries: {
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
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
