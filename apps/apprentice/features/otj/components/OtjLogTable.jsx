"use client";

import { Clock, Plus, Send } from "lucide-react";
import { useMemo, useState } from "react";

import Button from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import TextBadge from "@/components/ui/TextBadge";
import { useEnrolments } from "@/features/enrolments/queries/enrolments.query";
import { useLearnerSummary } from "@/features/reporting/queries/reporting.query";
import { cn, formatDate } from "@/utils/helper";

import { OTJ_STATUS, OTJ_STATUS_LABELS } from "../constants";
import { OtjLogFormModal } from "./OtjLogFormModal";
import { useOtjLogEntries, useSubmitOtjLogEntry } from "../queries/otj.query";

const STATUS_COLORS = {
  draft: "gray",
  submitted: "amber",
  approved: "green",
  rejected: "red",
};

function formatMinutes(minutes) {
  if (minutes === null || minutes === undefined) return "—";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return mins ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export function OtjLogTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [createOpen, setCreateOpen] = useState(false);
  const [submittingId, setSubmittingId] = useState(null);

  const { data: summary } = useLearnerSummary();
  const { data: enrolmentData } = useEnrolments({ perPage: 20 });
  const activeEnrolment = useMemo(() => {
    const enrolments = enrolmentData?.enrolments ?? [];
    const activeEnrolmentId = summary?.activeEnrolmentId;
    if (activeEnrolmentId) {
      return enrolments.find((e) => e.id === activeEnrolmentId) ?? null;
    }
    return (
      enrolments.find((e) => e.status === "active") ?? enrolments[0] ?? null
    );
  }, [enrolmentData, summary]);

  const { data, isLoading, isFetching } = useOtjLogEntries({ page, perPage });
  const { mutateAsync: submitEntry, isPending: isSubmitting } =
    useSubmitOtjLogEntry();
  const entries = data?.entries ?? [];
  const meta = data?.meta ?? null;

  const handlePerPageChange = (next) => {
    setPerPage(next);
    setPage(1);
  };

  const handleSubmit = async (id) => {
    setSubmittingId(id);
    try {
      await submitEntry(id);
    } finally {
      setSubmittingId(null);
    }
  };

  const columns = [
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
            {row.category?.replace(/_/g, " ") ?? "—"}
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
      sortable: true,
      sortValue: (row) => row.status ?? "",
      cell: (row) => (
        <TextBadge
          variant="light"
          color={STATUS_COLORS[row.status] ?? "gray"}
          size="xs"
        >
          {OTJ_STATUS_LABELS[row.status] ?? row.status}
        </TextBadge>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      hideOnMobile: false,
      cell: (row) =>
        row.status === OTJ_STATUS.DRAFT ? (
          <Button
            size="xs"
            variant="outline"
            color="green"
            startIcon={<Send className="size-3.5" />}
            loading={isSubmitting && submittingId === row.id}
            disabled={isSubmitting && submittingId !== row.id}
            onClick={() => handleSubmit(row.id)}
          >
            Submit
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            OTJ log entries
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500">
            Track your off-the-job training hours and submission status.
          </p>
        </div>
        <Button
          size="sm"
          color="green"
          startIcon={<Plus className="size-4" />}
          onClick={() => setCreateOpen(true)}
          disabled={!activeEnrolment}
        >
          Log activity
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
          title: "No OTJ entries yet",
          description:
            "Log your first off-the-job training session to get started.",
          action: (
            <Button
              size="sm"
              color="green"
              startIcon={<Plus className="size-4" />}
              onClick={() => setCreateOpen(true)}
              disabled={!activeEnrolment}
            >
              Log activity
            </Button>
          ),
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />

      <OtjLogFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        enrolmentId={activeEnrolment?.id ?? summary?.activeEnrolmentId}
        apprenticeId={activeEnrolment?.apprenticeId}
      />
    </div>
  );
}
