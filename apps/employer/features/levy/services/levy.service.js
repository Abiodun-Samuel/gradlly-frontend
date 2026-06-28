"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { LEVY_PATHS } from "../constants";

function buildHeaders(orgId) {
  if (!orgId) return {};
  return { "x-organisation-id": orgId };
}

export async function getLevy({ orgId } = {}) {
  try {
    const result = await $apiClient.get(LEVY_PATHS.SURPLUS, {
      headers: buildHeaders(orgId),
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getExpiryCalendar({ orgId } = {}) {
  try {
    const result = await $apiClient.get(LEVY_PATHS.EXPIRY_CALENDAR, {
      headers: buildHeaders(orgId),
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getDonorLinks({ orgId } = {}) {
  try {
    const result = await $apiClient.get(LEVY_PATHS.DONOR_LINKS, {
      headers: buildHeaders(orgId),
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function syncDonorLink({ orgId, id }) {
  try {
    const result = await $apiClient.post(
      LEVY_PATHS.donorSync(id),
      {},
      { headers: buildHeaders(orgId) },
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getMatchApplications({ orgId } = {}) {
  try {
    const result = await $apiClient.get(LEVY_PATHS.MATCH_APPLICATIONS, {
      headers: buildHeaders(orgId),
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
