import { z } from "zod";

import { STANDARD_STATUS, STANDARD_STATUS_VALUES } from "../constants";

// Optional numeric field helper. Inputs of type="number" yield "" when cleared,
// so we accept an empty string and treat it as "not provided" (the field is
// dropped from the payload entirely — the strict DTO never sees an empty value).
const optionalNumber = ({ min, integer = false, maxDecimals } = {}) =>
  z
    .union([z.literal(""), z.coerce.number()])
    .refine((v) => v === "" || !Number.isNaN(v), "Enter a valid number")
    .refine((v) => v === "" || min === undefined || v >= min, {
      message: min === 1 ? "Must be at least 1" : `Must be ${min} or greater`,
    })
    .refine((v) => v === "" || !integer || Number.isInteger(v), {
      message: "Must be a whole number",
    })
    .refine(
      (v) =>
        v === "" ||
        maxDecimals === undefined ||
        Number.isInteger(v * 10 ** maxDecimals),
      { message: `Use at most ${maxDecimals} decimal place(s)` },
    );

// Mirrors the backend CreateStandardDto. The global validation pipe runs with
// forbidNonWhitelisted, so we only ever send fields in this shape.
export const standardSchema = z.object({
  programmeId: z
    .string()
    .trim()
    .min(1, "Select a programme")
    .uuid("Select a valid programme"),
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
  description: z
    .string()
    .trim()
    .max(2000, "Description must be 2000 characters or fewer")
    .optional()
    .or(z.literal("")),
  status: z.enum(STANDARD_STATUS_VALUES, {
    message: "Select a valid status",
  }),
  fundingBandMax: optionalNumber({ min: 0, maxDecimals: 2 }),
  defaultDurationMonths: optionalNumber({ min: 1, integer: true }),
});

export const standardDefaults = Object.freeze({
  programmeId: "",
  code: "",
  title: "",
  description: "",
  status: STANDARD_STATUS.DRAFT,
  fundingBandMax: "",
  defaultDurationMonths: "",
});

// Builds edit-form defaults from an existing standard. Numbers become strings so
// they bind cleanly to the number inputs; null/undefined become "".
export function standardDefaultsFromRow(standard) {
  return {
    programmeId: standard?.programmeId ?? "",
    code: standard?.code ?? "",
    title: standard?.title ?? "",
    description: standard?.description ?? "",
    status: standard?.status ?? STANDARD_STATUS.DRAFT,
    fundingBandMax:
      standard?.fundingBandMax === null ||
      standard?.fundingBandMax === undefined
        ? ""
        : String(standard.fundingBandMax),
    defaultDurationMonths:
      standard?.defaultDurationMonths === null ||
      standard?.defaultDurationMonths === undefined
        ? ""
        : String(standard.defaultDurationMonths),
  };
}

// True when an optional numeric field carries an actual value (not blank/unset).
function isProvided(v) {
  return v !== "" && v !== null && v !== undefined;
}

// Normalises form values into the API payload: trims strings, drops empty
// optional fields so the strict DTO never receives "" or null where it expects
// a number or omission.
export function toStandardPayload(values) {
  const payload = {
    programmeId: values.programmeId,
    code: values.code.trim(),
    title: values.title.trim(),
    status: values.status,
  };

  const description = values.description?.trim();
  if (description) payload.description = description;

  if (isProvided(values.fundingBandMax)) {
    payload.fundingBandMax = Number(values.fundingBandMax);
  }
  if (isProvided(values.defaultDurationMonths)) {
    payload.defaultDurationMonths = Number(values.defaultDurationMonths);
  }

  return payload;
}
