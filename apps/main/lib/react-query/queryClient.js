import { QueryClient } from "@tanstack/react-query";

import { queryConfig } from "@/lib/react-query/query.config";

function makeQueryClient() {
  return new QueryClient({ defaultOptions: queryConfig });
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
