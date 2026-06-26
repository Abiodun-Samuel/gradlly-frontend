"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { ENROLMENT_QUERY_KEYS } from "./keys";
import {
  listApprentices,
  listEnrolments,
} from "../services/enrolments.service";

export function useEnrolments({ page = 1, perPage = 20, ...options } = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ENROLMENT_QUERY_KEYS.list(orgId, page, perPage),
    queryFn: () => listEnrolments({ page, perPage }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      enrolments: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useApprentices(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ENROLMENT_QUERY_KEYS.apprentices(orgId),
    queryFn: () => listApprentices({ perPage: 100 }),
    enabled: !!orgId,
    select: (response) => response?.data ?? [],
    ...options,
  });
}
