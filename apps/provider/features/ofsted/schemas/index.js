import { z } from "zod";

import {
  PROGRAMME_DOC_TYPES,
  QIP_STATUS,
  QIP_STATUS_VALUES,
} from "../constants";

// ─── QIP action (CreateQipActionDto) ─────────────────────────────────────────
export const qipActionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be 255 characters or fewer"),
  description: z.string().trim().optional().or(z.literal("")),
  assignedOwnerUserId: z
    .string()
    .trim()
    .min(1, "An owner is required")
    .uuid("Enter a valid owner user ID"),
  targetCompletionDate: z.string().trim().min(1, "A target date is required"),
  // The criterion slug list is validated against the live catalogue at submit
  // time by the backend; here we just require a non-empty value.
  eifCriterionSlug: z.string().trim().min(1, "Select a criterion"),
  evidenceNotes: z.string().trim().optional().or(z.literal("")),
  status: z.enum(QIP_STATUS_VALUES, { message: "Select a valid status" }),
});

export const qipActionDefaults = Object.freeze({
  title: "",
  description: "",
  assignedOwnerUserId: "",
  targetCompletionDate: "",
  eifCriterionSlug: "",
  evidenceNotes: "",
  status: QIP_STATUS.NOT_STARTED,
});

export function qipActionDefaultsFromRow(row) {
  return {
    title: row?.title ?? "",
    description: row?.description ?? "",
    assignedOwnerUserId: row?.assignedOwnerUserId ?? "",
    targetCompletionDate: row?.targetCompletionDate ?? "",
    eifCriterionSlug: row?.eifCriterionSlug ?? "",
    evidenceNotes: row?.evidenceNotes ?? "",
    status: row?.status ?? QIP_STATUS.NOT_STARTED,
  };
}

// Build the payload; drop blank optional text. evidenceAttachmentKeys is managed
// separately (carried through unchanged on edit).
export function toQipActionPayload(values, { evidenceAttachmentKeys } = {}) {
  const payload = {
    title: values.title.trim(),
    assignedOwnerUserId: values.assignedOwnerUserId,
    targetCompletionDate: values.targetCompletionDate,
    eifCriterionSlug: values.eifCriterionSlug,
    status: values.status,
  };
  const description = values.description?.trim();
  if (description) payload.description = description;
  const evidenceNotes = values.evidenceNotes?.trim();
  if (evidenceNotes) payload.evidenceNotes = evidenceNotes;
  if (evidenceAttachmentKeys?.length) {
    payload.evidenceAttachmentKeys = evidenceAttachmentKeys;
  }
  return payload;
}

// ─── Programme document (CreateProgrammeDocumentDto) ─────────────────────────
export const programmeDocumentSchema = z.object({
  documentType: z.enum(PROGRAMME_DOC_TYPES, {
    message: "Select a document type",
  }),
  storageKey: z
    .string()
    .trim()
    .min(1, "Upload a document first")
    .max(512, "Key must be 512 characters or fewer"),
});
