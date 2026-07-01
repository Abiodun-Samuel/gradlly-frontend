"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { REPORTING_QUERY_KEYS } from "./keys";
import { getKsbHeatmap } from "../services/portfolio.service";

export function useKsbHeatmap(enrolmentId, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.ksbHeatmap(orgId, enrolmentId),
    queryFn: () => getKsbHeatmap(enrolmentId),
    enabled: !!orgId && !!enrolmentId,
    ...options,
  });
}
