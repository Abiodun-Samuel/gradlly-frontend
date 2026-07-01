"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { REGISTRATION_QUERY_KEYS } from "./keys";
import {
  completeRegistration,
  createRegistrationSession,
  getRegistrationSessionByToken,
  saveRegistrationStep,
} from "../services/registration.service";

export function useRegistrationSession(token, options = {}) {
  return useQuery({
    queryKey: REGISTRATION_QUERY_KEYS.session(token),
    queryFn: () => getRegistrationSessionByToken(token),
    enabled: !!token,
    retry: false, // 404/410 (bad/expired token) shouldn't be retried
    ...options,
  });
}

export function useCreateRegistrationSession(options = {}) {
  return useMutation({
    mutationFn: createRegistrationSession,
    ...options,
  });
}

export function useSaveRegistrationStep(token, options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ step, payload }) =>
      saveRegistrationStep({ token, step, payload }),
    onSuccess: (session) => {
      // The PUT returns the updated session; seed the cache so the stepper
      // advances from the server's authoritative currentStep.
      if (session) {
        queryClient.setQueryData(
          REGISTRATION_QUERY_KEYS.session(token),
          session,
        );
      }
    },
    ...options,
  });
}

export function useCompleteRegistration(token, options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactEmail } = {}) =>
      completeRegistration({ token, contactEmail }),
    onSuccess: (session) => {
      if (session) {
        queryClient.setQueryData(
          REGISTRATION_QUERY_KEYS.session(token),
          session,
        );
      }
    },
    ...options,
  });
}
