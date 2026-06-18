import { z } from "zod";

import { PROGRAMME_STATUS, PROGRAMME_STATUS_VALUES } from "../constants";

// Mirrors the backend CreateProgrammeDto. The global validation pipe runs with
// forbidNonWhitelisted, so we never send fields outside this shape.
export const programmeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Code is required")
    .max(100, "Code must be 100 characters or fewer"),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be 255 characters or fewer"),
  // Optional free text. Empty string is allowed and stripped before submit.
  description: z
    .string()
    .trim()
    .max(2000, "Description must be 2000 characters or fewer")
    .optional()
    .or(z.literal("")),
  status: z.enum(PROGRAMME_STATUS_VALUES, {
    message: "Select a valid status",
  }),
});

export const programmeDefaults = Object.freeze({
  code: "",
  title: "",
  description: "",
  status: PROGRAMME_STATUS.DRAFT,
});

// Builds edit-form defaults from an existing programme.
export function programmeDefaultsFromRow(programme) {
  return {
    code: programme?.code ?? "",
    title: programme?.title ?? "",
    description: programme?.description ?? "",
    status: programme?.status ?? PROGRAMME_STATUS.DRAFT,
  };
}

// Normalises form values into the API payload: trims, drops an empty
// description so we never send "" for a nullable field.
export function toProgrammePayload(values) {
  const payload = {
    code: values.code.trim(),
    title: values.title.trim(),
    status: values.status,
  };
  const description = values.description?.trim();
  if (description) payload.description = description;
  return payload;
}
