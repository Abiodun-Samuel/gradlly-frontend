"use client";

import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

import { SeverityChip } from "./IlrBadges";
import { useIlrValidationReport } from "../queries/ilr.query";

/**
 * Plain-English validation report for a record. Errors block submission; warns
 * are advisory. Only shown once the record has been validated at least once.
 */
export function ValidationReport({ recordId, enabled }) {
  const { data: report, isLoading } = useIlrValidationReport(recordId, {
    enabled,
  });

  if (!enabled) return null;

  if (isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm text-neutral-400">
        <Loader2 className="size-4 animate-spin" aria-hidden />
        Loading report…
      </p>
    );
  }

  if (!report) return null;

  const issues = report.issues ?? [];

  return (
    <div className="space-y-3">
      <div
        className={
          report.isValid
            ? "flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            : "flex items-center gap-2 rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700"
        }
      >
        {report.isValid ? (
          <CheckCircle2 className="size-4 shrink-0" aria-hidden />
        ) : (
          <AlertTriangle className="size-4 shrink-0" aria-hidden />
        )}
        {report.isValid
          ? "No blocking errors — ready to submit."
          : `${report.summary?.errorCount ?? 0} error(s) must be fixed before submitting.`}
        {report.summary?.warnCount
          ? ` ${report.summary.warnCount} warning(s).`
          : ""}
      </div>

      {issues.length ? (
        <ul className="divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200">
          {issues.map((issue, i) => (
            <li
              key={`${issue.code}-${i}`}
              className="flex items-start gap-3 px-4 py-2.5"
            >
              <SeverityChip severity={issue.severity} />
              <div className="min-w-0">
                <p className="text-sm text-neutral-800">{issue.message}</p>
                <p className="text-xs text-neutral-400">
                  {issue.field}
                  {issue.code ? ` · ${issue.code}` : ""}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
