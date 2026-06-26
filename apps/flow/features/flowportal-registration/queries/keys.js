export const REGISTRATION_QUERY_KEYS = {
  all: () => ["flowportal-registration"],
  session: (token) => ["flowportal-registration", "session", token],
};
