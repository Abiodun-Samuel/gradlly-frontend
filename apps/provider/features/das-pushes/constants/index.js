// ─── Pipeline registry (the 3 near-identical push controllers) ───────────────
export const PUSH_PIPELINE = Object.freeze({
  ENROLMENT: "enrolment",
  COMPLETION: "completion",
  WITHDRAWAL: "withdrawal",
});

// Each pipeline shares the same 3 endpoints; only the base path differs.
export const PIPELINES = Object.freeze({
  [PUSH_PIPELINE.ENROLMENT]: {
    key: PUSH_PIPELINE.ENROLMENT,
    label: "Enrolment",
    base: "/api/v1/enrolment-pushes",
    hasTrigger: true,
    hasReference: true, // dasReference on delivery
  },
  [PUSH_PIPELINE.COMPLETION]: {
    key: PUSH_PIPELINE.COMPLETION,
    label: "Completion",
    base: "/api/v1/completion-pushes",
    hasTrigger: true,
    hasReference: true,
  },
  [PUSH_PIPELINE.WITHDRAWAL]: {
    key: PUSH_PIPELINE.WITHDRAWAL,
    label: "Withdrawal",
    base: "/api/v1/withdrawal-pushes",
    hasTrigger: false, // no trigger, no dasReference; nullable ids
    hasReference: false,
  },
});

export function pipelinePaths(base) {
  return {
    failed: `${base}/failed`,
    byId: (id) => `${base}/${id}`,
    retry: (id) => `${base}/${id}/retry`,
  };
}

// ─── Shared push status ──────────────────────────────────────────────────────
export const PUSH_STATUS = Object.freeze({
  QUEUED: "queued",
  PROCESSING: "processing",
  DELIVERED: "delivered",
  FAILED: "failed",
});

export const PUSH_STATUS_LABELS = Object.freeze({
  queued: "Queued",
  processing: "Processing",
  delivered: "Delivered",
  failed: "Failed",
});

export const PUSH_TERMINAL = new Set([
  PUSH_STATUS.DELIVERED,
  PUSH_STATUS.FAILED,
]);

export function isPushInFlight(push) {
  return (
    push?.status === PUSH_STATUS.QUEUED ||
    push?.status === PUSH_STATUS.PROCESSING
  );
}

// ─── Trigger labels (enrolment + completion pipelines) ───────────────────────
export const PUSH_TRIGGER_LABELS = Object.freeze({
  ilr_created: "ILR created",
  ilr_submitted: "ILR submitted",
  enrolment_completed: "Enrolment completed",
  epa_outcome_recorded: "EPA outcome recorded",
});
