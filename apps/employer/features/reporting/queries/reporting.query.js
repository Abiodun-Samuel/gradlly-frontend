"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

import { REPORTING_QUERY_KEYS } from "./keys";
import {
  getEmployerDashboard,
  getLevyRoi,
  getLevyUtilisation,
} from "../services/reporting.service";

export function useEmployerDashboard(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.employerDashboard(orgId),
    queryFn: () => getEmployerDashboard(orgId),
    enabled: !!orgId,
    ...options,
  });
}

export function useLevyUtilisation(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.levyUtilisation(orgId),
    queryFn: () => getLevyUtilisation(orgId),
    enabled: !!orgId,
    ...options,
  });
}

export function useLevyRoi(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: REPORTING_QUERY_KEYS.levyRoi(orgId),
    queryFn: () => getLevyRoi(orgId),
    enabled: !!orgId,
    ...options,
  });
}
