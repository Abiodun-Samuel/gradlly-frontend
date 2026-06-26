"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { REPORTING_QUERY_KEYS } from "./keys";
import { getLearnerSummary } from "../services/reporting.service";

export function useLearnerSummary(options = {}) {
  const { orgId, isLoading: authLoading } = useAuthUser();
  const { enabled: enabledOption = true, ...rest } = options;

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.learnerSummary(orgId),
    queryFn: () => getLearnerSummary(orgId),
    enabled: !!orgId && !authLoading && enabledOption,
    ...rest,
  });
}
