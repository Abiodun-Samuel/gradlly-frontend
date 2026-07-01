"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { REPORTING_QUERY_KEYS } from "./keys";
import { listEvidenceItems } from "../services/evidence.service";

export function useEvidenceItems({ page = 1, perPage = 20, ...options } = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.evidenceItems(orgId, page, perPage),
    queryFn: () => listEvidenceItems({ page, perPage }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      items: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}
