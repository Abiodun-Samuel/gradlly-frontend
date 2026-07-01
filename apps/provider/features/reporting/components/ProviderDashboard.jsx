"use client";

import {
  AlertTriangle,
  FileSpreadsheet,
  Loader2,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/utils/helper";

import { EIF_RAG, KPI_LINKS } from "../constants";
import { useProviderDashboard } from "../queries/reporting.query";

const RAG_TILE = {
  [EIF_RAG.RED]: "text-danger-600",
  [EIF_RAG.AMBER]: "text-amber-600",
  [EIF_RAG.GREEN]: "text-emerald-600",
};

function KpiTile({ icon: Icon, label, value, href, accent, sub }) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors hover:border-primary-300 hover:bg-primary-50/30"
    >
      <div className="flex items-center justify-between">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 ring-1 ring-primary-100">
          <Icon className="size-4.5" strokeWidth={1.75} aria-hidden />
        </span>
      </div>
      <p
        className={cn(
          "mt-3 text-3xl font-bold tracking-tight tabular-nums",
          accent ?? "text-neutral-900",
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-sm font-medium text-neutral-500 group-hover:text-neutral-700">
        {label}
      </p>
      {sub ? <p className="mt-0.5 text-xs text-neutral-400">{sub}</p> : null}
    </Link>
  );
}

export function ProviderDashboard() {
  const { data, isLoading } = useProviderDashboard();
  const summary = data?.summary;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 text-sm text-neutral-400">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Loading summary…
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-neutral-400">
          No summary data available yet.
        </CardContent>
      </Card>
    );
  }

  const eifValue =
    summary.eifOverallPercent === null ||
    summary.eifOverallPercent === undefined
      ? "—"
      : `${summary.eifOverallPercent}%`;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiTile
        icon={Users}
        label="Active learners"
        value={summary.cohortCount ?? 0}
        href={KPI_LINKS.cohort}
      />
      <KpiTile
        icon={AlertTriangle}
        label="At risk"
        value={summary.atRiskCount ?? 0}
        accent={summary.atRiskCount > 0 ? "text-danger-600" : undefined}
        href={KPI_LINKS.atRisk}
      />
      <KpiTile
        icon={ShieldCheck}
        label="EIF readiness"
        value={eifValue}
        accent={
          summary.eifOverallRag ? RAG_TILE[summary.eifOverallRag] : undefined
        }
        sub={summary.eifOverallRag ? summary.eifOverallRag.toUpperCase() : null}
        href={KPI_LINKS.eif}
      />
      <KpiTile
        icon={FileSpreadsheet}
        label="ILR pending"
        value={summary.ilrPendingCount ?? 0}
        accent={summary.ilrPendingCount > 0 ? "text-amber-600" : undefined}
        sub="drafts to submit"
        href={KPI_LINKS.ilrPending}
      />
    </div>
  );
}
