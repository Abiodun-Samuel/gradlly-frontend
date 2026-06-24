"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toastError, toastSuccess } from "@/hooks/useToast";
import { ERROR_CODES } from "@/lib/errors";

import { PORTFOLIO_QUERY_KEYS } from "./keys";
import {
  createKsbEvidence,
  getLearnerDocument,
} from "../services/portfolio.service";

export function useLearnerDocument() {
  return useQuery({
    queryKey: PORTFOLIO_QUERY_KEYS.learnerDocument(),
    queryFn: getLearnerDocument,
  });
}

export function useCreateKsbEvidence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createKsbEvidence,
    onSuccess: () => {
      toastSuccess("Evidence submitted — pending tutor review.");
      qc.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEYS.evidence() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}
