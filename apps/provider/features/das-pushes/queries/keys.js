export const DAS_PUSH_QUERY_KEYS = {
  all: () => ["das-pushes"],
  failed: (orgId, pipeline, params = {}) => [
    "das-pushes",
    "failed",
    orgId,
    pipeline,
    params,
  ],
  detail: (orgId, pipeline, id) => [
    "das-pushes",
    "detail",
    orgId,
    pipeline,
    id,
  ],
};
