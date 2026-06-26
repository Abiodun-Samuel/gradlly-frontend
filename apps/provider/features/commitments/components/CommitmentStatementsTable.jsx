"use client";

import { ClipboardList } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/ui/DataTable";
import TextBadge from "@/components/ui/TextBadge";
import { useCommitmentStatements } from "@/features/reporting/queries/commitments.query";
import { cn } from "@/utils/helper";

function CommitmentStatusBadge({ status }) {
  const colorMap = {
    draft: "gray",
    submitted: "blue",
    awaiting_signatures: "amber",
    signed: "green",
    superseded: "gray",
    cancelled: "red",
  };
  const label = status?.replace(/_/g, " ") ?? "Unknown";

  return (
    <TextBadge variant="light" color={colorMap[status] ?? "gray"} size="xs">
      {label}
    </TextBadge>
  );
}

export function CommitmentStatementsTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const { data, isLoading, isFetching } = useCommitmentStatements({
    page,
    perPage,
  });
  const statements = data?.statements ?? [];
  const meta = data?.meta ?? null;

  const handlePerPageChange = (next) => {
    setPerPage(next);
    setPage(1);
  };

  const columns = [
    {
      key: "version",
      header: "Statement",
      primary: true,
      sortable: true,
      sortValue: (row) => row.version ?? 0,
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-neutral-900">
            Version {row.version ?? "—"}
          </p>
          <p className="truncate text-xs text-neutral-400">
            {row.enrolmentId?.slice(0, 8) ?? "—"}…
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (row) => row.status ?? "",
      cell: (row) => <CommitmentStatusBadge status={row.status} />,
    },
    {
      key: "publishedAt",
      header: "Published",
      sortable: true,
      sortValue: (row) => row.publishedAt ?? "",
      cell: (row) => (
        <span className="text-sm text-neutral-600">
          {row.publishedAt
            ? new Date(row.publishedAt).toLocaleDateString("en-GB")
            : "—"}
        </span>
      ),
    },
    {
      key: "apprenticeId",
      header: "Apprentice",
      cell: (row) => (
        <span className="font-mono text-xs text-neutral-500">
          {row.apprenticeId?.slice(0, 8) ?? "—"}…
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">
          Commitment statements
        </h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          Apprenticeship commitment statements across your cohort.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={statements}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        meta={meta}
        onPageChange={setPage}
        onPerPageChange={handlePerPageChange}
        empty={{
          icon: ClipboardList,
          title: "No commitment statements",
          description: "Commitment statements will appear here once created.",
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />
    </div>
  );
}
