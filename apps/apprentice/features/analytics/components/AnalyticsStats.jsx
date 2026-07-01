"use client";

import { BarChart3, CalendarCheck, Clock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/Card";
import { useOtjLogEntries } from "@/features/otj/queries/otj.query";
import { OTJ_PACE_LABELS } from "@/features/reporting/constants";
import { useLearnerSummary } from "@/features/reporting/queries/reporting.query";
import { useReviews } from "@/features/reviews/queries/reviews.query";
import { cn } from "@/utils/helper";

function StatCard({ icon: Icon, label, value, hint, accent }) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="pb-5 pt-5">
        <div className="flex items-start justify-between gap-2">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              accent.bg,
            )}
          >
            <Icon className={cn("h-5 w-5", accent.icon)} aria-hidden />
          </div>
          <span className="mt-0.5 text-right text-[10px] leading-tight text-neutral-400">
            {hint}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold tracking-tight text-neutral-900">
            {value}
          </p>
          <p className="mt-1 text-sm font-medium text-neutral-500">{label}</p>
        </div>
      </CardContent>
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 h-0.5 opacity-60",
          accent.bar,
        )}
      />
    </Card>
  );
}

export function AnalyticsStats() {
  const { data: summary } = useLearnerSummary();
  const { data: otjData } = useOtjLogEntries({ perPage: 100 });
  const { data: reviewData } = useReviews({ perPage: 100 });

  const entries = otjData?.entries ?? [];
  const reviews = reviewData?.reviews ?? [];

  const approvedMinutes = summary?.otjPace?.approvedMinutes ?? 0;
  const approvedHours = Math.round(approvedMinutes / 60);
  const pendingReviews = reviews.filter(
    (r) => r.status !== "completed" && r.status !== "cancelled",
  ).length;
  const submittedOtj = entries.filter((e) => e.status === "submitted").length;
  const alertLabel =
    OTJ_PACE_LABELS[summary?.otjPace?.alertLevel] ??
    summary?.otjPace?.alertLevel ??
    "—";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">
          Learning analytics
        </h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          Snapshot from your OTJ log and progress reviews.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={BarChart3}
          label="OTJ progress"
          value={
            summary?.otjPace?.otjPercent !== null &&
            summary?.otjPace?.otjPercent !== undefined
              ? `${Math.round(summary.otjPace.otjPercent)}%`
              : "—"
          }
          hint="Approved hours"
          accent={{
            bg: "bg-success-50",
            icon: "text-success-700",
            bar: "bg-success-600",
          }}
        />
        <StatCard
          icon={Clock}
          label="Approved OTJ hours"
          value={approvedHours}
          hint={`${submittedOtj} pending approval`}
          accent={{
            bg: "bg-primary-50",
            icon: "text-primary-700",
            bar: "bg-primary-600",
          }}
        />
        <StatCard
          icon={CalendarCheck}
          label="Open reviews"
          value={pendingReviews}
          hint="Scheduled or in progress"
          accent={{
            bg: "bg-warning-50",
            icon: "text-warning-700",
            bar: "bg-warning-600",
          }}
        />
        <StatCard
          icon={BarChart3}
          label="OTJ pace alert"
          value={alertLabel}
          hint="Current pace status"
          accent={{
            bg: "bg-info-50",
            icon: "text-info-700",
            bar: "bg-info-600",
          }}
        />
      </div>
    </div>
  );
}
