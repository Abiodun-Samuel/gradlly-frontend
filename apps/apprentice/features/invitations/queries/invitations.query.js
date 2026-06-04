"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { AUTH_REDIRECTS } from "@/features/auth/constants";
import { AUTH_QUERY_KEYS } from "@/features/auth/queries/keys";
import { toastError, toastSuccess } from "@/hooks/useToast";
import { ERROR_CODES } from "@/lib/errors";

import { acceptInvitation } from "../services/invitations.service";

export function useAcceptInvitation() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ token }) => acceptInvitation({ token }),
    onSuccess: (data) => {
      toastSuccess(
        data?.message || "You have successfully joined the organisation.",
      );
      qc.removeQueries({ queryKey: ["invitations"] });
      // The user's active organisation has changed; refresh their profile so the
      // dashboard reflects the new membership immediately.
      qc.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me() });
      router.refresh();
      router.replace(AUTH_REDIRECTS.DASHBOARD_HOME_PAGE);
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}
