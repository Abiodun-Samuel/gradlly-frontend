"use client";

import { FileText, Grid3x3 } from "lucide-react";
import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import TextBadge from "@/components/ui/TextBadge";
import { useLearnerSummary } from "@/features/reporting/queries/reporting.query";
import { cn, formatDate } from "@/utils/helper";

import { EVIDENCE_STATUS_LABELS, HEATMAP_STRENGTH_LABELS } from "../constants";
import { useEvidenceItems, useKsbHeatmap } from "../queries/portfolio.query";

const STRENGTH_COLORS = {
  none: "gray",
  weak: "red",
  adequate: "amber",
  strong: "green",
};

export function PortfolioView() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const { data: summary } = useLearnerSummary();
  const enrolmentId = summary?.activeEnrolmentId ?? null;

  const { data, isLoading, isFetching } = useEvidenceItems({ page, perPage });
  const items = data?.items ?? [];
  const meta = data?.meta ?? null;

  const { data: heatmap, isLoading: heatmapLoading } = useKsbHeatmap(
    enrolmentId,
    { enabled: !!enrolmentId },
  );

  const heatmapCells = useMemo(() => heatmap?.cells ?? [], [heatmap?.cells]);

  const strengthSummary = useMemo(() => {
    const counts = { none: 0, weak: 0, adequate: 0, strong: 0 };
    for (const cell of heatmapCells) {
      if (counts[cell.strength] !== undefined) counts[cell.strength] += 1;
    }
    return counts;
  }, [heatmapCells]);

  const handlePerPageChange = (next) => {
    setPerPage(next);
    setPage(1);
  };

  const columns = [
    {
      key: "title",
      header: "Evidence",
      primary: true,
      sortable: true,
      sortValue: (row) => row.title ?? "",
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-neutral-900">
            {row.title ?? "Untitled"}
          </p>
          <p className="truncate text-xs text-neutral-400">
            {row.ksbCode ?? row.kind ?? "—"}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (row) => row.status ?? "",
      cell: (row) => (
        <TextBadge variant="light" color="blue" size="xs">
          {EVIDENCE_STATUS_LABELS[row.status] ?? row.status}
        </TextBadge>
      ),
    },
    {
      key: "submittedAt",
      header: "Submitted",
      cell: (row) => (
        <span className="text-sm text-neutral-700">
          {row.submittedAt ? formatDate(row.submittedAt) : "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Grid3x3 className="size-4 text-primary-600" aria-hidden />
            <h2 className="text-base font-semibold text-neutral-900">
              KSB coverage heatmap
            </h2>
          </div>
          <p className="mt-0.5 text-sm text-neutral-500">
            Knowledge, skills and behaviours coverage for your active enrolment.
          </p>
        </CardHeader>
        <CardContent>
          {!enrolmentId ? (
            <p className="text-sm text-neutral-500">
              No active enrolment — heatmap unavailable.
            </p>
          ) : heatmapLoading ? (
            <p className="text-sm text-neutral-400">Loading heatmap…</p>
          ) : heatmapCells.length === 0 ? (
            <p className="text-sm text-neutral-500">
              No KSB coverage data yet. Submit evidence to build your portfolio.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {Object.entries(strengthSummary).map(([strength, count]) => (
                  <TextBadge
                    key={strength}
                    variant="light"
                    color={STRENGTH_COLORS[strength] ?? "gray"}
                    size="xs"
                  >
                    {HEATMAP_STRENGTH_LABELS[strength]}: {count}
                  </TextBadge>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {heatmapCells.map((cell) => (
                  <div
                    key={cell.ksbDefinitionId}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-xs",
                      cell.strength === "strong" &&
                        "border-success-200 bg-success-50",
                      cell.strength === "adequate" &&
                        "border-warning-200 bg-warning-50",
                      cell.strength === "weak" &&
                        "border-danger-200 bg-danger-50",
                      cell.strength === "none" &&
                        "border-neutral-200 bg-neutral-50",
                    )}
                  >
                    <p className="font-mono font-semibold text-neutral-800">
                      {cell.code}
                    </p>
                    <p className="mt-0.5 truncate text-neutral-600">
                      {cell.title}
                    </p>
                    <p className="mt-1 text-neutral-500">
                      {cell.evidenceCount} evidence ·{" "}
                      {HEATMAP_STRENGTH_LABELS[cell.strength] ?? cell.strength}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-5">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            Portfolio evidence
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500">
            KSB evidence items submitted for review.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={items}
          rowKey={(row) => row.id}
          isLoading={isLoading}
          meta={meta}
          onPageChange={setPage}
          onPerPageChange={handlePerPageChange}
          empty={{
            icon: FileText,
            title: "No evidence items",
            description: "Your portfolio evidence will appear here.",
          }}
          className={cn(
            isFetching && !isLoading && "opacity-70 transition-opacity",
          )}
        />
      </div>
    </div>
  );
}
