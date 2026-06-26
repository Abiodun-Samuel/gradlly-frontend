"use client";

import { ArrowRightLeft } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import TextBadge from "@/components/ui/TextBadge";
import { formatDate } from "@/utils/helper";

import { useMatchApplications } from "../queries/levy-exchange.query";

const STATUS_COLORS = {
  pending: "yellow",
  confirmed: "green",
  rejected: "red",
  withdrawn: "gray",
};

const COLUMNS = [
  {
    key: "id",
    header: "Application",
    primary: true,
    cell: (row) => row.id.slice(0, 8),
  },
  {
    key: "requestedAmount",
    header: "Amount",
    align: "right",
    sortable: true,
    cell: (row) => `£${row.requestedAmount}`,
  },
  {
    key: "matchScore",
    header: "Score",
    align: "right",
    cell: (row) => row.matchScore ?? "—",
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => (
      <TextBadge
        variant="light"
        color={STATUS_COLORS[row.status] ?? "gray"}
        size="xs"
      >
        {row.status}
      </TextBadge>
    ),
  },
  {
    key: "createdAt",
    header: "Submitted",
    cell: (row) => formatDate(row.createdAt),
  },
];

export function MatchApplicationsTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const { data, isLoading } = useMatchApplications({ page, perPage });
  const applications = data?.applications ?? [];
  const meta = data?.meta ?? null;

  return (
    <div className="space-y-4">
      <DataTable
        columns={COLUMNS}
        data={applications}
        isLoading={isLoading}
        rowKey={(row) => row.id}
        empty={{
          icon: ArrowRightLeft,
          title: "No transfer applications",
          description:
            "Confirmed match applications and transfers will appear here.",
        }}
      />
      {meta ? (
        <Pagination
          meta={meta}
          onPageChange={setPage}
          onPerPageChange={(next) => {
            setPerPage(next);
            setPage(1);
          }}
        />
      ) : null}
    </div>
  );
}
