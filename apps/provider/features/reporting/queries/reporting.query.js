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

// Linked employers as { value, text } options for select inputs (e.g. the
// enrolment "link employer organisation" modal). Reuses the employer directory
// endpoint and pulls a wide page so every linked employer is selectable.
export function useLinkedEmployerOptions(options = {}) {
  const { orgId } = useAuthUser();
  const params = { page: 1, perPage: 200 };

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.employerDirectory(orgId, params),
    queryFn: () => listEmployerDirectory(params),
    enabled: !!orgId,
    select: (response) =>
      (response?.data ?? []).map((row) => ({
        value: row.employerOrganisationId,
        text: row.organisationName,
      })),
    ...options,
  });
}
