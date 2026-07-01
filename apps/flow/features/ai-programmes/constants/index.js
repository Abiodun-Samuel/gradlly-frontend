export const AI_PROGRAMME_PATHS = Object.freeze({
  CATALOGUE: "/api/v1/ai-programmes/catalogue",
  byId: (id) => `/api/v1/ai-programmes/catalogue/${id}`,
  ENROLMENTS: "/api/v1/ai-programmes/enrolments",
  progress: (enrolmentId) =>
    `/api/v1/ai-programmes/enrolments/${enrolmentId}/progress`,
  complete: (enrolmentId) =>
    `/api/v1/ai-programmes/enrolments/${enrolmentId}/complete`,
});

// AiProgrammeModuleProgressStatus
export const MODULE_STATUS = Object.freeze({
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
});

export const MODULE_STATUS_META = Object.freeze({
  not_started: { label: "Not started", color: "gray" },
  in_progress: { label: "In progress", color: "amber" },
  completed: { label: "Completed", color: "green" },
});
