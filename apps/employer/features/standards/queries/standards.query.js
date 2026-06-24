"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError, toastSuccess } from "@/hooks/useToast";

import { PROGRAMME_QUERY_KEYS, STANDARD_QUERY_KEYS } from "./keys";
import {
  createProgramme,
  createStandard,
  getProgrammes,
  getStandards,
} from "../services/standards.service";

export function useStandards() {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: STANDARD_QUERY_KEYS.list(orgId),
    queryFn: () => getStandards({ orgId }),
    enabled: !!orgId,
    staleTime: 10 * 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (r) => r?.data ?? [],
  });
}

export function useCreateStandard() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (body) => createStandard({ orgId, body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STANDARD_QUERY_KEYS.list(orgId) });
      toastSuccess("Standard created.");
    },
    onError: (error) => {
      toastError(error.message || "Failed to create standard.");
    },
  });
}

export function useProgrammes() {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: PROGRAMME_QUERY_KEYS.list(orgId),
    queryFn: () => getProgrammes({ orgId }),
    enabled: !!orgId,
    staleTime: 10 * 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (r) => r?.data ?? [],
  });
}

export function useCreateProgramme() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (body) => createProgramme({ orgId, body }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROGRAMME_QUERY_KEYS.list(orgId) });
      toastSuccess("Programme created.");
    },
    onError: (error) => {
      toastError(error.message || "Failed to create programme.");
    },
  });
}
