import { z } from "zod";

// ─── Build learner record (BuildIlrLearnerRecordDto) ─────────────────────────
export const ilrBuildSchema = z.object({
  enrolmentId: z
    .string()
    .trim()
    .min(1, "Select an enrolment")
    .uuid("Enter a valid enrolment"),
  collectionPeriod: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}$/, "Use YYYY-MM (e.g. 2025-10)"),
  academicYear: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}$/, "Use YYYY-YY (e.g. 2025-26)"),
});

export const ilrBuildDefaults = Object.freeze({
  enrolmentId: "",
  collectionPeriod: "",
  academicYear: "",
});

export function toBuildPayload(values) {
  return {
    enrolmentId: values.enrolmentId,
    collectionPeriod: values.collectionPeriod.trim(),
    academicYear: values.academicYear.trim(),
  };
}

// ─── Manual overrides (UpdateIlrLearnerRecordDto) ────────────────────────────
// The form edits a list of { key: "Entity.Field", value } rows; we require the
// key to look like "Entity.Field" and be non-empty.
export const overrideRowSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1, "Field key is required")
    .regex(
      /^[A-Za-z0-9]+\.[A-Za-z0-9]+$/,
      'Use "Entity.Field" (e.g. Learner.ULN)',
    ),
  value: z.string().trim(),
});

export const overridesFormSchema = z.object({
  overrides: z.array(overrideRowSchema),
});

// Build the { manualOverrides } payload from the rows (last write wins per key).
export function toOverridesPayload(values) {
  const manualOverrides = {};
  for (const row of values.overrides ?? []) {
    const key = row.key?.trim();
    if (key) manualOverrides[key] = row.value ?? "";
  }
  return { manualOverrides };
}

// Seed the override rows from a record's manualOverrides object.
export function overrideRowsFromRecord(record) {
  const map = record?.manualOverrides ?? {};
  const rows = Object.entries(map).map(([key, value]) => ({
    key,
    value: value ?? "",
  }));
  return { overrides: rows.length ? rows : [{ key: "", value: "" }] };
}

// ─── Mapping config create (CreateIlrMappingConfigDto) ───────────────────────
// The config document is a large JSON object; the form takes it as raw JSON text
// (compliance-lead tooling), validated for shape at submit.
export const mappingConfigSchema = z.object({
  academicYear: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}$/, "Use YYYY-YY (e.g. 2025-26)"),
  configJson: z
    .string()
    .trim()
    .min(1, "Provide the config JSON")
    .refine((v) => {
      try {
        const parsed = JSON.parse(v);
        return parsed && typeof parsed === "object" && !Array.isArray(parsed);
      } catch {
        return false;
      }
    }, "Enter valid JSON (an object with entities + rules)"),
});

export const mappingConfigDefaults = Object.freeze({
  academicYear: "",
  configJson: "",
});

export function toMappingConfigPayload(values) {
  return {
    academicYear: values.academicYear.trim(),
    config: JSON.parse(values.configJson),
  };
}
