"use client";

import { BookOpen } from "lucide-react";
import { useMemo, useState } from "react";

import { DataTable } from "@/components/ui/DataTable";
import { useLearnerSummary } from "@/features/reporting/queries/reporting.query";
import { cn, formatDate } from "@/utils/helper";

import { EnrolmentStatusBadge, PipelineStateBadge } from "./EnrolmentBadges";
import { ENROLMENT_STATUS } from "../constants";
import { useEnrolments } from "../queries/enrolments.query";

export function EnrolmentsTable({ statusFilter } = {}) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const { data: summary } = useLearnerSummary();
  const { data, isLoading, isFetching } = useEnrolments({ page, perPage });

  const enrolments = useMemo(() => {
    const rows = data?.enrolments ?? [];
    if (!statusFilter) return rows;
    return rows.filter((row) => row.status === statusFilter);
  }, [data?.enrolments, statusFilter]);

  const meta = statusFilter ? null : (data?.meta ?? null);

  const handlePerPageChange = (next) => {
    setPerPage(next);
    setPage(1);
  };

  const columns = [
    {
      key: "programme",
      header: "Programme",
      primary: true,
      sortable: true,
      sortValue: (row) => row.id,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100">
            <BookOpen className="size-4.5" strokeWidth={1.75} aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-neutral-900">
              {summary?.programmeTitle && row.id === summary?.activeEnrolmentId
                ? summary.programmeTitle
                : `Enrolment ${row.id.slice(0, 8)}…`}
            </p>
            <p className="truncate text-xs text-neutral-400">
              {row.plannedStartDate && row.plannedEndDate
                ? `${formatDate(row.plannedStartDate)} – ${formatDate(row.plannedEndDate)}`
                : "Dates not set"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (row) => row.status,
      cell: (row) => <EnrolmentStatusBadge status={row.status} />,
    },
    {
      key: "pipelineState",
      header: "Pipeline",
      sortable: true,
      sortValue: (row) => row.pipelineState ?? "",
      cell: (row) => <PipelineStateBadge state={row.pipelineState} />,
    },
    {
      key: "epaDate",
      header: "EPA date",
      cell: (row) => (
        <span className="text-sm text-neutral-700">
          {row.epaDate ? formatDate(row.epaDate) : "—"}
        </span>
      ),
    },
  ];

  const emptyDescription =
    statusFilter === ENROLMENT_STATUS.ACTIVE
      ? "You have no live courses at the moment."
      : "Your enrolled programmes will appear here.";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">
          {statusFilter === ENROLMENT_STATUS.ACTIVE
            ? "Live courses"
            : "My courses"}
        </h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          Programmes you are enrolled on through your training provider.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={enrolments}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        meta={meta}
        onPageChange={setPage}
        onPerPageChange={handlePerPageChange}
        empty={{
          icon: BookOpen,
          title: "No courses found",
          description: emptyDescription,
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />
    </div>
  );
}
