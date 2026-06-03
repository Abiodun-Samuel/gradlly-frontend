import { QueryCache, QueryClient } from "@tanstack/react-query";

import { queryConfig } from "@/lib/react-query/query.config";

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        // getMe already handles its own 401 by returning null.
        // Any other query receiving 401 means the session died mid-use.
        if (error?.status === 401 && typeof window !== "undefined") {
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
