export const REGISTRATION_PATHS = Object.freeze({
  SESSIONS: "/api/v1/flowportal-registration/sessions",
  byToken: (token) =>
    `/api/v1/flowportal-registration/sessions/by-token/${token}`,
  stepByToken: (token, step) =>
    `/api/v1/flowportal-registration/sessions/by-token/${token}/steps/${step}`,
  completeByToken: (token) =>
    `/api/v1/flowportal-registration/sessions/by-token/${token}/complete`,
});

export const REGISTRATION_RESUME_TOKEN_KEY = "flowportal_registration_token";

// RegistrationWizardStep — order is authoritative; the server advances
// currentStep only when the saved step matches the current position.
export const WIZARD_STEPS = Object.freeze([
  "company_verification",
  "paye_reference",
  "das_account",
  "bank_details",
  "consent",
]);

export const STEP_META = Object.freeze({
  company_verification: {
    label: "Company",
    title: "Company verification",
    description: "Confirm your business with Companies House.",
  },
  paye_reference: {
    label: "PAYE",
    title: "PAYE reference",
    description: "Your HMRC PAYE scheme reference.",
  },
  das_account: {
    label: "DAS account",
    title: "Digital Apprenticeship Service",
    description: "Tell us about your DAS account.",
  },
  bank_details: {
    label: "Bank",
    title: "Bank details",
    description: "Where funding is reconciled.",
  },
  consent: {
    label: "Consent",
    title: "Consent & sign-off",
    description: "Authorise levy transfer and data processing.",
  },
});

// RegistrationSessionStatus
export const REGISTRATION_STATUS = Object.freeze({
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  EXPIRED: "expired",
});
