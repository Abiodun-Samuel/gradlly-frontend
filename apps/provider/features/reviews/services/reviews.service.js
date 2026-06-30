"use client";

import { $apiClient } from "@/lib/api/client";
import { ApiClientError, normalizeApiClientError } from "@/lib/errors";

import { REVIEW_PATHS } from "../constants";

// The active organisation is sent globally via the X-Organisation-Id cookie/
// header (see lib/api/client), so none of these calls set it explicitly.

export async function listReviews(params = {}) {
  try {
    const result = await $apiClient.get(REVIEW_PATHS.BASE, { params });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// from + to are required by the backend for the calendar view.
export async function listReviewCalendar({ from, to, ...rest } = {}) {
  try {
    const result = await $apiClient.get(REVIEW_PATHS.calendar, {
      params: { from, to, ...rest },
    });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getReview(id) {
  try {
    const result = await $apiClient.get(REVIEW_PATHS.byId(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function createReview(payload) {
  try {
    const result = await $apiClient.post(REVIEW_PATHS.BASE, payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

// Returns the BulkScheduleReviewsResponseDto (partial success — inspect failures[]).
export async function bulkScheduleReviews({ items }) {
  try {
    const result = await $apiClient.post(REVIEW_PATHS.bulkSchedule, { items });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function updateReview({ id, payload }) {
  try {
    const result = await $apiClient.patch(REVIEW_PATHS.byId(id), payload);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function cancelReview(id) {
  return updateReview({ id, payload: { status: "cancelled" } });
}

// Record (structured meeting content). GET 404 means "no record yet".
export async function getReviewRecord(id) {
  try {
    const result = await $apiClient.get(REVIEW_PATHS.record(id));
    return result.data?.data ?? result.data;
  } catch (e) {
    if (e instanceof ApiClientError && e.status === 404) return null;
    throw normalizeApiClientError(e);
  }
}

export async function saveReviewRecord({ id, body }) {
  try {
    const result = await $apiClient.put(REVIEW_PATHS.record(id), body);
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function enqueueReviewSnapshot(id) {
  try {
    const result = await $apiClient.post(REVIEW_PATHS.snapshotPdf(id), {});
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function signReview({ id, party, signatureImageKey }) {
  try {
    const result = await $apiClient.post(REVIEW_PATHS.sign(id), {
      party,
      signatureImageKey,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
