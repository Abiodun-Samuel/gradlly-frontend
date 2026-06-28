"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError, toastSuccess } from "@/hooks/useToast";

import { LEVY_QUERY_KEYS } from "./keys";
import {
  getDonorLinks,
  getExpiryCalendar,
  getLevy,
  getMatchApplications,
  syncDonorLink,
} from "../services/levy.service";

export function useLevySurplus() {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_QUERY_KEYS.surplus(orgId),
    queryFn: () => getLevy({ orgId }),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (response) => response?.data ?? response ?? null,
  });
}

export function useLevyExpiryCalendar() {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_QUERY_KEYS.expiryCalendar(orgId),
    queryFn: () => getExpiryCalendar({ orgId }),
    enabled: !!orgId,
    staleTime: 60 * 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (response) =>
      Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [],
  });
}

export function useDonorLinks() {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_QUERY_KEYS.donorLinks(orgId),
    queryFn: () => getDonorLinks({ orgId }),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (response) =>
      Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [],
  });
}

export function useSyncDonorLink() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (id) => syncDonorLink({ orgId, id }),
    onSuccess: () => {
      toastSuccess("Levy balance synced.");
      qc.invalidateQueries({ queryKey: LEVY_QUERY_KEYS.donorLinks(orgId) });
      qc.invalidateQueries({ queryKey: LEVY_QUERY_KEYS.surplus(orgId) });
    },
    onError: (error) => {
      toastError(error.message || "Sync failed. Please try again.");
    },
  });
}

export function useLevyMatchApplications() {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEVY_QUERY_KEYS.matchApplications(orgId),
    queryFn: () => getMatchApplications({ orgId }),
    enabled: !!orgId,
    staleTime: 2 * 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (response) =>
      Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [],
  });
}
