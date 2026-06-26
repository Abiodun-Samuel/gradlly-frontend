"use client";

import { BarChart3 } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useLevyUtilisation } from "@/features/reporting/queries/reporting.query";
import { cn } from "@/utils/helper";

function formatCurrency(amount, currency = "GBP") {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function StatTile({ label, value, className }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-neutral-200 bg-white px-4 py-3",
        className,
      )}
    >
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">
        {value}
      </p>
    </div>
  );
}

export function LevyUtilisationView() {
  const { data, isLoading } = useLevyUtilisation();

  if (isLoading) {
    return (
      <p className="text-sm text-neutral-400">Loading levy utilisation…</p>
    );
  }

  if (!data) {
    return (
      <p className="text-sm text-neutral-500">
        Levy utilisation data is not available for your organisation.
      </p>
    );
  }

  const currency = data.segments?.currency ?? "GBP";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">
          Levy utilisation
        </h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          12-month levy spend, segments, and forecast.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label="Used"
          value={formatCurrency(data.segments?.used, currency)}
        />
        <StatTile
          label="Expiring (90d)"
          value={formatCurrency(data.segments?.expiringWithin90Days, currency)}
        />
        <StatTile
          label="Available"
          value={formatCurrency(data.segments?.available, currency)}
        />
        <StatTile
          label="Active apprentices"
          value={data.forecast?.activeEnrolmentCount ?? "—"}
        />
      </div>

      {data.monthlySeries?.length ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-primary-600" aria-hidden />
              <h3 className="text-sm font-semibold text-neutral-900">
                Monthly contributions vs spend
              </h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 text-left text-xs text-neutral-500">
                    <th className="pb-2 pr-4 font-medium">Month</th>
                    <th className="pb-2 pr-4 font-medium">Contributions</th>
                    <th className="pb-2 font-medium">Spend</th>
                  </tr>
                </thead>
                <tbody>
                  {data.monthlySeries.map((row) => (
                    <tr key={row.month} className="border-b border-neutral-100">
                      <td className="py-2 pr-4 font-mono text-neutral-700">
                        {row.month}
                      </td>
                      <td className="py-2 pr-4 tabular-nums text-neutral-700">
                        {formatCurrency(row.contributions, currency)}
                      </td>
                      <td className="py-2 tabular-nums text-neutral-700">
                        {formatCurrency(row.spend, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {data.costPerApprentice?.length ? (
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-neutral-900">
              Cost per apprentice
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.costPerApprentice.map((row) => (
                <div
                  key={row.groupId}
                  className="flex items-center justify-between gap-3 rounded-lg border border-neutral-100 px-3 py-2 text-sm"
                >
                  <span className="truncate font-medium text-neutral-800">
                    {row.label}
                  </span>
                  <span className="shrink-0 tabular-nums text-neutral-600">
                    {formatCurrency(row.averageCost, currency)} ·{" "}
                    {row.apprenticeCount} apprentices
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
