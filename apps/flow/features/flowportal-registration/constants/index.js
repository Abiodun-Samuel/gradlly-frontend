export const REGISTRATION_PATHS = {
  SESSIONS: "/api/v1/flowportal-registration/sessions",
  byToken: (token) =>
    `/api/v1/flowportal-registration/sessions/by-token/${token}`,
};

export const REGISTRATION_RESUME_TOKEN_KEY = "flowportal_registration_token";
