"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { REGISTRATION_QUERY_KEYS } from "./keys";
import {
  createRegistrationSession,
  getRegistrationSessionByToken,
} from "../services/registration.service";

export function useRegistrationSession(token, options = {}) {
  return useQuery({
    queryKey: REGISTRATION_QUERY_KEYS.session(token),
    queryFn: () => getRegistrationSessionByToken(token),
    enabled: !!token,
    ...options,
  });
}

export function useCreateRegistrationSession(options = {}) {
  return useMutation({
    mutationFn: createRegistrationSession,
    ...options,
  });
}
