"use client";

import { Download, Eye, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { InputField } from "@/components/form/InputField";
import { SingleSelectField } from "@/components/form/SingleSelectField";
import Button from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { cn, formatDate, formatDateTime } from "@/utils/helper";

import { LearnerStatusBadge } from "./LearnerBadges";
import {
  COHORT_SORT_KEYS,
  LEARNER_STATUS_FILTER_OPTIONS,
  LEARNER_STATUS_LABELS,
} from "../constants";
import { useCohort } from "../queries/learners.query";

// ─── CSV export (client-side from the loaded rows) ───────────────────────────
// The backend also serves ?format=csv, but the JSON rows carry every column the
// CSV needs, so we build it in-browser — no proxy/file-stream plumbing required.
const CSV_COLUMNS = [
  ["learnerName", "Learner"],
  ["employerName", "Employer"],
  ["standardTitle", "Standard"],
  ["startDate", "Start date"],
  ["otjPercent", "OTJ %"],
  ["nextReviewDate", "Next review"],
  ["epaDate", "EPA date"],
  ["statusBadge", "Status"],
  ["tutorName", "Tutor"],
];

function csvCell(value) {
  if (value === null || value === undefined) return "";
  const s = String(value);
  // Quote if it contains a comma, quote, or newline; escape inner quotes.
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function exportCsv(rows) {
  const header = CSV_COLUMNS.map(([, label]) => csvCell(label)).join(",");
  const body = rows
    .map((row) =>
      CSV_COLUMNS.map(([key]) => {
        if (key === "statusBadge") {
          return csvCell(LEARNER_STATUS_LABELS[row[key]] ?? row[key]);
        }
        return csvCell(row[key]);
      }).join(","),
    )
    .join("\n");

  const blob = new Blob([`${header}\n${body}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `learner-cohort-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ─── Cells ────────────────────────────────────────────────────────────────────
function LearnerCell({ entry }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 ring-1 ring-primary-100">
        <GraduationCap className="size-4.5" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-neutral-900">
          {entry.learnerName}
        </p>
        <p className="truncate text-xs text-neutral-400">
          {entry.standardTitle}
        </p>
      </div>
    </div>
  );
}

function OtjCell({ percent }) {
  if (percent === null || percent === undefined) {
    return <span className="text-neutral-400">—</span>;
  }
  const pct = Math.round(percent);
  const tone =
    pct >= 80
      ? "text-emerald-600"
      : pct >= 50
        ? "text-amber-600"
        : "text-danger-600";
  return <span className={cn("font-semibold tabular-nums", tone)}>{pct}%</span>;
}

export function CohortTable() {
  const [statusBadge, setStatusBadge] = useState("");
  const [epaMonth, setEpaMonth] = useState("");
  const [sort, setSort] = useState({
    sortBy: COHORT_SORT_KEYS.LEARNER_NAME,
    sortOrder: "asc",
  });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const params = useMemo(
    () => ({
      page,
      perPage,
      statusBadge: statusBadge || undefined,
      epaMonth: epaMonth || undefined,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    }),
    [page, perPage, statusBadge, epaMonth, sort],
  );

  const { data, isLoading, isFetching } = useCohort(params);
  const entries = data?.entries ?? [];
  const meta = data?.meta ?? null;

  const changePerPage = (next) => {
    setPerPage(next);
    setPage(1);
  };

  // Sort is server-side (via the sortBy/sortOrder controls below), so the table
  // columns themselves are not client-sortable — the data arrives pre-sorted.
  const columns = [
    {
      key: "learnerName",
      header: "Learner",
      primary: true,
      cell: (row) => <LearnerCell entry={row} />,
    },
    {
      key: "employerName",
      header: "Employer",
      mobileLabel: "Employer",
      cell: (row) => (
        <span className="text-neutral-600">{row.employerName || "—"}</span>
      ),
    },
    {
      key: "otjPercent",
      header: "OTJ",
      mobileLabel: "OTJ",
      cell: (row) => <OtjCell percent={row.otjPercent} />,
    },
    {
      key: "nextReviewDate",
      header: "Next review",
      mobileLabel: "Next review",
      cell: (row) => (
        <span className="text-neutral-600">
          {row.nextReviewDate ? formatDateTime(row.nextReviewDate) : "—"}
        </span>
      ),
    },
    {
      key: "epaDate",
      header: "EPA",
      mobileLabel: "EPA date",
      cell: (row) => (
        <span className="text-neutral-600">
          {row.epaDate ? formatDate(row.epaDate) : "—"}
        </span>
      ),
    },
    {
      key: "statusBadge",
      header: "Status",
      mobileLabel: "Status",
      cell: (row) => <LearnerStatusBadge status={row.statusBadge} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      mobileLabel: "Actions",
      cell: (row) => (
        <Link
          href={`/learners/${row.enrolmentId}`}
          title="View learner"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <Eye className="size-3.5" aria-hidden />
          View
        </Link>
      ),
    },
  ];

  // Sort dropdown options (server-side).
  const sortOptions = [
    { value: COHORT_SORT_KEYS.LEARNER_NAME, text: "Learner name" },
    { value: COHORT_SORT_KEYS.EMPLOYER_NAME, text: "Employer" },
    { value: COHORT_SORT_KEYS.STANDARD_TITLE, text: "Standard" },
    { value: COHORT_SORT_KEYS.START_DATE, text: "Start date" },
    { value: COHORT_SORT_KEYS.OTJ_PERCENT, text: "OTJ %" },
    { value: COHORT_SORT_KEYS.NEXT_REVIEW_DATE, text: "Next review" },
    { value: COHORT_SORT_KEYS.EPA_DATE, text: "EPA date" },
    { value: COHORT_SORT_KEYS.STATUS_BADGE, text: "Status" },
  ];

  return (
    <div className="space-y-5">
      {/* Filters + export */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="w-full sm:w-48">
            <SingleSelectField
              name="statusFilter"
              label="Status"
              options={LEARNER_STATUS_FILTER_OPTIONS}
              value={statusBadge}
              setValue={(_, v) => {
                setStatusBadge(v);
                setPage(1);
              }}
              placeholder="All statuses"
              searchable={false}
            />
          </div>
          <div className="w-full sm:w-44">
            <InputField
              name="epaMonth"
              label="EPA month"
              type="month"
              value={epaMonth}
              onChange={(e) => {
                setEpaMonth(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="w-full sm:w-48">
            <SingleSelectField
              name="sortBy"
              label="Sort by"
              options={sortOptions}
              value={sort.sortBy}
              setValue={(_, v) => setSort((p) => ({ ...p, sortBy: v }))}
              searchable={false}
            />
          </div>
          <div className="w-full sm:w-32">
            <SingleSelectField
              name="sortOrder"
              label="Order"
              options={[
                { value: "asc", text: "Ascending" },
                { value: "desc", text: "Descending" },
              ]}
              value={sort.sortOrder}
              setValue={(_, v) => setSort((p) => ({ ...p, sortOrder: v }))}
              searchable={false}
            />
          </div>
        </div>

        <Button
          size="sm"
          color="black"
          variant="neutral"
          startIcon={<Download className="size-4" />}
          disabled={entries.length === 0}
          onClick={() => exportCsv(entries)}
        >
          Export CSV
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={entries}
        rowKey={(row) => row.enrolmentId}
        isLoading={isLoading}
        meta={meta}
        onPageChange={setPage}
        onPerPageChange={changePerPage}
        empty={{
          icon: GraduationCap,
          title: "No learners",
          description: "Active learners appear here once enrolments exist.",
        }}
        className={cn(
          isFetching && !isLoading && "opacity-70 transition-opacity",
        )}
      />
    </div>
  );
}
