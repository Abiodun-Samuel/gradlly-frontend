"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { ILR_PATHS } from "../constants";

export async function listIlrLearnerRecords({ page = 1, perPage = 20 } = {}) {
  try {
    const result = await $apiClient.get(ILR_PATHS.LEARNER_RECORDS, {
      params: { page, perPage },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
