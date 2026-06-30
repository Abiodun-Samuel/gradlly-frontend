import { z } from "zod";

const longText = (max = 5000) =>
  z.string().trim().max(max, `Must be ${max} characters or fewer`);

const requiredText = (label, max = 5000) =>
  longText(max).min(1, `${label} is required`);

const optionalUuid = (label) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .uuid(`Enter a valid ${label}`);

// Optional weekly hours: blank → omitted; otherwise number ≥ 0.
const optionalWeeklyHours = z
  .union([z.literal(""), z.coerce.number()])
  .refine((v) => v === "" || (!Number.isNaN(v) && v >= 0), {
    message: "Enter 0 or more hours",
  });

// ─── Content (CommitmentStatementContentDto) ─────────────────────────────────
export const commitmentContentSchema = z.object({
  trainingPlanSummary: requiredText("Training plan summary"),
  employerCommitments: requiredText("Employer commitments"),
  apprenticeCommitments: requiredText("Apprentice commitments"),
  providerCommitments: requiredText("Provider commitments"),
  weeklyHours: optionalWeeklyHours,
  additionalTerms: longText().optional().or(z.literal("")),
});

// ─── Create / new-version (CreateCommitmentStatementDto) ─────────────────────
// enrolmentId + apprenticeId come from the enrolment context, so they are not
// edited in the form; they are merged in by the caller. The form owns the three
// signer user IDs and the content.
export const commitmentFormSchema = z.object({
  apprenticeUserId: optionalUuid("apprentice user ID"),
  tutorUserId: optionalUuid("tutor user ID"),
  employerManagerUserId: optionalUuid("employer manager user ID"),
  ...commitmentContentSchema.shape,
});

export const commitmentFormDefaults = Object.freeze({
  apprenticeUserId: "",
  tutorUserId: "",
  employerManagerUserId: "",
  trainingPlanSummary: "",
  employerCommitments: "",
  apprenticeCommitments: "",
  providerCommitments: "",
  weeklyHours: "",
  additionalTerms: "",
});

// Seed the form from an existing draft (for edit) or a signed/cancelled version
// (for new-version — carry the content forward as a starting point).
export function commitmentFormDefaultsFromRow(statement) {
  const c = statement?.content ?? {};
  return {
    apprenticeUserId: statement?.apprenticeUserId ?? "",
    tutorUserId: statement?.tutorUserId ?? "",
    employerManagerUserId: statement?.employerManagerUserId ?? "",
    trainingPlanSummary: c.trainingPlanSummary ?? "",
    employerCommitments: c.employerCommitments ?? "",
    apprenticeCommitments: c.apprenticeCommitments ?? "",
    providerCommitments: c.providerCommitments ?? "",
    weeklyHours:
      c.weeklyHours === null || c.weeklyHours === undefined
        ? ""
        : String(c.weeklyHours),
    additionalTerms: c.additionalTerms ?? "",
  };
}

// Build the nested content object, dropping blank optionals (strict DTO).
function buildContent(values) {
  const content = {
    trainingPlanSummary: values.trainingPlanSummary.trim(),
    employerCommitments: values.employerCommitments.trim(),
    apprenticeCommitments: values.apprenticeCommitments.trim(),
    providerCommitments: values.providerCommitments.trim(),
  };
  if (
    values.weeklyHours !== "" &&
    values.weeklyHours !== null &&
    values.weeklyHours !== undefined
  ) {
    content.weeklyHours = Number(values.weeklyHours);
  }
  const additional = values.additionalTerms?.trim();
  if (additional) content.additionalTerms = additional;
  return content;
}

// Full create/new-version payload. `enrolmentId` + `apprenticeId` are supplied
// by the caller (from the enrolment context).
export function toCreatePayload(values, { enrolmentId, apprenticeId }) {
  return {
    enrolmentId,
    apprenticeId,
    apprenticeUserId: values.apprenticeUserId,
    tutorUserId: values.tutorUserId,
    employerManagerUserId: values.employerManagerUserId,
    content: buildContent(values),
  };
}

// Update payload (draft only): content is replaced wholesale + the 3 user IDs.
export function toUpdatePayload(values) {
  return {
    apprenticeUserId: values.apprenticeUserId,
    tutorUserId: values.tutorUserId,
    employerManagerUserId: values.employerManagerUserId,
    content: buildContent(values),
  };
}
