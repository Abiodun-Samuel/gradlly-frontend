"use client";

import { Users } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/ui/DataTable";
import TextBadge from "@/components/ui/TextBadge";
import { useCohort } from "@/features/reporting/queries/cohort.query";
import { cn, formatDate } from "@/utils/helper";

function StatusBadge({ status }) {
  const colorMap = {
    on_track: "green",
    at_risk: "amber",
    off_track: "red",
    completed: "blue",
    withdrawn: "gray",
  };
  const label = status?.replace(/_/g, " ") ?? "Unknown";

  return (
    <TextBadge variant="light" color={colorMap[status] ?? "gray"} size="xs">
      {label}
    </TextBadge>
  );
}

export function CohortTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const { data, isLoading, isFetching } = useCohort({ page, perPage });
  const rows = data?.rows ?? [];
  const meta = data?.meta ?? null;

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
        <div className="min-w-0">
          <p className="truncate font-medium text-neutral-900">
            {row.learnerName ?? "Unknown"}
          </p>
          <p className="truncate text-xs text-neutral-400">
            {row.employerName ?? "No employer"}
          </p>
        </div>
      ),
    },
    {
      key: "standardTitle",
      header: "Standard",
      sortable: true,
      sortValue: (row) => row.standardTitle ?? "",
      cell: (row) => (
        <span className="text-sm text-neutral-700">
          {row.standardTitle ?? "—"}
        </span>
      ),
    },
    {
      key: "startDate",
      header: "Start",
      mobileLabel: "Start date",
      sortable: true,
      sortValue: (row) => row.startDate ?? "",
      cell: (row) => (
        <span className="text-sm text-neutral-600">
          {row.startDate ? formatDate(row.startDate) : "—"}
        </span>
      ),
    },
    {
      key: "otjPercent",
      header: "OTJ %",
      sortable: true,
      sortValue: (row) => row.otjPercent ?? -1,
      cell: (row) => (
        <span className="text-sm tabular-nums text-neutral-700">
          {row.otjPercent !== null && row.otjPercent !== undefined
            ? `${row.otjPercent}%`
            : "—"}
        </span>
      ),
    },
    {
      key: "nextReviewDate",
      header: "Next review",
      mobileLabel: "Next review",
      sortable: true,
      sortValue: (row) => row.nextReviewDate ?? "",
      cell: (row) => (
        <span className="text-sm text-neutral-600">
          {row.nextReviewDate ? formatDate(row.nextReviewDate) : "—"}
        </span>
      ),
    },
    {
      key: "statusBadge",
      header: "Status",
      sortable: true,
      sortValue: (row) => row.statusBadge ?? "",
      cell: (row) => <StatusBadge status={row.statusBadge} />,
    },
    {
      key: "tutorName",
      header: "Tutor",
      sortable: true,
      sortValue: (row) => row.tutorName ?? "",
      cell: (row) => (
        <span className="text-sm text-neutral-600">{row.tutorName ?? "—"}</span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">Cohort</h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          Active learners across employers, standards, and delivery status.
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
          icon: Users,
          title: "No learners in cohort",
          description: "Learners will appear here once enrolments are active.",
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />
    </div>
  );
}
