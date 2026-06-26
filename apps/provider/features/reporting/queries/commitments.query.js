"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { REPORTING_QUERY_KEYS } from "./keys";
import { listCommitmentStatements } from "../services/commitments.service";

export function useCommitmentStatements({
  page = 1,
  perPage = 20,
  ...options
} = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.commitments(orgId, page, perPage),
    queryFn: () => listCommitmentStatements({ page, perPage }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      statements: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}
