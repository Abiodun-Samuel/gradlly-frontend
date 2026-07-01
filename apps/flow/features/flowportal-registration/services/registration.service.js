"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { REGISTRATION_PATHS } from "../constants";

function unwrap(result) {
  return result.data?.data ?? result.data;
}

export async function createRegistrationSession(payload = {}) {
  try {
    const result = await $apiClient.post(REGISTRATION_PATHS.SESSIONS, payload);
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getRegistrationSessionByToken(token) {
  try {
    const result = await $apiClient.get(REGISTRATION_PATHS.byToken(token));
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
