export const INVITATION_QUERY_KEYS = {
  all: () => ["invitations"],
  list: (orgId, page = 1, perPage = 20) => [
    "invitations",
    "list",
    orgId,
    { page, perPage },
  ],
};
