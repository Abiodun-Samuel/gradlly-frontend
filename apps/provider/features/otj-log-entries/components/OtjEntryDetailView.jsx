"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileText,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { GoBackButton } from "@/components/ui/GoBackButton";
import { PageSubheader } from "@/components/ui/PageSubheader";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";
import { useDownloadObject } from "@/features/storage/queries/storage.query";
import { formatDate } from "@/utils/helper";

import { OtjStatusBadge } from "./OtjStatusBadge";
import { RejectOtjModal } from "./RejectOtjModal";
import { OTJ_CATEGORY_LABELS, isActionable } from "../constants";
import {
  useBulkApproveOtj,
  useOtjEntry,
} from "../queries/otj-log-entries.query";

function formatMinutes(mins) {
  const n = Number(mins);
  if (!n || Number.isNaN(n)) return "—";
  const h = Math.floor(n / 60);
  const m = n % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-neutral-700">{value ?? "—"}</p>
    </div>
  );
}

// Resolves one evidence key to a presigned link on demand.
function EvidenceItem({ fileKey }) {
  const { download, isDownloading } = useDownloadObject();
  const name = fileKey.split("/").pop() || "evidence";

  return (
    <button
      type="button"
      onClick={() => download(fileKey)}
      disabled={isDownloading}
      className="flex w-full items-center gap-3 rounded-lg border border-neutral-200 px-3 py-2.5 text-left transition-colors hover:bg-neutral-50 disabled:opacity-60"
    >
      <FileText className="size-4 shrink-0 text-neutral-400" aria-hidden />
      <span className="min-w-0 flex-1 truncate text-sm text-neutral-700">
        {name}
      </span>
      <Download className="size-4 shrink-0 text-neutral-400" aria-hidden />
    </button>
  );
}

export function OtjEntryDetailView({ entryId }) {
  const { can } = useRoleAccess();
  const canReview = can("admin");

  const { data: entry, isLoading, isError } = useOtjEntry(entryId);
  const approve = useBulkApproveOtj();
  const [rejectOpen, setRejectOpen] = useState(false);

  if (isError) {
    return (
      <div className="space-y-4">
        <GoBackButton className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800" />
        <Card>
          <CardContent className="py-10 text-center text-sm text-neutral-500">
            This OTJ log entry could not be found.
          </CardContent>
        </Card>
      </div>
    );
  }

  const files = entry?.evidence?.files ?? [];
  const actionable = isActionable(entry);

  return (
    <div className="space-y-6">
      <GoBackButton className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800" />

      <PageSubheader
        icon={FileText}
        eyebrow="OTJ log entry"
        title={entry?.activityName ?? (isLoading ? "Loading…" : "Entry")}
        description={
          entry
            ? (OTJ_CATEGORY_LABELS[entry.category] ?? entry.category)
            : undefined
        }
        actions={
          canReview && actionable ? (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                color="green"
                loading={approve.isPending}
                disabled={approve.isPending}
                startIcon={<CheckCircle2 className="size-4" />}
                onClick={() => approve.mutate([entry.id])}
              >
                Approve
              </Button>
              <Button
                size="sm"
                color="black"
                variant="neutral"
                startIcon={<XCircle className="size-4" />}
                onClick={() => setRejectOpen(true)}
                className="!text-red-600 hover:!bg-red-50"
              >
                Reject
              </Button>
            </div>
          ) : null
        }
      />

      {entry ? (
        <Card>
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-900">
              Details
            </h2>
            <OtjStatusBadge status={entry.status} />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Field label="Date" value={formatDate(entry.loggedDate)} />
              <Field label="Duration" value={formatMinutes(entry.minutes)} />
              <Field
                label="Activity type"
                value={OTJ_CATEGORY_LABELS[entry.category] ?? entry.category}
              />
              <Field label="Apprentice" value={entry.apprenticeId} />
              <Field label="Enrolment" value={entry.enrolmentId} />
              {entry.paceFlag ? (
                <Field label="Pace flag" value={entry.paceFlag} />
              ) : null}
            </div>

            {entry.note ? (
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                  Note
                </p>
                <p className="mt-0.5 whitespace-pre-wrap text-sm text-neutral-700">
                  {entry.note}
                </p>
              </div>
            ) : null}

            {entry.rejectionReason ? (
              <div className="flex items-start gap-2 rounded-lg border border-danger-200 bg-danger-50 px-4 py-3">
                <AlertTriangle
                  className="mt-0.5 size-4 shrink-0 text-danger-600"
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold text-danger-700">
                    Rejection reason
                  </p>
                  <p className="mt-0.5 text-sm text-danger-700">
                    {entry.rejectionReason}
                  </p>
                </div>
              </div>
            ) : null}

            {files.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                  Evidence
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {files.map((key) => (
                    <EvidenceItem key={key} fileKey={key} />
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {entry ? (
        <RejectOtjModal
          ids={[entry.id]}
          open={rejectOpen}
          onClose={() => setRejectOpen(false)}
        />
      ) : null}
    </div>
  );
}
