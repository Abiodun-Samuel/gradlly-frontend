"use client";

import { CheckCheck, Clock } from "lucide-react";
import { useMemo, useState } from "react";

import Button from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import TextBadge from "@/components/ui/TextBadge";
import { useApprentices } from "@/features/enrolments/queries/enrolments.query";
import { cn, formatDate, getFullName } from "@/utils/helper";

import { OTJ_STATUS_LABELS } from "../constants";
import { useBulkApproveOtj, useOtjApprovals } from "../queries/otj.query";

function formatMinutes(minutes) {
  if (minutes === null || minutes === undefined) return "—";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return mins ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export function OtjApprovalsTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [selected, setSelected] = useState(() => new Set());

  const { data, isLoading, isFetching } = useOtjApprovals({ page, perPage });
  const entries = data?.entries ?? [];
  const meta = data?.meta ?? null;

  const { data: apprentices = [] } = useApprentices();
  const apprenticeNameById = useMemo(() => {
    const map = new Map();
    for (const a of apprentices) {
      map.set(a.id, getFullName(a));
    }
    return map;
  }, [apprentices]);

  const { mutateAsync: bulkApprove, isPending } = useBulkApproveOtj();

  const handlePerPageChange = (next) => {
    setPerPage(next);
    setPage(1);
    setSelected(new Set());
  };

  const toggleRow = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === entries.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(entries.map((e) => e.id)));
    }
  };

  const handleApprove = async () => {
    const ids = Array.from(selected);
    if (!ids.length) return;
    await bulkApprove(ids);
    setSelected(new Set());
  };

  const columns = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={entries.length > 0 && selected.size === entries.length}
          onChange={toggleAll}
          aria-label="Select all"
          className="rounded border-neutral-300"
        />
      ),
      cell: (row) => (
        <input
          type="checkbox"
          checked={selected.has(row.id)}
          onChange={() => toggleRow(row.id)}
          aria-label={`Select ${row.activityName}`}
          className="rounded border-neutral-300"
        />
      ),
    },
    {
      key: "activity",
      header: "Activity",
      primary: true,
      sortable: true,
      sortValue: (row) => row.activityName ?? "",
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-neutral-900">
            {row.activityName}
          </p>
          <p className="truncate text-xs text-neutral-400">
            {apprenticeNameById.get(row.apprenticeId) ?? "Unknown apprentice"}
          </p>
        </div>
      ),
    },
    {
      key: "loggedDate",
      header: "Date",
      sortable: true,
      sortValue: (row) => row.loggedDate ?? "",
      cell: (row) => (
        <span className="text-sm text-neutral-700">
          {row.loggedDate ? formatDate(row.loggedDate) : "—"}
        </span>
      ),
    },
    {
      key: "minutes",
      header: "Duration",
      sortable: true,
      sortValue: (row) => row.minutes ?? 0,
      cell: (row) => (
        <span className="text-sm tabular-nums text-neutral-700">
          {formatMinutes(row.minutes)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <TextBadge variant="light" color="amber" size="xs">
          {OTJ_STATUS_LABELS[row.status] ?? row.status}
        </TextBadge>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            OTJ approvals
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500">
            Review and approve submitted off-the-job training entries.
          </p>
        </div>
        <Button
          size="sm"
          color="green"
          disabled={!selected.size || isPending}
          startIcon={<CheckCheck className="size-4" />}
          onClick={handleApprove}
        >
          Approve selected ({selected.size})
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={entries}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        meta={meta}
        onPageChange={setPage}
        onPerPageChange={handlePerPageChange}
        empty={{
          icon: Clock,
          title: "No pending approvals",
          description:
            "Submitted OTJ entries awaiting your approval appear here.",
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />
    </div>
  );
}
