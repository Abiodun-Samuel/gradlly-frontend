import { QueryCache, QueryClient } from "@tanstack/react-query";

import { queryConfig } from "@/lib/react-query/query.config";

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (
          error?.status === 401 &&
          typeof window !== "undefined" &&
          !query.meta?.skipAuthRedirect
        ) {
          window.location.replace("/login");
        }
      },
    }),
    defaultOptions: queryConfig,
  });
}

let browserQueryClient;

export function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
