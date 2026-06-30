"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { PROGRAMME_PATHS, STANDARD_PATHS } from "../constants";

function buildHeaders(orgId) {
  if (!orgId) return {};
  return { "x-organisation-id": orgId };
}

export async function getStandards({ orgId, page = 1, perPage = 100 } = {}) {
  try {
    const result = await $apiClient.get(
      `${STANDARD_PATHS.LIST}?page=${page}&perPage=${perPage}`,
      { headers: buildHeaders(orgId) },
    );
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createStandard({ orgId, body }) {
  try {
    const result = await $apiClient.post(STANDARD_PATHS.LIST, body, {
      headers: buildHeaders(orgId),
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getProgrammes({ orgId, page = 1, perPage = 100 } = {}) {
  try {
    const result = await $apiClient.get(
      `${PROGRAMME_PATHS.LIST}?page=${page}&perPage=${perPage}`,
      { headers: buildHeaders(orgId) },
    );
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createProgramme({ orgId, body }) {
  try {
    const result = await $apiClient.post(PROGRAMME_PATHS.LIST, body, {
      headers: buildHeaders(orgId),
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
