export const ILR_PATHS = Object.freeze({
  // Learner records
  build: "/api/v1/ilr/learner-records/build",
  records: "/api/v1/ilr/learner-records",
  recordById: (id) => `/api/v1/ilr/learner-records/${id}`,
  validate: (id) => `/api/v1/ilr/learner-records/${id}/validate`,
  validationReport: (id) =>
    `/api/v1/ilr/learner-records/${id}/validation-report`,
  submit: (id) => `/api/v1/ilr/learner-records/${id}/submit`,
  amend: (id) => `/api/v1/ilr/learner-records/${id}/amend`,
  recordSubmissions: (id) => `/api/v1/ilr/learner-records/${id}/submissions`,

  // Submissions (poll)
  submissionById: (id) => `/api/v1/ilr/submissions/${id}`,

  // Mapping configs
  mappingConfigs: "/api/v1/ilr/mapping-configs",
  mappingConfigActive: "/api/v1/ilr/mapping-configs/active",
  mappingConfigPublish: (id) => `/api/v1/ilr/mapping-configs/${id}/publish`,
});

// ─── Learner record status (`IlrLearnerRecordStatus`) ────────────────────────
export const ILR_RECORD_STATUS = Object.freeze({
  DRAFT: "draft",
  VALIDATED: "validated",
  VALIDATION_FAILED: "validation_failed",
});

export const ILR_RECORD_STATUS_LABELS = Object.freeze({
  draft: "Draft",
  validated: "Validated",
  validation_failed: "Validation failed",
});

export const ILR_RECORD_STATUS_FILTER_OPTIONS = [
  { value: "", text: "All statuses" },
  { value: ILR_RECORD_STATUS.DRAFT, text: "Draft" },
  { value: ILR_RECORD_STATUS.VALIDATED, text: "Validated" },
  { value: ILR_RECORD_STATUS.VALIDATION_FAILED, text: "Validation failed" },
];

// ─── Submission status (`IlrSubmissionStatus`) — async ───────────────────────
export const ILR_SUBMISSION_STATUS = Object.freeze({
  QUEUED: "queued",
  PROCESSING: "processing",
  SUBMITTED: "submitted",
  FAILED: "failed",
});

export const ILR_SUBMISSION_STATUS_LABELS = Object.freeze({
  queued: "Queued",
  processing: "Processing",
  submitted: "Submitted",
  failed: "Failed",
});

export const ILR_SUBMISSION_TERMINAL = new Set([
  ILR_SUBMISSION_STATUS.SUBMITTED,
  ILR_SUBMISSION_STATUS.FAILED,
]);

export function isSubmissionInFlight(submission) {
  return (
    submission?.status === ILR_SUBMISSION_STATUS.QUEUED ||
    submission?.status === ILR_SUBMISSION_STATUS.PROCESSING
  );
}

// ─── Mapping config status ───────────────────────────────────────────────────
export const ILR_CONFIG_STATUS = Object.freeze({
  DRAFT: "draft",
  PUBLISHED: "published",
  SUPERSEDED: "superseded",
});

export const ILR_CONFIG_STATUS_LABELS = Object.freeze({
  draft: "Draft",
  published: "Published",
  superseded: "Superseded",
});

// ─── Validation severity ─────────────────────────────────────────────────────
export const VALIDATION_SEVERITY = Object.freeze({
  ERROR: "error",
  WARN: "warn",
});

// ─── Record action gating (mirror the backend) ───────────────────────────────
/**
 * Actions available for a learner record.
 * @param {object}  record         the IlrLearnerRecord
 * @param {boolean} canSubmit      user is owner/admin (submit/amend gate)
 * @param {object}  latestSubmission  most recent submission (for amend/in-flight gates)
 */
export function getIlrRecordActions(
  record,
  { canSubmit, latestSubmission } = {},
) {
  const status = record?.status ?? null;
  const inFlight = isSubmissionInFlight(latestSubmission);
  const hasSuccessful =
    latestSubmission?.status === ILR_SUBMISSION_STATUS.SUBMITTED;

  return {
    validate: true, // always available (refreshes status)
    submit: status === ILR_RECORD_STATUS.VALIDATED && canSubmit && !inFlight,
    amend: hasSuccessful && canSubmit && !inFlight,
    inFlight,
  };
}
