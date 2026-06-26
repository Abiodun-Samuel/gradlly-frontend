"use client";

import { BarChart3 } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import TextBadge from "@/components/ui/TextBadge";
import { useProviderDashboard } from "@/features/reporting/queries/reporting.query";
import { cn } from "@/utils/helper";

function SummaryMetric({ label, value, isLoading }) {
  return (
    <Card>
      <CardContent className="py-5">
        <p className="text-3xl font-bold tabular-nums tracking-tight text-neutral-900">
          {isLoading ? "—" : (value ?? "—")}
        </p>
        <p className="mt-1 text-sm font-medium text-neutral-500">{label}</p>
      </CardContent>
    </Card>
  );
}

export function ReportsSummary() {
  const { data: summary, isLoading } = useProviderDashboard();

  const metrics = [
    {
      id: "cohort",
      label: "Active learners",
      value: summary?.cohortCount ?? null,
    },
    {
      id: "atRisk",
      label: "At-risk learners",
      value: summary?.atRiskCount ?? null,
    },
    {
      id: "ilr",
      label: "ILR pending",
      value: summary?.ilrPendingCount ?? null,
    },
    {
      id: "eif",
      label: "EIF readiness",
      value:
        summary?.eifOverallPercent !== null &&
        summary?.eifOverallPercent !== undefined
          ? `${summary.eifOverallPercent}%`
          : null,
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">
          Provider reports
        </h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          High-level delivery and compliance metrics for your organisation.
        </p>
      </div>

      <div
        className={cn(
          "grid grid-cols-2 gap-4 lg:grid-cols-4",
          isLoading && "opacity-70",
        )}
      >
        {metrics.map((metric) => (
          <SummaryMetric
            key={metric.id}
            label={metric.label}
            value={metric.value}
            isLoading={isLoading}
          />
        ))}
      </div>

      {summary?.eifOverallRag ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-neutral-500" aria-hidden />
              <h3 className="text-sm font-semibold text-neutral-900">
                EIF overall RAG
              </h3>
              <TextBadge
                variant="light"
                color={
                  summary.eifOverallRag === "green"
                    ? "green"
                    : summary.eifOverallRag === "amber"
                      ? "amber"
                      : "red"
                }
                size="xs"
              >
                {summary.eifOverallRag}
              </TextBadge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-600">
              Detailed analytics and exports are available from the Ofsted hub,
              ILR &amp; DAS, and cohort views.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
