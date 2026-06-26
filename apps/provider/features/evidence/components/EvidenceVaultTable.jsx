"use client";

import { FolderLock } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/ui/DataTable";
import TextBadge from "@/components/ui/TextBadge";
import { useEvidenceItems } from "@/features/reporting/queries/evidence.query";
import { cn } from "@/utils/helper";

function EvidenceStatusBadge({ status }) {
  const colorMap = {
    draft: "gray",
    submitted: "blue",
    under_review: "purple",
    accepted: "green",
    returned: "amber",
  };
  const label = status?.replace(/_/g, " ") ?? "Unknown";

  return (
    <TextBadge variant="light" color={colorMap[status] ?? "gray"} size="xs">
      {label}
    </TextBadge>
  );
}

export function EvidenceVaultTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const { data, isLoading, isFetching } = useEvidenceItems({ page, perPage });
  const items = data?.items ?? [];
  const meta = data?.meta ?? null;

  const handlePerPageChange = (next) => {
    setPerPage(next);
    setPage(1);
  };

  const columns = [
    {
      key: "title",
      header: "Document",
      primary: true,
      sortable: true,
      sortValue: (row) => row.title ?? "",
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-neutral-900">
            {row.title ?? "Untitled"}
          </p>
          <p className="truncate text-xs capitalize text-neutral-400">
            {row.type ?? "evidence"}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (row) => row.status ?? "",
      cell: (row) => <EvidenceStatusBadge status={row.status} />,
    },
    {
      key: "ksbDefinitions",
      header: "KSBs",
      cell: (row) => (
        <span className="text-sm text-neutral-600">
          {row.ksbDefinitions?.length ?? 0}
        </span>
      ),
    },
    {
      key: "enrolmentId",
      header: "Enrolment",
      cell: (row) => (
        <span className="font-mono text-xs text-neutral-500">
          {row.enrolmentId?.slice(0, 8) ?? "—"}…
        </span>
      ),
    },
    {
      key: "acceptedAt",
      header: "Accepted",
      mobileLabel: "Accepted at",
      sortable: true,
      sortValue: (row) => row.acceptedAt ?? "",
      cell: (row) => (
        <span className="text-sm text-neutral-600">
          {row.acceptedAt
            ? new Date(row.acceptedAt).toLocaleDateString("en-GB")
            : "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">
          Evidence vault
        </h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          Portfolio evidence items across your learner cohort.
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
          icon: FolderLock,
          title: "No evidence items",
          description: "Accepted and submitted evidence will appear here.",
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />
    </div>
  );
}
