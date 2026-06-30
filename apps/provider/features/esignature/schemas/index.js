import { z } from "zod";

import { PDF_SOURCE } from "../constants";

// The form captures which PDF source to use and its value. The signature image
// is handled separately in the component (upload → key) and merged into the
// payload, so it is not part of this schema.
export const signatureRecordSchema = z
  .object({
    pdfSource: z.enum([PDF_SOURCE.JOB, PDF_SOURCE.KEY]),
    pdfJobId: z.string().trim().optional().or(z.literal("")),
    sourcePdfKey: z.string().trim().optional().or(z.literal("")),
  })
  .superRefine((values, ctx) => {
    if (values.pdfSource === PDF_SOURCE.JOB) {
      if (!values.pdfJobId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pdfJobId"],
          message: "Enter a completed PDF job ID",
        });
      } else if (
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          values.pdfJobId,
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pdfJobId"],
          message: "Enter a valid job ID (UUID)",
        });
      }
    } else if (values.pdfSource === PDF_SOURCE.KEY) {
      if (!values.sourcePdfKey) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sourcePdfKey"],
          message: "Enter the source PDF storage key",
        });
      } else if (values.sourcePdfKey.length > 1024) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sourcePdfKey"],
          message: "Key must be 1024 characters or fewer",
        });
      }
    }
  });

export const signatureRecordDefaults = Object.freeze({
  pdfSource: PDF_SOURCE.KEY,
  pdfJobId: "",
  sourcePdfKey: "",
});

// Build the create payload: signatureImageKey + EXACTLY ONE pdf source.
export function toSignatureRecordPayload(values, signatureImageKey) {
  const payload = { signatureImageKey };
  if (values.pdfSource === PDF_SOURCE.JOB) {
    payload.pdfJobId = values.pdfJobId.trim();
  } else {
    payload.sourcePdfKey = values.sourcePdfKey.trim();
  }
  return payload;
}
