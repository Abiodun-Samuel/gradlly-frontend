"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { REPORTING_QUERY_KEYS } from "./keys";
import { getEifScores } from "../services/ofsted.service";

export function useEifScores(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.eifScores(orgId),
    queryFn: () => getEifScores(),
    enabled: !!orgId,
    ...options,
  });
}
