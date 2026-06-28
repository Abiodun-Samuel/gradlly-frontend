import { z } from "zod";

import { APPRENTICE_STATUS, APPRENTICE_STATUS_VALUES } from "../constants";

// Mirrors the backend CreateApprenticeDto. The global validation pipe runs with
// forbidNonWhitelisted, so we only ever send fields in this shape.
export const apprenticeSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(100, "First name must be 100 characters or fewer"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(100, "Last name must be 100 characters or fewer"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .max(320, "Email must be 320 characters or fewer"),
  status: z.enum(APPRENTICE_STATUS_VALUES, {
    message: "Select a valid status",
  }),
});

export const apprenticeDefaults = Object.freeze({
  firstName: "",
  lastName: "",
  email: "",
  status: APPRENTICE_STATUS.PENDING,
});

// Builds edit-form defaults from an existing apprentice.
export function apprenticeDefaultsFromRow(apprentice) {
  return {
    firstName: apprentice?.firstName ?? "",
    lastName: apprentice?.lastName ?? "",
    email: apprentice?.email ?? "",
    status: apprentice?.status ?? APPRENTICE_STATUS.PENDING,
  };
}

// Normalises form values into the API payload. Zod already trims/lowercases, so
// this simply forwards the canonical fields.
export function toApprenticePayload(values) {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim().toLowerCase(),
    status: values.status,
  };
}
