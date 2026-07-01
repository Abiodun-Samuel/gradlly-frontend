export const LEVY_EXCHANGE_PATHS = {
  ELIGIBILITY_CHECK: "/api/v1/levy-exchange/eligibility/check",
  DONOR_LINKS: "/api/v1/levy-exchange/donor-links",
  donorLinkById: (id) => `/api/v1/levy-exchange/donor-links/${id}`,
  SURPLUS: "/api/v1/levy-exchange/surplus",
  MATCHES_SEARCH: "/api/v1/levy-exchange/matches/search",
  MATCH_APPLICATIONS: "/api/v1/levy-exchange/match-applications",
  matchApplicationById: (id) =>
    `/api/v1/levy-exchange/match-applications/${id}`,
  TRANSFERS: "/api/v1/levy-exchange/transfers",
  transferById: (id) => `/api/v1/levy-exchange/transfers/${id}`,
  TRANSFER_PREFERENCES: "/api/v1/levy-exchange/transfer-preferences",
};

export const EMPLOYEE_COUNT_BANDS = [
  { value: "1_9", text: "1–9 employees" },
  { value: "10_49", text: "10–49 employees" },
  { value: "50_249", text: "50–249 employees" },
];

export const ELIGIBILITY_SECTORS = [
  { value: "construction", text: "Construction" },
  { value: "healthcare", text: "Healthcare" },
  { value: "manufacturing", text: "Manufacturing" },
  { value: "retail", text: "Retail" },
  { value: "technology", text: "Technology" },
];

export const ELIGIBILITY_REGIONS = [
  { value: "north_west", text: "North West" },
  { value: "london", text: "London" },
  { value: "south_east", text: "South East" },
  { value: "midlands", text: "Midlands" },
  { value: "scotland", text: "Scotland" },
];
