export const DAS_QUERY_KEYS = {
  all: () => ["das"],
  levyBalance: (orgId) => ["das", "levy-balance", orgId],
  levyForecast: (orgId, horizonMonths) => [
    "das",
    "levy-forecast",
    orgId,
    horizonMonths,
  ],
  fundingPayments: (orgId, params = {}) => [
    "das",
    "funding-payments",
    orgId,
    params,
  ],
};
