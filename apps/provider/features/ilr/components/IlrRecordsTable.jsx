"use client";

import { FileText } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/ui/DataTable";
import TextBadge from "@/components/ui/TextBadge";
import { useIlrLearnerRecords } from "@/features/reporting/queries/ilr.query";
import { cn } from "@/utils/helper";

function IlrStatusBadge({ status }) {
  const colorMap = {
    draft: "gray",
    validated: "green",
    validation_failed: "red",
  };
  const label = status?.replace(/_/g, " ") ?? "Unknown";

  return (
    <TextBadge variant="light" color={colorMap[status] ?? "gray"} size="xs">
      {label}
    </TextBadge>
  );
}

export function IlrRecordsTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const { data, isLoading, isFetching } = useIlrLearnerRecords({
    page,
    perPage,
  });
  const records = data?.records ?? [];
  const meta = data?.meta ?? null;

  const handlePerPageChange = (next) => {
    setPerPage(next);
    setPage(1);
  };

  const columns = [
    {
      key: "collectionPeriod",
      header: "Collection period",
      primary: true,
      sortable: true,
      sortValue: (row) => row.collectionPeriod ?? "",
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-neutral-900">
            {row.collectionPeriod ?? "—"}
          </p>
          <p className="truncate text-xs text-neutral-400">
            {row.academicYear ?? "—"}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (row) => row.status ?? "",
      cell: (row) => <IlrStatusBadge status={row.status} />,
    },
    {
      key: "enrolmentId",
      header: "Enrolment",
      sortable: true,
      sortValue: (row) => row.enrolmentId ?? "",
      cell: (row) => (
        <span className="font-mono text-xs text-neutral-500">
          {row.enrolmentId?.slice(0, 8) ?? "—"}…
        </span>
      ),
    },
    {
      key: "mappingConfigVersion",
      header: "Mapping",
      cell: (row) => (
        <span className="text-sm text-neutral-600">
          v{row.mappingConfigVersion ?? "—"}
        </span>
      ),
    },
    {
      key: "lastValidatedAt",
      header: "Last validated",
      mobileLabel: "Validated",
      sortable: true,
      sortValue: (row) => row.lastValidatedAt ?? "",
      cell: (row) => (
        <span className="text-sm text-neutral-600">
          {row.lastValidatedAt
            ? new Date(row.lastValidatedAt).toLocaleDateString("en-GB")
            : "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">
          ILR learner records
        </h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          Individual learner records for ILR submission and DAS reconciliation.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={records}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        meta={meta}
        onPageChange={setPage}
        onPerPageChange={handlePerPageChange}
        empty={{
          icon: FileText,
          title: "No ILR records",
          description: "ILR learner records will appear here once built.",
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />
    </div>
  );
}
