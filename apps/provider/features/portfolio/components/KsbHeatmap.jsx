"use client";

import { Grid3x3, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn } from "@/utils/helper";

import {
  COVERAGE_ASSESSMENT,
  COVERAGE_ASSESSMENT_LABELS,
  KSB_STRENGTH,
} from "../constants";
import {
  useKsbHeatmap,
  useUpsertKsbCoverage,
} from "../queries/portfolio.query";

const STRENGTH_STYLES = {
  [KSB_STRENGTH.NONE]: "bg-neutral-50 border-neutral-200 text-neutral-400",
  [KSB_STRENGTH.LOW]: "bg-amber-50 border-amber-200 text-amber-800",
  [KSB_STRENGTH.ADEQUATE]: "bg-emerald-50 border-emerald-200 text-emerald-800",
};

const STRENGTH_DOT = {
  [KSB_STRENGTH.NONE]: "bg-neutral-300",
  [KSB_STRENGTH.LOW]: "bg-amber-500",
  [KSB_STRENGTH.ADEQUATE]: "bg-emerald-500",
};

function AssessmentToggle({ cell, enrolmentId, disabled }) {
  const { mutate, isPending } = useUpsertKsbCoverage(enrolmentId);
  const current = cell.tutorAssessment;

  const set = (assessment) =>
    mutate({ ksbDefinitionId: cell.ksbDefinitionId, assessment });

  const baseBtn =
    "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors disabled:opacity-50";

  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        disabled={disabled || isPending}
        onClick={() => set(COVERAGE_ASSESSMENT.SUFFICIENT)}
        className={cn(
          baseBtn,
          current === COVERAGE_ASSESSMENT.SUFFICIENT
            ? "bg-emerald-600 text-white"
            : "bg-white text-neutral-500 ring-1 ring-inset ring-neutral-200 hover:bg-neutral-50",
        )}
      >
        {COVERAGE_ASSESSMENT_LABELS.sufficient}
      </button>
      <button
        type="button"
        disabled={disabled || isPending}
        onClick={() => set(COVERAGE_ASSESSMENT.NEEDS_MORE)}
        className={cn(
          baseBtn,
          current === COVERAGE_ASSESSMENT.NEEDS_MORE
            ? "bg-amber-600 text-white"
            : "bg-white text-neutral-500 ring-1 ring-inset ring-neutral-200 hover:bg-neutral-50",
        )}
      >
        {COVERAGE_ASSESSMENT_LABELS.needs_more}
      </button>
    </div>
  );
}

/**
 * Per-enrolment KSB coverage grid. Each cell shows derived strength (from
 * accepted evidence count) and a manual tutor assessment toggle.
 *
 * @param {string}  enrolmentId
 * @param {boolean} canManage    enables the assessment toggle
 */
export function KsbHeatmap({ enrolmentId, canManage = true }) {
  const { data, isLoading } = useKsbHeatmap(enrolmentId);
  const cells = data?.cells ?? [];

  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        <Grid3x3 className="size-4 text-neutral-400" aria-hidden />
        <h2 className="text-base font-semibold text-neutral-900">
          KSB coverage
        </h2>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="flex items-center gap-2 text-sm text-neutral-400">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading heatmap…
          </p>
        ) : cells.length === 0 ? (
          <p className="text-sm text-neutral-400">
            No KSBs defined for this standard yet. Add KSBs to the standard to
            track coverage.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {cells.map((cell) => (
                <div
                  key={cell.ksbDefinitionId}
                  className={cn(
                    "flex flex-col gap-2 rounded-xl border p-3",
                    STRENGTH_STYLES[cell.strength] ??
                      STRENGTH_STYLES[KSB_STRENGTH.NONE],
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm font-bold">
                      {cell.code}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium">
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          STRENGTH_DOT[cell.strength] ??
                            STRENGTH_DOT[KSB_STRENGTH.NONE],
                        )}
                        aria-hidden
                      />
                      {cell.evidenceCount}
                    </span>
                  </div>
                  <p
                    className="line-clamp-2 text-xs text-neutral-600"
                    title={cell.title}
                  >
                    {cell.title}
                  </p>
                  {canManage ? (
                    <AssessmentToggle cell={cell} enrolmentId={enrolmentId} />
                  ) : cell.tutorAssessment ? (
                    <span className="text-[11px] font-medium text-neutral-500">
                      {COVERAGE_ASSESSMENT_LABELS[cell.tutorAssessment]}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-3 text-xs text-neutral-500">
              <span className="font-medium">Strength:</span>
              {Object.entries({
                [KSB_STRENGTH.NONE]: "No evidence",
                [KSB_STRENGTH.LOW]: "Low (1 accepted)",
                [KSB_STRENGTH.ADEQUATE]: "Adequate (2+ accepted)",
              }).map(([key, label]) => (
                <span key={key} className="inline-flex items-center gap-1.5">
                  <span
                    className={cn("size-2 rounded-full", STRENGTH_DOT[key])}
                    aria-hidden
                  />
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
