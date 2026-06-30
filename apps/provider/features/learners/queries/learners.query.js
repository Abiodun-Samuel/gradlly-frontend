"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError, toastSuccess } from "@/hooks/useToast";
import { ERROR_CODES } from "@/lib/errors";

import { LEARNER_QUERY_KEYS } from "./keys";
import {
  getInterventionQueue,
  getLearnerProfile,
  listCohort,
  logIntervention,
} from "../services/learners.service";

export function useCohort(params = {}, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEARNER_QUERY_KEYS.cohort(orgId, params),
    queryFn: () => listCohort(params),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      entries: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useInterventionQueue(params = {}, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEARNER_QUERY_KEYS.interventionQueue(orgId, params),
    queryFn: () => getInterventionQueue(params),
    enabled: !!orgId,
    select: (data) => ({
      atRiskCount: data?.atRiskCount ?? 0,
      items: data?.items ?? [],
    }),
    ...options,
  });
}

export function useLearnerProfile(enrolmentId, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: LEARNER_QUERY_KEYS.profile(orgId, enrolmentId),
    queryFn: () => getLearnerProfile(enrolmentId),
    enabled: !!orgId && !!enrolmentId,
    ...options,
  });
}

export function useLogIntervention() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ enrolmentId, payload }) =>
      logIntervention({ enrolmentId, payload }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Intervention logged.");
      // Refresh the queue (severity may change) and any learner views.
      qc.invalidateQueries({ queryKey: LEARNER_QUERY_KEYS.all() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}
