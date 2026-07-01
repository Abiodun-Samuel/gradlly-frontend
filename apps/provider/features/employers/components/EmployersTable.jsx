"use client";

import { Building2 } from "lucide-react";
import { useState } from "react";

import { DataTable } from "@/components/ui/DataTable";
import TextBadge from "@/components/ui/TextBadge";
import { useEmployerDirectory } from "@/features/reporting/queries/reporting.query";
import { cn } from "@/utils/helper";

function PipelineBadge({ status }) {
  const colorMap = {
    none: "gray",
    draft: "gray",
    submitted: "blue",
    awaiting_signatures: "amber",
    signed: "green",
  };
  const label = status?.replace(/_/g, " ") ?? "Unknown";

  return (
    <TextBadge variant="light" color={colorMap[status] ?? "gray"} size="xs">
      {label}
    </TextBadge>
  );
}

export function EmployersTable() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const { data, isLoading, isFetching } = useEmployerDirectory({
    page,
    perPage,
  });
  const employers = data?.employers ?? [];
  const meta = data?.meta ?? null;

  const handlePerPageChange = (next) => {
    setPerPage(next);
    setPage(1);
  };

  const columns = [
    {
      key: "organisationName",
      header: "Employer",
      primary: true,
      sortable: true,
      sortValue: (row) => row.organisationName ?? "",
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-neutral-900">
            {row.organisationName ?? "Unknown"}
          </p>
          <p className="truncate text-xs text-neutral-400">
            {row.contactEmail ?? "—"}
          </p>
        </div>
      ),
    },
    {
      key: "contactName",
      header: "Contact",
      sortable: true,
      sortValue: (row) => row.contactName ?? "",
      cell: (row) => (
        <span className="text-sm text-neutral-700">
          {row.contactName ?? "—"}
        </span>
      ),
    },
    {
      key: "activeLearnerCount",
      header: "Active learners",
      mobileLabel: "Learners",
      sortable: true,
      sortValue: (row) => row.activeLearnerCount ?? 0,
      cell: (row) => (
        <span className="text-sm tabular-nums text-neutral-700">
          {row.activeLearnerCount ?? 0}
        </span>
      ),
    },
    {
      key: "averageOtjPercent",
      header: "Avg OTJ %",
      sortable: true,
      sortValue: (row) => row.averageOtjPercent ?? -1,
      cell: (row) => (
        <span className="text-sm tabular-nums text-neutral-700">
          {row.averageOtjPercent !== null && row.averageOtjPercent !== undefined
            ? `${row.averageOtjPercent}%`
            : "—"}
        </span>
      ),
    },
    {
      key: "commitmentPipelineStatus",
      header: "Commitments",
      sortable: true,
      sortValue: (row) => row.commitmentPipelineStatus ?? "",
      cell: (row) => <PipelineBadge status={row.commitmentPipelineStatus} />,
    },
    {
      key: "region",
      header: "Region",
      sortable: true,
      sortValue: (row) => row.region ?? "",
      cell: (row) => (
        <span className="text-sm text-neutral-600">{row.region ?? "—"}</span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">
          Employer directory
        </h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          Linked employers with learner counts and commitment pipeline status.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={employers}
        rowKey={(row) => row.employerOrganisationId}
        isLoading={isLoading}
        meta={meta}
        onPageChange={setPage}
        onPerPageChange={handlePerPageChange}
        empty={{
          icon: Building2,
          title: "No linked employers",
          description:
            "Employers appear here when enrolments link to employer organisations.",
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />
    </div>
  );
}
