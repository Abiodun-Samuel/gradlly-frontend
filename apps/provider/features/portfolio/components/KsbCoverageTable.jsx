"use client";

import { BookOpen } from "lucide-react";
import { useMemo, useState } from "react";

import { DataTable } from "@/components/ui/DataTable";
import TextBadge from "@/components/ui/TextBadge";
import { useCohort } from "@/features/reporting/queries/cohort.query";
import { useKsbHeatmap } from "@/features/reporting/queries/portfolio.query";
import { cn } from "@/utils/helper";

function StrengthBadge({ strength }) {
  const colorMap = {
    none: "gray",
    low: "amber",
    adequate: "green",
  };
  return (
    <TextBadge variant="light" color={colorMap[strength] ?? "gray"} size="xs">
      {strength ?? "—"}
    </TextBadge>
  );
}

function HeatmapDetail({ enrolmentId, learnerName }) {
  const { data, isLoading } = useKsbHeatmap(enrolmentId);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
        <p className="text-sm text-neutral-500">Loading heatmap…</p>
      </div>
    );
  }

  const cells = data?.cells ?? [];

  if (!cells.length) {
    return (
      <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
        <p className="text-sm text-neutral-500">
          No KSB coverage data for {learnerName ?? "this learner"}.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-100">
      <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-2">
        <p className="text-sm font-medium text-neutral-800">
          {learnerName ?? "Learner"} — {cells.length} KSB cells
        </p>
      </div>
      <div className="max-h-64 divide-y divide-neutral-100 overflow-y-auto">
        {cells.map((cell) => (
          <div
            key={cell.ksbDefinitionId}
            className="flex items-center justify-between gap-3 px-4 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm text-neutral-800">
                {cell.title ?? cell.code ?? cell.ksbDefinitionId}
              </p>
              <p className="text-xs capitalize text-neutral-400">
                {cell.kind ?? "ksb"}
              </p>
            </div>
            <StrengthBadge strength={cell.strength} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function KsbCoverageTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [selectedEnrolmentId, setSelectedEnrolmentId] = useState(null);

  const { data, isLoading, isFetching } = useCohort({ page, perPage });
  const rows = useMemo(() => data?.rows ?? [], [data?.rows]);
  const meta = data?.meta ?? null;

  const selectedLearner = useMemo(
    () => rows.find((r) => r.enrolmentId === selectedEnrolmentId),
    [rows, selectedEnrolmentId],
  );

  const handlePerPageChange = (next) => {
    setPerPage(next);
    setPage(1);
  };

  const columns = [
    {
      key: "learnerName",
      header: "Learner",
      primary: true,
      sortable: true,
      sortValue: (row) => row.learnerName ?? "",
      cell: (row) => (
        <button
          type="button"
          onClick={() => setSelectedEnrolmentId(row.enrolmentId)}
          className={cn(
            "min-w-0 text-left",
            selectedEnrolmentId === row.enrolmentId &&
              "font-semibold text-primary-700",
          )}
        >
          <p className="truncate font-medium">{row.learnerName ?? "Unknown"}</p>
          <p className="truncate text-xs text-neutral-400">
            {row.standardTitle ?? "—"}
          </p>
        </button>
      ),
    },
    {
      key: "employerName",
      header: "Employer",
      sortable: true,
      sortValue: (row) => row.employerName ?? "",
      cell: (row) => (
        <span className="text-sm text-neutral-600">
          {row.employerName ?? "—"}
        </span>
      ),
    },
    {
      key: "statusBadge",
      header: "Status",
      sortable: true,
      sortValue: (row) => row.statusBadge ?? "",
      cell: (row) => (
        <span className="text-sm capitalize text-neutral-600">
          {row.statusBadge?.replace(/_/g, " ") ?? "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">
          KSB coverage
        </h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          Select a learner to view their portfolio KSB heatmap.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        rowKey={(row) => row.enrolmentId}
        isLoading={isLoading}
        meta={meta}
        onPageChange={setPage}
        onPerPageChange={handlePerPageChange}
        empty={{
          icon: BookOpen,
          title: "No learners",
          description: "Cohort learners will appear here for KSB coverage.",
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />

      {selectedEnrolmentId ? (
        <HeatmapDetail
          enrolmentId={selectedEnrolmentId}
          learnerName={selectedLearner?.learnerName}
        />
      ) : null}
    </div>
  );
}
