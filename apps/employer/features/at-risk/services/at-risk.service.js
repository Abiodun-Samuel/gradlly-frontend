// ─── SWAP GUIDE ──────────────────────────────────────────────────────────────
// This file currently returns mock data so the UI can be built before the real
// API exists. When endpoints are ready, for each function:
//
//   1. Delete the entire "// MOCK" block
//   2. Uncomment the "// REAL" block directly above it
//   3. Remove the `import { ... } from "@/components/at-risk/data"` line
//      and the `const delay = ...` helper once all functions are switched
//
// Nothing in the query layer (at-risk.query.js) or any UI component changes.
// ─────────────────────────────────────────────────────────────────────────────

// import { $apiClient } from "@/lib/api/client";
// import { normalizeApiClientError } from "@/lib/errors";
import {
  AT_RISK_APPRENTICES,
  AT_RISK_SUMMARY,
} from "@/components/at-risk/data";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch the at-risk summary counts and the full apprentice list.
 * Supports optional server-side filtering via query params.
 *
 * @param {{
 *   status?: 'at_risk' | 'overdue' | 'on_track' | 'all',
 *   search?: string,
 *   provider?: string,
 *   standard?: string,
 *   lineManager?: string,
 *   cohortStart?: string,
 *   sortBy?: 'name' | 'otj' | 'lastActivity' | 'riskSeverity' | 'epaDate',
 *   sortDir?: 'asc' | 'desc'
 * }} [params]
 * @returns {Promise<{ summary: import("@/components/at-risk/data").AtRiskSummary, apprentices: import("@/components/at-risk/data").AtRiskApprentice[] }>}
 */
export async function getAtRiskList(_params = {}) {
  // REAL:
  // try {
  //   const result = await $apiClient.get("/apprentices/at-risk", { params });
  //   return result.data?.data ?? result.data;
  // } catch (e) {
  //   throw normalizeApiClientError(e);
  // }

  // MOCK:
  await delay(450);
  return { summary: AT_RISK_SUMMARY, apprentices: AT_RISK_APPRENTICES };
}

/**
 * Fetch a single apprentice's full at-risk profile.
 *
 * @param {string} id
 * @returns {Promise<import("@/components/at-risk/data").AtRiskApprentice>}
 */
export async function getAtRiskApprentice(id) {
  // REAL:
  // try {
  //   const result = await $apiClient.get(`/apprentices/${id}`);
  //   return result.data?.data ?? result.data;
  // } catch (e) {
  //   throw normalizeApiClientError(e);
  // }

  // MOCK:
  await delay(350);
  const apprentice = AT_RISK_APPRENTICES.find((a) => a.id === id);
  if (!apprentice) throw new Error(`Apprentice ${id} not found`);
  return apprentice;
}

/**
 * Fetch the intervention history for an apprentice.
 *
 * @param {string} id
 * @returns {Promise<import("@/components/at-risk/data").Intervention[]>}
 */
export async function getInterventions(id) {
  // REAL:
  // try {
  //   const result = await $apiClient.get(`/apprentices/${id}/interventions`);
  //   return result.data?.data ?? result.data;
  // } catch (e) {
  //   throw normalizeApiClientError(e);
  // }

  // MOCK:
  await delay(300);
  const apprentice = AT_RISK_APPRENTICES.find((a) => a.id === id);
  return apprentice?.interventions ?? [];
}

/**
 * Create a new intervention note for an apprentice.
 *
 * @param {string} id
 * @param {{ title: string, notes: string, type: string, followUpDate: string }} body
 * @returns {Promise<import("@/components/at-risk/data").Intervention>}
 */
export async function createIntervention(id, body) {
  // REAL:
  // try {
  //   const result = await $apiClient.post(`/apprentices/${id}/interventions`, body);
  //   return result.data?.data ?? result.data;
  // } catch (e) {
  //   throw normalizeApiClientError(e);
  // }

  // MOCK:
  await delay(600);
  return {
    id: `i${Date.now()}`,
    date: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    type: body.type ?? "note",
    title: body.title,
    notes: body.notes,
    followUpDate: body.followUpDate ?? "",
    outcome: "pending",
    createdBy: "You",
  };
}

/**
 * Send a message to an apprentice's stakeholder (apprentice, provider, or tutor).
 *
 * @param {string} id
 * @param {{ recipient: 'apprentice' | 'provider' | 'manager', subject: string, body: string }} body
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function sendMessage(_id, _body) {
  // REAL:
  // try {
  //   const result = await $apiClient.post(`/apprentices/${id}/messages`, body);
  //   return result.data?.data ?? result.data;
  // } catch (e) {
  //   throw normalizeApiClientError(e);
  // }

  // MOCK:
  await delay(700);
  return { success: true, message: "Message sent successfully." };
}

/**
 * Mark an apprentice's risk as reviewed by the current manager.
 *
 * @param {string} id
 * @returns {Promise<{ reviewedAt: string }>}
 */
export async function markAsReviewed(id) {
  // REAL:
  // try {
  //   const result = await $apiClient.patch(`/apprentices/${id}/reviewed`);
  //   return result.data?.data ?? result.data;
  // } catch (e) {
  //   throw normalizeApiClientError(e);
  // }

  // MOCK:
  await delay(400);
  const reviewedAt = new Date().toISOString();
  return { id, reviewedAt };
}

/**
 * Schedule a review for an apprentice.
 *
 * @param {string} id
 * @param {{ date: string, notes: string }} body
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function scheduleReview(id, body) {
  // REAL:
  // try {
  //   const result = await $apiClient.post(`/apprentices/${id}/reviews`, body);
  //   return result.data?.data ?? result.data;
  // } catch (e) {
  //   throw normalizeApiClientError(e);
  // }

  // MOCK:
  await delay(500);
  return { success: true, message: `Review scheduled for ${body.date}.` };
}
