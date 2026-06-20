"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toastError, toastSuccess } from "@/hooks/useToast";
import { ERROR_CODES } from "@/lib/errors";

import { OTJ_QUERY_KEYS } from "./keys";
import { createOtjLog } from "../services/otj.service";

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
