"use client";

import { Eye, FileSpreadsheet, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { cn } from "@/utils/helper";

import { BuildIlrModal } from "./BuildIlrModal";
import { IlrRecordStatusBadge } from "./IlrBadges";
import { ILR_RECORD_STATUS_FILTER_OPTIONS } from "../constants";
import { useIlrRecords } from "../queries/ilr.query";

function RecordCell({ record }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100">
        <FileSpreadsheet className="size-4.5" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-neutral-900">
          {record.collectionPeriod}
        </p>
        <p className="truncate font-mono text-xs text-neutral-400">
          {record.enrolmentId}
        </p>
      </div>
    </div>
  );
}

export function IlrRecordsTable() {
  const [status, setStatus] = useState("");
  const [collectionPeriod, setCollectionPeriod] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [buildOpen, setBuildOpen] = useState(false);

  const params = useMemo(
    () => ({
      page,
      perPage,
      status: status || undefined,
      collectionPeriod: collectionPeriod || undefined,
    }),
    [page, perPage, status, collectionPeriod],
  );

  const { data, isLoading, isFetching } = useIlrRecords(params);
  const records = data?.records ?? [];
  const meta = data?.meta ?? null;

  const changePerPage = (next) => {
    setPerPage(next);
    setPage(1);
  };

  const columns = [
    {
      key: "collectionPeriod",
      header: "Record",
      primary: true,
      cell: (row) => <RecordCell record={row} />,
    },
    {
      key: "academicYear",
      header: "Academic year",
      mobileLabel: "Academic year",
      cell: (row) => (
        <span className="text-neutral-600">{row.academicYear}</span>
      ),
    },
    {
      key: "validationSummary",
      header: "Validation",
      mobileLabel: "Validation",
      cell: (row) => {
        const s = row.validationSummary;
        if (!s) return <span className="text-neutral-400">—</span>;
        return (
          <span className="text-xs text-neutral-600">
            <span
              className={cn(
                "font-semibold",
                s.errorCount > 0 ? "text-danger-600" : "text-emerald-600",
              )}
            >
              {s.errorCount} err
            </span>{" "}
            · {s.warnCount} warn
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      mobileLabel: "Status",
      cell: (row) => <IlrRecordStatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      mobileLabel: "Actions",
      cell: (row) => (
        <Link
          href={`/ilr/${row.id}`}
          title="Open record"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <Eye className="size-3.5" aria-hidden />
          Open
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="w-full sm:w-48">
            <SingleSelectField
              name="statusFilter"
              label="Status"
              options={ILR_RECORD_STATUS_FILTER_OPTIONS}
              value={status}
              setValue={(_, v) => {
                setStatus(v);
                setPage(1);
              }}
              placeholder="All statuses"
              searchable={false}
            />
          </div>
          <div className="w-full sm:w-44">
            <InputField
              name="collectionPeriod"
              label="Collection period"
              type="month"
              value={collectionPeriod}
              onChange={(e) => {
                setCollectionPeriod(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        <Button
          size="sm"
          color="green"
          startIcon={<Plus className="size-4" />}
          onClick={() => setBuildOpen(true)}
        >
          Build record
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={records}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        meta={meta}
        onPageChange={setPage}
        onPerPageChange={changePerPage}
        empty={{
          icon: FileSpreadsheet,
          title: "No ILR records",
          description:
            "Build an ILR record from an enrolment to start your ESFA return.",
          action: (
            <Button
              size="sm"
              color="green"
              startIcon={<Plus className="size-4" />}
              onClick={() => setBuildOpen(true)}
            >
              Build record
            </Button>
          ),
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />

      <BuildIlrModal open={buildOpen} onClose={() => setBuildOpen(false)} />
    </div>
  );
}
