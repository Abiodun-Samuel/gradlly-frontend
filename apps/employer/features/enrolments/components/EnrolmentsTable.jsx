"use client";

import { ClipboardList } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/ui/DataTable";
import { cn, formatDate } from "@/utils/helper";

import { EnrolmentStatusBadge, PipelineStateBadge } from "./EnrolmentBadges";
import { useEnrolments } from "../queries/enrolments.query";

function resolveApprenticeName(row) {
  return (
    row.apprenticeDisplayName ??
    row.apprenticeUserDisplayName?.replace(/\s*\([^)]*\)\s*$/, "").trim() ??
    null
  );
}

function ApprenticeCell({ name, standardName }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100">
        <ClipboardList className="size-4.5" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-neutral-900">
          {name ?? "Unknown apprentice"}
        </p>
        <p className="truncate text-xs text-neutral-400">
          {standardName ?? "—"}
        </p>
      </div>
    </div>
  );
}

export function EnrolmentsTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const { data, isLoading, isFetching } = useEnrolments({ page, perPage });
  const enrolments = data?.enrolments ?? [];
  const meta = data?.meta ?? null;

  const handlePerPageChange = (next) => {
    setPerPage(next);
    setPage(1);
  };

  const columns = [
    {
      key: "apprentice",
      header: "Apprentice",
      primary: true,
      sortable: true,
      sortValue: (row) => resolveApprenticeName(row) ?? "",
      cell: (row) => (
        <ApprenticeCell
          name={resolveApprenticeName(row)}
          standardName={row.standardDisplayName}
        />
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
      key: "plannedEndDate",
      header: "Planned end",
      cell: (row) => (
        <span className="text-sm text-neutral-700">
          {row.plannedEndDate ? formatDate(row.plannedEndDate) : "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">
          Active apprentices
        </h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          Enrolments linked to your organisation.
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
          icon: ClipboardList,
          title: "No apprentices yet",
          description:
            "Enrolments will appear here once apprentices are linked.",
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />
    </div>
  );
}
