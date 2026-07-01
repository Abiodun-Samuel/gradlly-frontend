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

import { PORTFOLIO_QUERY_KEYS } from "./keys";
import {
  createKsbEvidence,
  getKsbHeatmap,
  getLearnerDocument,
  listEvidenceItems,
} from "../services/portfolio.service";

export function useLearnerDocument(options = {}) {
  const { orgId, isLoading: authLoading } = useAuthUser();

  return useQuery({
    queryKey: PORTFOLIO_QUERY_KEYS.learnerDocument(orgId),
    queryFn: () => getLearnerDocument(orgId),
    enabled: !!orgId && !authLoading,
    ...options,
  });
}

export function useCreateKsbEvidence() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createKsbEvidence,
    onSuccess: () => {
      toastSuccess("Evidence submitted — pending tutor review.");
      qc.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEYS.all() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useEvidenceItems({ page = 1, perPage = 20, ...options } = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: PORTFOLIO_QUERY_KEYS.evidence(orgId, page, perPage),
    queryFn: () => listEvidenceItems({ page, perPage }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      items: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useKsbHeatmap(enrolmentId, options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: PORTFOLIO_QUERY_KEYS.heatmap(orgId, enrolmentId),
    queryFn: () => getKsbHeatmap(enrolmentId),
    enabled: !!orgId && !!enrolmentId,
    ...options,
  });
}
