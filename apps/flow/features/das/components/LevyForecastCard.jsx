"use client";

import { AlertTriangle, Loader2, TrendingUp } from "lucide-react";
import { useState } from "react";

import { SingleSelectField } from "@/components/form/SingleSelectField";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn } from "@/utils/helper";

import {
  DEFAULT_HORIZON_MONTHS,
  HORIZON_OPTIONS,
  isRunwayLow,
} from "../constants";
import { useLevyForecast } from "../queries/das.query";

function money(value) {
  if (value === null || value === undefined) return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n);
}

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
      <p className="text-xs font-medium text-neutral-400">{label}</p>
      <p className="mt-0.5 text-lg font-bold tabular-nums text-neutral-900">
        {value}
      </p>
      {sub ? <p className="text-xs text-neutral-400">{sub}</p> : null}
    </div>
  );
}

export function LevyForecastCard() {
  const [horizon, setHorizon] = useState(String(DEFAULT_HORIZON_MONTHS));
  const horizonMonths = Number(horizon) || DEFAULT_HORIZON_MONTHS;

  const { data: forecast, isLoading } = useLevyForecast(horizonMonths);

  const runway = forecast?.estimatedRunwayMonths;
  const low = isRunwayLow(runway, horizonMonths);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-neutral-400" aria-hidden />
          <h2 className="text-base font-semibold text-neutral-900">Forecast</h2>
        </div>
        <div className="w-36">
          <SingleSelectField
            name="horizon"
            options={HORIZON_OPTIONS}
            value={horizon}
            setValue={(_, v) => setHorizon(v)}
            searchable={false}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="flex items-center gap-2 text-sm text-neutral-400">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading forecast…
          </p>
        ) : !forecast ? (
          <p className="text-sm text-neutral-400">No forecast available yet.</p>
        ) : (
          <>
            {/* Runway headline */}
            <div
              className={cn(
                "flex items-center justify-between rounded-xl border p-4",
                low
                  ? "border-amber-200 bg-amber-50"
                  : "border-emerald-200 bg-emerald-50/60",
              )}
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Estimated runway
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-2xl font-bold",
                    low ? "text-amber-800" : "text-emerald-800",
                  )}
                >
                  {runway === null || runway === undefined
                    ? "—"
                    : `~${runway} months`}
                </p>
              </div>
              {low ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                  <AlertTriangle className="size-3.5" aria-hidden />
                  Below {horizonMonths}-month horizon
                </span>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat
                label="Active enrolments"
                value={forecast.activeEnrolmentCount ?? 0}
              />
              <Stat
                label="Monthly spend"
                value={money(forecast.projectedMonthlySpend)}
              />
              <Stat
                label="Projected liability"
                value={money(forecast.projectedCompletionLiability)}
                sub={`over ${horizonMonths} months`}
              />
              <Stat
                label="Latest balance"
                value={money(forecast.latestLevyBalance)}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
