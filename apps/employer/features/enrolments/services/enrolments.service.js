"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { APPRENTICE_PATHS, ENROLMENT_PATHS } from "../constants";

export async function listEnrolments({ page = 1, perPage = 20 } = {}) {
  try {
    const result = await $apiClient.get(ENROLMENT_PATHS.BASE, {
      params: { page, perPage },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function listApprentices({ page = 1, perPage = 100 } = {}) {
  try {
    const result = await $apiClient.get(APPRENTICE_PATHS.BASE, {
      params: { page, perPage },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
