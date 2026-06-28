"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { ENROLMENT_PATHS } from "../constants";

function buildHeaders(orgId) {
  if (!orgId) return {};
  return { "x-organisation-id": orgId };
}

export async function getEnrolments({ orgId, page = 1, perPage = 100 } = {}) {
  try {
    const result = await $apiClient.get(
      `${ENROLMENT_PATHS.LIST}?page=${page}&perPage=${perPage}`,
      { headers: buildHeaders(orgId) },
    );
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getEnrolment({ orgId, id }) {
  try {
    const result = await $apiClient.get(ENROLMENT_PATHS.detail(id), {
      headers: buildHeaders(orgId),
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getEnrolmentJourney({ orgId, id }) {
  try {
    const result = await $apiClient.get(ENROLMENT_PATHS.journey(id), {
      headers: buildHeaders(orgId),
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createEnrolment({ orgId, body }) {
  try {
    const result = await $apiClient.post(ENROLMENT_PATHS.LIST, body, {
      headers: buildHeaders(orgId),
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
