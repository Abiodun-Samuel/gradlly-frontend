"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { REPORTING_QUERY_KEYS } from "./keys";
import { getSmeOverview } from "../services/reporting.service";

export function useSmeOverview(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.smeOverview(orgId),
    queryFn: () => getSmeOverview(orgId),
    enabled: !!orgId,
    ...options,
  });
}
