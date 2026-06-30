"use client";

import { $apiClient } from "@/lib/api/client";
import { normalizeApiClientError } from "@/lib/errors";

import { LEARNER_PATHS } from "../constants";

// The active organisation is sent globally via the X-Organisation-Id cookie/
// header (see lib/api/client), so none of these calls set it explicitly.

export async function listCohort({
  page = 1,
  perPage = 20,
  employerOrganisationId,
  standardId,
  statusBadge,
  tutorUserId,
  epaMonth,
  sortBy,
  sortOrder,
} = {}) {
  try {
    const params = { page, perPage };
    if (employerOrganisationId)
      params.employerOrganisationId = employerOrganisationId;
    if (standardId) params.standardId = standardId;
    if (statusBadge) params.statusBadge = statusBadge;
    if (tutorUserId) params.tutorUserId = tutorUserId;
    if (epaMonth) params.epaMonth = epaMonth;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;

    const result = await $apiClient.get(LEARNER_PATHS.cohort, { params });
    return result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getInterventionQueue({ tutorUserId, mine } = {}) {
  try {
    const params = {};
    if (tutorUserId) params.tutorUserId = tutorUserId;
    if (mine) params.mine = mine;

    const result = await $apiClient.get(LEARNER_PATHS.interventionQueue, {
      params,
    });
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function logIntervention({ enrolmentId, payload }) {
  try {
    const result = await $apiClient.post(
      LEARNER_PATHS.interventions(enrolmentId),
      payload,
    );
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}

export async function getLearnerProfile(enrolmentId) {
  try {
    const result = await $apiClient.get(LEARNER_PATHS.profile(enrolmentId));
    return result.data?.data ?? result.data;
  } catch (e) {
    throw normalizeApiClientError(e);
  }
}
