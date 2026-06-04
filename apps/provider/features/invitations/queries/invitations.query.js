"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { AUTH_REDIRECTS } from "@/features/auth/constants";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { AUTH_QUERY_KEYS } from "@/features/auth/queries/keys";
import { toastError, toastSuccess } from "@/hooks/useToast";
import { ERROR_CODES } from "@/lib/errors";

import { INVITATION_QUERY_KEYS } from "./keys";
import {
  acceptInvitation,
  listInvitations,
  resendInvitation,
  revokeInvitation,
  sendInvitation,
} from "../services/invitations.service";

export function useInvitations({ page = 1, perPage = 20, ...options } = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: INVITATION_QUERY_KEYS.list(orgId, page, perPage),
    queryFn: () => listInvitations({ orgId, page, perPage }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      invitations: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

export function useSendInvitation() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: ({ email, role }) => sendInvitation({ orgId, email, role }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Invitation sent successfully.");
      qc.invalidateQueries({ queryKey: INVITATION_QUERY_KEYS.all() });
    },
    onError: (error) => {
      if (error.code !== ERROR_CODES.VALIDATION) toastError(error.message);
    },
  });
}

export function useResendInvitation() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (id) => resendInvitation({ orgId, id }),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Invitation resent.");
      qc.invalidateQueries({ queryKey: INVITATION_QUERY_KEYS.all() });
    },
    onError: (error) => {
      toastError(error.message || "Failed to resend. Please try again.");
    },
  });
}

export function useRevokeInvitation() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: (id) => revokeInvitation({ orgId, id }),
    onSuccess: () => {
      toastSuccess("Invitation revoked.");
      qc.invalidateQueries({ queryKey: INVITATION_QUERY_KEYS.all() });
    },
    onError: (error) => {
      toastError(error.message || "Failed to revoke. Please try again.");
    },
  });
}

export function useAcceptInvitation() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ token }) => acceptInvitation({ token }),
    onSuccess: (data) => {
      toastSuccess(
        data?.message || "You have successfully joined the organisation.",
      );
      qc.removeQueries({ queryKey: INVITATION_QUERY_KEYS.all() });
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
