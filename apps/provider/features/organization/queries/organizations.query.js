"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AUTH_QUERY_KEYS } from "@/features/auth/queries/keys";
import { toastError, toastSuccess } from "@/hooks/useToast";
import { ERROR_CODES } from "@/lib/errors";

import { createOrganization } from "../services/organizations.service";

export function useCreateOrganization() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createOrganization,
    onSuccess: (data) => {
      toastSuccess(data?.message || "Organisation created successfully.");
      // Refetch the current user — when activeOrganisation is set the
      // Modal in DashboardLayout closes automatically (open = !user.activeOrganisation).
      qc.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) {
        toastError(error.message);
      }
    },
  });
}
