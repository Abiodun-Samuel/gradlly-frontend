import { z } from "zod";

const signerUuid = (label) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .uuid(`Enter a valid ${label}`);

// ─── Schedule form (CreateReviewDto) ─────────────────────────────────────────
// enrolmentId + apprenticeId come from the enrolment context (merged by caller).
export const reviewScheduleSchema = z.object({
  scheduledAt: z.string().trim().min(1, "Date and time are required"),
  title: z
    .string()
    .trim()
    .max(200, "Title must be 200 characters or fewer")
    .optional()
    .or(z.literal("")),
  reviewType: z
    .string()
    .trim()
    .max(50, "Type must be 50 characters or fewer")
    .optional()
    .or(z.literal("")),
  apprenticeUserId: signerUuid("apprentice user ID"),
  tutorUserId: signerUuid("tutor user ID"),
  employerManagerUserId: signerUuid("employer manager user ID"),
});

export const reviewScheduleDefaults = Object.freeze({
  scheduledAt: "",
  title: "",
  reviewType: "",
  apprenticeUserId: "",
  tutorUserId: "",
  employerManagerUserId: "",
});

export function reviewScheduleDefaultsFromRow(review) {
  return {
    scheduledAt: toLocalInput(review?.scheduledAt),
    title: review?.title ?? "",
    reviewType: review?.reviewType ?? "",
    apprenticeUserId: review?.apprenticeUserId ?? "",
    tutorUserId: review?.tutorUserId ?? "",
    employerManagerUserId: review?.employerManagerUserId ?? "",
  };
}

// datetime-local value ("YYYY-MM-DDTHH:mm") → ISO 8601 for the API.
function toIso(localValue) {
  if (!localValue) return undefined;
  const d = new Date(localValue);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

// ISO → datetime-local value for seeding the input.
function toLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  // Adjust to local time, then trim to minutes (YYYY-MM-DDTHH:mm).
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

// Create payload (enrolmentId + apprenticeId supplied by the caller).
export function toCreateReviewPayload(values, { enrolmentId, apprenticeId }) {
  const payload = {
    enrolmentId,
    apprenticeId,
    scheduledAt: toIso(values.scheduledAt),
    apprenticeUserId: values.apprenticeUserId,
    tutorUserId: values.tutorUserId,
    employerManagerUserId: values.employerManagerUserId,
  };
  const title = values.title?.trim();
  if (title) payload.title = title;
  const reviewType = values.reviewType?.trim();
  if (reviewType) payload.reviewType = reviewType;
  return payload;
}

// Update payload (reschedule / edit). Sends the editable fields.
export function toUpdateReviewPayload(values) {
  const payload = {
    scheduledAt: toIso(values.scheduledAt),
    apprenticeUserId: values.apprenticeUserId,
    tutorUserId: values.tutorUserId,
    employerManagerUserId: values.employerManagerUserId,
    // Empty strings clear the optional labels.
    title: values.title?.trim() || null,
    reviewType: values.reviewType?.trim() || null,
  };
  return payload;
}

// ─── Record (ReviewRecordPayloadDto) ─────────────────────────────────────────
const smartGoalSchema = z.object({
  objective: z.string().trim().min(1, "Objective is required"),
  measurable: z.string().trim().min(1, "Measurable is required"),
  achievable: z.string().trim().min(1, "Achievable is required"),
  relevant: z.string().trim().min(1, "Relevant is required"),
  timeBound: z.string().trim().min(1, "Time-bound is required"),
});

// Wellbeing score: blank → omitted; otherwise integer 1–10.
const wellbeingScore = z
  .union([z.literal(""), z.coerce.number()])
  .refine((v) => v === "" || (Number.isInteger(v) && v >= 1 && v <= 10), {
    message: "Score must be a whole number from 1 to 10",
  });

export const reviewRecordSchema = z.object({
  smartGoals: z.array(smartGoalSchema).min(1, "Add at least one SMART goal"),
  wellbeingScore,
  wellbeingNotes: z.string().trim().optional().or(z.literal("")),
  progressSummary: z.string().trim().optional().or(z.literal("")),
  actionsAgreed: z.string().trim().optional().or(z.literal("")),
  employerComments: z.string().trim().optional().or(z.literal("")),
});

export const emptySmartGoal = Object.freeze({
  objective: "",
  measurable: "",
  achievable: "",
  relevant: "",
  timeBound: "",
});

export const reviewRecordDefaults = Object.freeze({
  smartGoals: [{ ...emptySmartGoal }],
  wellbeingScore: "",
  wellbeingNotes: "",
  progressSummary: "",
  actionsAgreed: "",
  employerComments: "",
});

// Seed the record form from a saved ReviewRecordResponseDto.payload.
export function reviewRecordDefaultsFromPayload(payload) {
  if (!payload) return reviewRecordDefaults;
  const goals = Array.isArray(payload.smartGoals) ? payload.smartGoals : [];
  return {
    smartGoals: goals.length
      ? goals.map((g) => ({
          objective: g.objective ?? "",
          measurable: g.measurable ?? "",
          achievable: g.achievable ?? "",
          relevant: g.relevant ?? "",
          timeBound: g.timeBound ?? "",
        }))
      : [{ ...emptySmartGoal }],
    wellbeingScore:
      payload.wellbeing?.score === null ||
      payload.wellbeing?.score === undefined
        ? ""
        : String(payload.wellbeing.score),
    wellbeingNotes: payload.wellbeing?.notes ?? "",
    progressSummary: payload.progressSummary ?? "",
    actionsAgreed: payload.actionsAgreed ?? "",
    employerComments: payload.employerComments ?? "",
  };
}

// Build the { payload } body for PUT :id/record, dropping blank optionals.
export function toRecordPayload(values) {
  const wellbeing = {};
  if (
    values.wellbeingScore !== "" &&
    values.wellbeingScore !== null &&
    values.wellbeingScore !== undefined
  ) {
    wellbeing.score = Number(values.wellbeingScore);
  }
  const notes = values.wellbeingNotes?.trim();
  if (notes) wellbeing.notes = notes;

  const payload = {
    smartGoals: values.smartGoals.map((g) => ({
      objective: g.objective.trim(),
      measurable: g.measurable.trim(),
      achievable: g.achievable.trim(),
      relevant: g.relevant.trim(),
      timeBound: g.timeBound.trim(),
    })),
    wellbeing,
  };

  const progressSummary = values.progressSummary?.trim();
  if (progressSummary) payload.progressSummary = progressSummary;
  const actionsAgreed = values.actionsAgreed?.trim();
  if (actionsAgreed) payload.actionsAgreed = actionsAgreed;
  const employerComments = values.employerComments?.trim();
  if (employerComments) payload.employerComments = employerComments;

  return { payload };
}
