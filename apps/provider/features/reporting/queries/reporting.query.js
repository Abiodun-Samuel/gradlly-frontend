"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import {
  getProviderDashboard,
  listEmployerDirectory,
} from "../services/reporting.service";

export const REPORTING_QUERY_KEYS = {
  all: () => ["reporting"],
  providerDashboard: (orgId) => ["reporting", "provider-dashboard", orgId],
  employerDirectory: (orgId, params = {}) => [
    "reporting",
    "employer-directory",
    orgId,
    params,
  ],
};

export function useProviderDashboard(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.providerDashboard(orgId),
    queryFn: getProviderDashboard,
    enabled: !!orgId,
    ...options,
  });
}

export function useEmployerDirectory(params = {}, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.employerDirectory(orgId, params),
    queryFn: () => listEmployerDirectory(params),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      employers: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}
