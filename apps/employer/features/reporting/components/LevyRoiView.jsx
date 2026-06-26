"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useLevyRoi } from "@/features/reporting/queries/reporting.query";

function formatCurrency(amount, currency = "GBP") {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function LevyRoiView() {
  const { data, isLoading } = useLevyRoi();

  if (isLoading) {
    return <p className="text-sm text-neutral-400">Loading levy ROI report…</p>;
  }

  if (!data) {
    return (
      <p className="text-sm text-neutral-500">
        Levy ROI data is not available for your organisation.
      </p>
    );
  }

  const currency = data.currency ?? "GBP";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">Levy ROI</h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          Return on apprenticeship levy investment.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-neutral-500">Total levy spend</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              {formatCurrency(data.totalLevySpendToDate, currency)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-neutral-500">Available balance</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              {formatCurrency(data.availableBalance, currency)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-neutral-500">Utilisation</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              {data.utilisationPercent !== null &&
              data.utilisationPercent !== undefined
                ? `${Math.round(data.utilisationPercent)}%`
                : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-neutral-500">Active apprentices</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              {data.activeApprenticeCount ?? "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-neutral-900">Forecast</h3>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-neutral-500">Projected monthly spend</p>
            <p className="font-semibold tabular-nums text-neutral-800">
              {formatCurrency(data.forecast?.projectedMonthlySpend, currency)}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Completion liability</p>
            <p className="font-semibold tabular-nums text-neutral-800">
              {formatCurrency(
                data.forecast?.projectedCompletionLiability,
                currency,
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Estimated runway</p>
            <p className="font-semibold tabular-nums text-neutral-800">
              {data.forecast?.estimatedRunwayMonths !== null &&
              data.forecast?.estimatedRunwayMonths !== undefined
                ? `${data.forecast.estimatedRunwayMonths} months`
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">
              Productivity uplift (est.)
            </p>
            <p className="font-semibold tabular-nums text-neutral-800">
              {formatCurrency(data.estimatedProductivityUplift, currency)}
            </p>
          </div>
        </CardContent>
      </Card>

      {data.monthlyContributions?.length ? (
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-neutral-900">
              Monthly contributions
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.monthlyContributions.map((row) => (
                <div
                  key={row.month}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-mono text-neutral-600">
                    {row.month}
                  </span>
                  <span className="tabular-nums text-neutral-800">
                    {formatCurrency(row.amount, currency)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
