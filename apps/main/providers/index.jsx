import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/react-query/queryClient";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { ToasterProvider } from "@/providers/ToastProvider";

export function AppProvider({ children }) {
  const queryClient = getQueryClient();
  return (
    <ReactQueryProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {children}
      </HydrationBoundary>
      <ToasterProvider />
    </ReactQueryProvider>
  );
}
