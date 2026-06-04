"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { toastError } from "@/hooks/useToast";

import { NOTIFICATION_QUERY_KEYS } from "./keys";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notifications.service";

// Refetch the unread badge periodically so it stays roughly live.
const UNREAD_POLL_MS = 60_000;

/**
 * Paginated notifications list, scoped to the active organisation when present.
 */
export function useNotifications({
  page = 1,
  perPage = 20,
  unreadOnly = false,
  ...options
} = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.list(orgId, {
      page,
      perPage,
      unreadOnly,
    }),
    queryFn: () =>
      listNotifications({ organisationId: orgId, page, perPage, unreadOnly }),
    enabled: !!orgId,
    placeholderData: keepPreviousData,
    select: (response) => ({
      notifications: response?.data ?? [],
      meta: response?.meta ?? null,
    }),
    ...options,
  });
}

/**
 * Lightweight unread-count query used by the header bell badge. Derives the
 * count from the paginated meta of an `unreadOnly` request.
 */
export function useUnreadNotificationCount(options = {}) {
  const { orgId } = useAuthUser();

  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount(orgId),
    queryFn: () =>
      listNotifications({
        organisationId: orgId,
        unreadOnly: true,
        page: 1,
        perPage: 1,
      }),
    enabled: !!orgId,
    refetchInterval: UNREAD_POLL_MS,
    refetchOnWindowFocus: true,
    select: (response) => response?.meta?.total ?? 0,
    ...options,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) => markNotificationRead({ id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all() });
    },
    onError: (error) => {
      toastError(error.message || "Failed to update notification.");
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  const { orgId } = useAuthUser();

  return useMutation({
    mutationFn: () => markAllNotificationsRead({ organisationId: orgId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all() });
    },
    onError: (error) => {
      toastError(error.message || "Failed to mark all as read.");
    },
  });
}
