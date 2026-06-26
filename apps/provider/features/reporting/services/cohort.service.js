"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { LEARNER_PATHS } from "../constants";

export async function listCohort({ page = 1, perPage = 20 } = {}) {
  try {
    const result = await $apiClient.get(LEARNER_PATHS.COHORT, {
      params: { page, perPage },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function listInterventionQueue({ page = 1, perPage = 20 } = {}) {
  try {
    const result = await $apiClient.get(LEARNER_PATHS.INTERVENTION_QUEUE, {
      params: { page, perPage },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
