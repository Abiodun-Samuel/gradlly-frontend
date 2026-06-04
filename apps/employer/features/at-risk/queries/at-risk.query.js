"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toastError, toastSuccess } from "@/hooks/useToast";

import { AT_RISK_QUERY_KEYS } from "./at-risk.keys";
import {
  createIntervention,
  getAtRiskApprentice,
  getAtRiskList,
  markAsReviewed,
  scheduleReview,
  sendMessage,
} from "../services/at-risk.service";

export function useAtRiskList(params = {}) {
  return useQuery({
    queryKey: AT_RISK_QUERY_KEYS.list(),
    queryFn: () => getAtRiskList(params),
  });
}

export function useAtRiskApprentice(id) {
  return useQuery({
    queryKey: AT_RISK_QUERY_KEYS.detail(id),
    queryFn: () => getAtRiskApprentice(id),
    enabled: Boolean(id),
  });
}

export function useCreateIntervention(apprenticeId) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body) => createIntervention(apprenticeId, body),
    onSuccess: () => {
      toastSuccess("Intervention note saved.");
      qc.invalidateQueries({
        queryKey: AT_RISK_QUERY_KEYS.detail(apprenticeId),
      });
    },
    onError: (error) => {
      toastError(error.message || "Failed to save intervention.");
    },
  });
}

export function useSendMessage(apprenticeId) {
  return useMutation({
    mutationFn: (body) => sendMessage(apprenticeId, body),
    onSuccess: () => {
      toastSuccess("Message sent successfully.");
    },
    onError: (error) => {
      toastError(error.message || "Failed to send message.");
    },
  });
}

export function useMarkAsReviewed(apprenticeId) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => markAsReviewed(apprenticeId),
    onSuccess: () => {
      toastSuccess("Marked as reviewed.");
      qc.invalidateQueries({
        queryKey: AT_RISK_QUERY_KEYS.detail(apprenticeId),
      });
      qc.invalidateQueries({ queryKey: AT_RISK_QUERY_KEYS.list() });
    },
    onError: (error) => {
      toastError(error.message || "Failed to mark as reviewed.");
    },
  });
}

export function useScheduleReview(apprenticeId) {
  return useMutation({
    mutationFn: (body) => scheduleReview(apprenticeId, body),
    onSuccess: (data) => {
      toastSuccess(data?.message || "Review scheduled.");
    },
    onError: (error) => {
      toastError(error.message || "Failed to schedule review.");
    },
  });
}
