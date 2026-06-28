import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { OTJ_API_PATHS } from "../constants";

export async function getLearnerDocuments() {
  try {
    const result = await $apiClient.get(OTJ_API_PATHS.LEARNER_DOCUMENTS);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createOtjLog(payload) {
  try {
    const result = await $apiClient.post(OTJ_API_PATHS.LOGS, payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
