"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { LEVY_EXCHANGE_QUERY_KEYS } from "./keys";
import {
  checkLevyEligibility,
  getTransferPreferences,
  listDonorLinks,
  listLevySurplus,
  listMatchApplications,
  searchLevyMatches,
} from "../services/levy-exchange.service";

export function useDonorLinks(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_EXCHANGE_QUERY_KEYS.donorLinks(orgId),
    queryFn: listDonorLinks,
    enabled: !!orgId,
    ...options,
  });
}

export function useLevySurplus(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_EXCHANGE_QUERY_KEYS.surplus(orgId),
    queryFn: listLevySurplus,
    enabled: !!orgId,
    ...options,
  });
}

export function useLevyMatches(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_EXCHANGE_QUERY_KEYS.matches(orgId),
    queryFn: () => searchLevyMatches({}),
    enabled: !!orgId,
    ...options,
  });
}

export function useMatchApplications(
  { page = 1, perPage = 20 } = {},
  options = {},
) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_EXCHANGE_QUERY_KEYS.matchApplications(orgId, page, perPage),
    queryFn: () => listMatchApplications({ page, perPage }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      applications: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useTransferPreferences(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_EXCHANGE_QUERY_KEYS.transferPreferences(orgId),
    queryFn: getTransferPreferences,
    enabled: !!orgId,
    retry: false,
    ...options,
  });
}

export function useCheckLevyEligibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkLevyEligibility,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: LEVY_EXCHANGE_QUERY_KEYS.all(),
      });
    },
  });
}
