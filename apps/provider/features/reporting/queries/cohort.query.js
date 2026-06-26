"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { REPORTING_QUERY_KEYS } from "./keys";
import { listCohort, listInterventionQueue } from "../services/cohort.service";

export function useCohort({ page = 1, perPage = 20, ...options } = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.cohort(orgId, page, perPage),
    queryFn: () => listCohort({ page, perPage }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      rows: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useInterventionQueue({
  page = 1,
  perPage = 20,
  ...options
} = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.interventionQueue(orgId, page, perPage),
    queryFn: () => listInterventionQueue({ page, perPage }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      items: response?.data?.items ?? response?.data ?? [],
      atRiskCount: response?.data?.atRiskCount ?? null,
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}
