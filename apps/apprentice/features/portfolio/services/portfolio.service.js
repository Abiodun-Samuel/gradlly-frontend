import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { PORTFOLIO_API_PATHS } from "../constants";

export async function getLearnerDocument() {
  try {
    const result = await $apiClient.get(PORTFOLIO_API_PATHS.LEARNER_DOCUMENT);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createKsbEvidence(payload) {
  try {
    const result = await $apiClient.post(
      PORTFOLIO_API_PATHS.KSB_EVIDENCE,
      payload,
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
