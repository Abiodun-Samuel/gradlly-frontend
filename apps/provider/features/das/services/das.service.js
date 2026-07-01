"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { DAS_PATHS } from "../constants";

// The active organisation is sent globally via the X-Organisation-Id cookie/
// header (see lib/api/client), so none of these calls set it explicitly.

export async function triggerDasSync() {
  try {
    const result = await $apiClient.post(DAS_PATHS.sync, {});
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getLevyBalance() {
  try {
    const result = await $apiClient.get(DAS_PATHS.levyBalance);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getLevyForecast({ horizonMonths } = {}) {
  try {
    const params = {};
    if (horizonMonths) params.horizonMonths = horizonMonths;
    const result = await $apiClient.get(DAS_PATHS.levyForecast, { params });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function listFundingPayments({
  page = 1,
  perPage = 20,
  from,
  to,
} = {}) {
  try {
    const params = { page, perPage };
    if (from) params.from = from;
    if (to) params.to = to;
    const result = await $apiClient.get(DAS_PATHS.fundingPayments, { params });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
