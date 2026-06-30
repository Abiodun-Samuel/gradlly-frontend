import { z } from "zod";

import { KSB_KIND, KSB_KIND_VALUES } from "../constants";

// ─── KSB definition (CreateKsbDefinitionDto) ─────────────────────────────────
export const ksbDefinitionSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Code is required")
    .max(20, "Code must be 20 characters or fewer"),
  kind: z.enum(KSB_KIND_VALUES, { message: "Select a valid kind" }),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be 255 characters or fewer"),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be 2000 characters or fewer")
    .optional()
    .or(z.literal("")),
  sortOrder: z
    .union([z.literal(""), z.coerce.number()])
    .refine((v) => v === "" || (Number.isInteger(v) && v >= 0), {
      message: "Sort order must be a whole number ≥ 0",
    }),
});

export const ksbDefinitionDefaults = Object.freeze({
  code: "",
  kind: KSB_KIND.KNOWLEDGE,
  title: "",
  description: "",
  sortOrder: "",
});

export function ksbDefinitionDefaultsFromRow(row) {
  return {
    code: row?.code ?? "",
    kind: row?.kind ?? KSB_KIND.KNOWLEDGE,
    title: row?.title ?? "",
    description: row?.description ?? "",
    sortOrder:
      row?.sortOrder === null || row?.sortOrder === undefined
        ? ""
        : String(row.sortOrder),
  };
}

export function toKsbDefinitionPayload(values) {
  const payload = {
    code: values.code.trim(),
    kind: values.kind,
    title: values.title.trim(),
  };
  const description = values.description?.trim();
  if (description) payload.description = description;
  if (
    values.sortOrder !== "" &&
    values.sortOrder !== null &&
    values.sortOrder !== undefined
  ) {
    payload.sortOrder = Number(values.sortOrder);
  }
  return payload;
}

// ─── Evidence return (ReturnKsEvidenceItemDto) ───────────────────────────────
export const evidenceReturnSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, "A reason is required")
    .max(2000, "Reason must be 2000 characters or fewer"),
});
