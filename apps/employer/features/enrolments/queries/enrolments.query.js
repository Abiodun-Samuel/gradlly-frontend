"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError, toastSuccess } from "@/hooks/useToast";

import { ENROLMENT_QUERY_KEYS } from "./keys";
import {
  createEnrolment,
  getEnrolment,
  getEnrolmentJourney,
  getEnrolments,
} from "../services/enrolments.service";

export function useEnrolments() {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: ENROLMENT_QUERY_KEYS.list(orgId),
    queryFn: () => getEnrolments({ orgId }),
    enabled: !!orgId,
    staleTime: 2 * 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (r) => r?.data ?? [],
  });
}

export function useEnrolment(id) {
  const { orgId } = useAuthUser();
  const enabled = !!orgId && !!id;

  return useQuery({
    queryKey: ENROLMENT_QUERY_KEYS.detail(orgId, id),
    queryFn: () => getEnrolment({ orgId, id }),
    enabled,
    staleTime: 2 * 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (r) => r?.data ?? null,
  });
}

export function useEnrolmentJourney(id) {
  const { orgId } = useAuthUser();
  const enabled = !!orgId && !!id;

  return useQuery({
    queryKey: ENROLMENT_QUERY_KEYS.journey(orgId, id),
    queryFn: () => getEnrolmentJourney({ orgId, id }),
    enabled,
    staleTime: 5 * 60 * 1000,
    meta: { skipAuthRedirect: true },
    select: (r) => r?.data ?? null,
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
