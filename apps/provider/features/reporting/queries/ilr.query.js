"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { REPORTING_QUERY_KEYS } from "./keys";
import { listIlrLearnerRecords } from "../services/ilr.service";

export function useIlrLearnerRecords({
  page = 1,
  perPage = 20,
  ...options
} = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.ilrRecords(orgId, page, perPage),
    queryFn: () => listIlrLearnerRecords({ page, perPage }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      records: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}
