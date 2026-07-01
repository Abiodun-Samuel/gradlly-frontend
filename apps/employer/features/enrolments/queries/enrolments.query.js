"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError, toastSuccess } from "@/hooks/useToast";

import { ENROLMENT_QUERY_KEYS } from "./keys";
import {
  createEnrolment,
  getEnrolment,
  getEnrolmentJourney,
  listApprentices,
  listEnrolments,
} from "../services/enrolments.service";

export function useEnrolments({ page = 1, perPage = 20, ...options } = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ENROLMENT_QUERY_KEYS.list(orgId, { page, perPage }),
    queryFn: () => listEnrolments({ page, perPage, orgId }),
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
    queryFn: () => listApprentices({ perPage: 100, orgId }),
    enabled: !!orgId,
    select: (response) => response?.data ?? [],
    ...options,
  });
}

export function useEnrolment(id, options = {}) {
  const { orgId } = useAuthUser();
  const enabled = !!orgId && !!id;

  return useQuery({
    queryKey: ENROLMENT_QUERY_KEYS.detail(orgId, id),
    queryFn: () => getEnrolment({ orgId, id }),
    enabled,
    staleTime: 2 * 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (r) => r?.data ?? null,
    ...options,
  });
}

export function useEnrolmentJourney(id, options = {}) {
  const { orgId } = useAuthUser();
  const enabled = !!orgId && !!id;

  return useQuery({
    queryKey: ENROLMENT_QUERY_KEYS.journey(orgId, id),
    queryFn: () => getEnrolmentJourney({ orgId, id }),
    enabled,
    staleTime: 5 * 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (r) => r?.data ?? null,
    ...options,
  });
}

export function useCreateEnrolment() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (body) => createEnrolment({ orgId, body }),
    onSuccess: () => {
      toastSuccess("Enrolment created.");
      qc.invalidateQueries({ queryKey: ENROLMENT_QUERY_KEYS.list(orgId) });
    },
    onError: (error) => {
      toastError(error.message || "Failed to create enrolment.");
    },
  });
}
