"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toastError, toastSuccess } from "@/hooks/useToast";
import { ERROR_CODES } from "@/lib/errors";

import { OTJ_QUERY_KEYS } from "./keys";
import { createOtjLog, getLearnerDocuments } from "../services/otj.service";

export function useLearnerDocuments() {
  return useQuery({
    queryKey: OTJ_QUERY_KEYS.learnerDocuments(),
    queryFn: getLearnerDocuments,
  });
}

export function useCreateOtjLog() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createOtjLog,
    onSuccess: () => {
      toastSuccess("Session logged successfully.");
      qc.invalidateQueries({ queryKey: OTJ_QUERY_KEYS.logs() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}
