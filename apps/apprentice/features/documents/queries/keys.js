export const DOCUMENT_QUERY_KEYS = {
  all: () => ["documents"],
  myDocuments: (orgId, enrolmentId) => [
    "documents",
    "my",
    orgId,
    enrolmentId ?? "all",
  ],
};
