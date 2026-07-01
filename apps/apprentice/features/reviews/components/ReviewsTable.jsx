"use client";

import { CalendarCheck } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/ui/DataTable";
import TextBadge from "@/components/ui/TextBadge";
import { cn, formatDateTime } from "@/utils/helper";

import { useReviews } from "../queries/reviews.query";

function ReviewStatusBadge({ status, isOverdue }) {
  const colorMap = {
    scheduled: "blue",
    in_progress: "purple",
    awaiting_signatures: "amber",
    completed: "green",
    cancelled: "gray",
  };
  const label = status?.replace(/_/g, " ") ?? "Unknown";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <TextBadge variant="light" color={colorMap[status] ?? "gray"} size="xs">
        {label}
      </TextBadge>
      {isOverdue ? (
        <TextBadge variant="light" color="red" size="xs">
          Overdue
        </TextBadge>
      ) : null}
    </div>
  );
}

export function ReviewsTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const { data, isLoading, isFetching } = useReviews({ page, perPage });
  const reviews = data?.reviews ?? [];
  const meta = data?.meta ?? null;

  const handlePerPageChange = (next) => {
    setPerPage(next);
    setPage(1);
  };

  const columns = [
    {
      key: "title",
      header: "Review",
      primary: true,
      sortable: true,
      sortValue: (row) => row.title ?? row.reviewType ?? "",
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-neutral-900">
            {row.title ?? row.reviewType ?? "Review"}
          </p>
          <p className="truncate text-xs text-neutral-400">
            {row.scheduledAt ? formatDateTime(row.scheduledAt) : "—"}
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
        <ReviewStatusBadge status={row.status} isOverdue={row.isOverdue} />
      ),
    },
    {
      key: "daysUntilDue",
      header: "Due in",
      mobileLabel: "Days until due",
      sortable: true,
      sortValue: (row) => row.daysUntilDue ?? 0,
      cell: (row) => (
        <span className="text-sm tabular-nums text-neutral-700">
          {row.daysUntilDue !== null && row.daysUntilDue !== undefined
            ? row.daysUntilDue < 0
              ? `${Math.abs(row.daysUntilDue)}d overdue`
              : `${row.daysUntilDue}d`
            : "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">
          Progress reviews
        </h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          Scheduled and completed reviews for your apprenticeship.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={reviews}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        meta={meta}
        onPageChange={setPage}
        onPerPageChange={handlePerPageChange}
        empty={{
          icon: CalendarCheck,
          title: "No reviews scheduled",
          description: "Reviews will appear here once they are scheduled.",
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />
    </div>
  );
}
