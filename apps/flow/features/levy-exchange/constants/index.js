// Levy flow — PUBLIC, pre-account. Only the eligibility check lives here; the
// donor/transfer/match endpoints belong to the employer portal (spec §8), not
// Flow, and were removed from this app.
export const LEVY_EXCHANGE_PATHS = Object.freeze({
  ELIGIBILITY_CHECK: "/api/v1/levy-exchange/eligibility/check",
});

export const EMPLOYEE_COUNT_BANDS = Object.freeze([
  { value: "1_9", text: "1–9 employees" },
  { value: "10_49", text: "10–49 employees" },
  { value: "50_249", text: "50–249 employees" },
  { value: "250_plus", text: "250+ employees" },
]);

export const ELIGIBILITY_SECTORS = Object.freeze([
  { value: "construction", text: "Construction" },
  { value: "healthcare", text: "Healthcare" },
  { value: "manufacturing", text: "Manufacturing" },
  { value: "retail", text: "Retail" },
  { value: "technology", text: "Technology" },
]);

export const ELIGIBILITY_REGIONS = Object.freeze([
  { value: "north_west", text: "North West" },
  { value: "london", text: "London" },
  { value: "south_east", text: "South East" },
  { value: "midlands", text: "Midlands" },
  { value: "scotland", text: "Scotland" },
]);

// LevyEligibilityStatus
export const ELIGIBILITY_STATUS = Object.freeze({
  ELIGIBLE: "eligible",
  NOT_ELIGIBLE: "not_eligible",
  CHECK_WITH_ADVISOR: "check_with_advisor",
});
