"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { REPORTING_QUERY_KEYS } from "./keys";
import {
  getProviderDashboard,
  listEmployerDirectory,
} from "../services/reporting.service";

export function useProviderDashboard(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.providerDashboard(orgId),
    queryFn: () => getProviderDashboard(orgId),
    enabled: !!orgId,
    refetchOnMount: "always",
    ...options,
  });
}

export function useEmployerDirectory({
  page = 1,
  perPage = 20,
  ...options
} = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.employerDirectory(orgId, page, perPage),
    queryFn: () => listEmployerDirectory({ page, perPage }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      employers: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

// Linked employer clients for selectors (PRD F2.4.1 — directory, not global org browse).
export function useLinkedEmployerOptions(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.employerDirectory(orgId, 1, 100),
    queryFn: () => listEmployerDirectory({ page: 1, perPage: 100 }),
    enabled: !!orgId,
    select: (response) =>
      (response?.data ?? []).map((row) => ({
        value: row.employerOrganisationId,
        text: row.organisationName,
      })),
    ...options,
  });
}
