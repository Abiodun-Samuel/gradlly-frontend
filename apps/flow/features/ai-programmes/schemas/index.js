import { z } from "zod";

// Enrol an apprentice onto an AI programme. Either reuse an existing apprentice
// (apprenticeId) OR provide firstName/lastName/email to create one — the spec
// requires the trio when no apprenticeId is given.
export const enrolAiApprenticeSchema = z
  .object({
    firstName: z.string().trim().optional().or(z.literal("")),
    lastName: z.string().trim().optional().or(z.literal("")),
    email: z
      .string()
      .trim()
      .email("Enter a valid email")
      .optional()
      .or(z.literal("")),
    plannedStartDate: z.string().trim().optional().or(z.literal("")),
  })
  .superRefine((val, ctx) => {
    // This form always creates a new apprentice, so the trio is required.
    if (!val.firstName) {
      ctx.addIssue({
        code: "custom",
        path: ["firstName"],
        message: "First name is required",
      });
    }
    if (!val.lastName) {
      ctx.addIssue({
        code: "custom",
        path: ["lastName"],
        message: "Last name is required",
      });
    }
    if (!val.email) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Email is required",
      });
    }
  });

export const enrolAiApprenticeDefaults = {
  firstName: "",
  lastName: "",
  email: "",
  plannedStartDate: "",
};

// Strips empty strings so the strict backend DTO never sees them.
export function toEnrolmentPayload(programmeId, values) {
  const payload = {
    programmeId,
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
  };
  if (values.plannedStartDate) {
    payload.plannedStartDate = values.plannedStartDate;
  }
  return payload;
}
