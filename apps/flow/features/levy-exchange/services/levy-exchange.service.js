"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { LEVY_EXCHANGE_PATHS } from "../constants";

function unwrap(result) {
  return result.data?.data ?? result.data;
}

export async function checkLevyEligibility(payload) {
  try {
    const result = await $apiClient.post(
      LEVY_EXCHANGE_PATHS.ELIGIBILITY_CHECK,
      payload,
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function listDonorLinks() {
  try {
    const result = await $apiClient.get(LEVY_EXCHANGE_PATHS.DONOR_LINKS);
    return unwrap(result) ?? [];
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function listLevySurplus() {
  try {
    const result = await $apiClient.get(LEVY_EXCHANGE_PATHS.SURPLUS);
    return unwrap(result) ?? [];
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function searchLevyMatches(payload = {}) {
  try {
    const result = await $apiClient.post(
      LEVY_EXCHANGE_PATHS.MATCHES_SEARCH,
      payload,
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function listMatchApplications({ page = 1, perPage = 20 } = {}) {
  try {
    const result = await $apiClient.get(
      LEVY_EXCHANGE_PATHS.MATCH_APPLICATIONS,
      { params: { page, perPage } },
    );
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getTransferPreferences() {
  try {
    const result = await $apiClient.get(
      LEVY_EXCHANGE_PATHS.TRANSFER_PREFERENCES,
    );
    return unwrap(result);
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
