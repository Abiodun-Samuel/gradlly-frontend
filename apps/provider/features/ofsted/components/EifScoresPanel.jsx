"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import TextBadge from "@/components/ui/TextBadge";
import { useEifScores } from "@/features/reporting/queries/ofsted.query";
import { cn, formatDateTime } from "@/utils/helper";

function RagBadge({ rag }) {
  const colorMap = { red: "red", amber: "amber", green: "green" };
  return (
    <TextBadge variant="light" color={colorMap[rag] ?? "gray"} size="xs">
      {rag ?? "—"}
    </TextBadge>
  );
}

export function EifScoresPanel() {
  const { data, isLoading, isError } = useEifScores();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 animate-pulse rounded-xl bg-neutral-100" />
        <div className="h-64 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-neutral-500">
          Unable to load EIF scores. Upload evidence and complete delivery data
          to generate readiness scores.
        </CardContent>
      </Card>
    );
  }

  const criteria = data.criteria ?? [];

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Overall readiness</p>
              <h2 className="mt-0.5 text-2xl font-bold tabular-nums text-neutral-900">
                {data.overallPercent !== null &&
                data.overallPercent !== undefined
                  ? `${data.overallPercent}%`
                  : "—"}
              </h2>
            </div>
            <RagBadge rag={data.overallRag} />
          </div>
          {data.alertBanner ? (
            <p className="mt-3 rounded-lg bg-warning-50 px-3 py-2 text-sm text-warning-800">
              One or more EIF criteria are below the 75% threshold.
            </p>
          ) : null}
          <p className="mt-2 text-xs text-neutral-400">
            Calculated{" "}
            {data.calculatedAt ? formatDateTime(data.calculatedAt) : "—"}
            {data.cached ? " (cached)" : ""}
          </p>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-neutral-900">
            Criterion scores
          </h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-neutral-100">
            {criteria.map((criterion) => (
              <div
                key={criterion.slug}
                className="flex items-center justify-between gap-4 px-5 py-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-800">
                    {criterion.label}
                  </p>
                  <p className="text-xs text-neutral-400">{criterion.slug}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-semibold tabular-nums text-neutral-900">
                    {criterion.percent}%
                  </span>
                  <RagBadge rag={criterion.rag} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-neutral-500">
        <Link
          href="/ofsted-hub"
          className="font-medium text-primary-700 hover:underline"
        >
          View full Ofsted hub
        </Link>{" "}
        for QIP actions and evidence pack exports.
      </p>
    </div>
  );
}

export function OfstedHubSummary() {
  const { data, isLoading } = useEifScores();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">Ofsted hub</h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          EIF readiness scores and inspection preparation.
        </p>
      </div>

      <Card className={cn(isLoading && "opacity-60")}>
        <CardContent className="flex items-center gap-4 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success-50">
            <ShieldCheck className="h-5 w-5 text-success-700" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-neutral-800">
              Overall EIF readiness
            </p>
            <p className="text-2xl font-bold tabular-nums text-neutral-900">
              {isLoading
                ? "—"
                : data?.overallPercent !== null &&
                    data?.overallPercent !== undefined
                  ? `${data.overallPercent}%`
                  : "—"}
            </p>
          </div>
          {!isLoading && data?.overallRag ? (
            <RagBadge rag={data.overallRag} />
          ) : null}
        </CardContent>
      </Card>

      <Link
        href="/ofsted-hub/eif-scores"
        className="inline-flex text-sm font-medium text-primary-700 hover:underline"
      >
        View detailed EIF scores →
      </Link>
    </div>
  );
}
