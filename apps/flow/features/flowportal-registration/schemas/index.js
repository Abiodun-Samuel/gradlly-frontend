import { z } from "zod";

// Per-step payload schemas — one per RegistrationWizardStep. Each maps 1:1 to
// the PUT :step body documented in the Flow spec.

export const companyVerificationSchema = z.object({
  companiesHouseNumber: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{8}$/, "Enter a valid 8-character company number"),
});

export const payeReferenceSchema = z.object({
  payeReference: z
    .string()
    .trim()
    .regex(/^\d{3}\/[A-Za-z]{2}\d{5}$/, "Format: 123/AB45678"),
});

export const dasAccountSchema = z
  .object({
    hasDasAccount: z.boolean(),
    dasAccountCreated: z.boolean().optional(),
    dasReference: z.string().trim().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.hasDasAccount && !val.dasReference) {
      ctx.addIssue({
        code: "custom",
        path: ["dasReference"],
        message: "Enter your DAS reference",
      });
    }
  });

export const bankDetailsSchema = z.object({
  accountName: z.string().trim().min(1, "Enter the account name"),
  sortCode: z
    .string()
    .trim()
    .regex(/^\d{2}-\d{2}-\d{2}$/, "Format: 12-34-56"),
  accountNumber: z
    .string()
    .trim()
    .regex(/^\d{8}$/, "Enter an 8-digit account number"),
});

export const consentSchema = z.object({
  levyTransferConsent: z
    .boolean()
    .refine((v) => v === true, "You must consent to the levy transfer"),
  dataProcessingConsent: z
    .boolean()
    .refine((v) => v === true, "You must consent to data processing"),
  signatoryName: z.string().trim().min(1, "Enter the signatory's name"),
  contactEmail: z
    .string()
    .trim()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
});

export const STEP_SCHEMAS = Object.freeze({
  company_verification: companyVerificationSchema,
  paye_reference: payeReferenceSchema,
  das_account: dasAccountSchema,
  bank_details: bankDetailsSchema,
  consent: consentSchema,
});

export const STEP_DEFAULTS = Object.freeze({
  company_verification: { companiesHouseNumber: "" },
  paye_reference: { payeReference: "" },
  das_account: { hasDasAccount: false, dasReference: "" },
  bank_details: { accountName: "", sortCode: "", accountNumber: "" },
  consent: {
    levyTransferConsent: false,
    dataProcessingConsent: false,
    signatoryName: "",
    contactEmail: "",
  },
});
