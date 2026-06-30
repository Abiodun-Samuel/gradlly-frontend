"use client";

import {
  ClipboardList,
  Download,
  FileText,
  Loader2,
  Pencil,
  PenTool,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { GoBackButton } from "@/components/ui/GoBackButton";
import { PageSubheader } from "@/components/ui/PageSubheader";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";
import { usePdfJob } from "@/features/pdf/queries/pdf.query";
import { PDF_JOB_STATUS } from "@/features/pdf/services/pdf.service";
import { useDownloadObject } from "@/features/storage/queries/storage.query";
import { cn, formatDateTime } from "@/utils/helper";

import { CancelReviewModal } from "./CancelReviewModal";
import { ReviewDueChip, ReviewStatusBadge } from "./ReviewBadges";
import { ReviewRecordModal } from "./ReviewRecordModal";
import { ReviewScheduleModal } from "./ReviewScheduleModal";
import { SignReviewModal } from "./SignReviewModal";
import {
  PARTY,
  PARTY_LABELS,
  PARTY_ORDER,
  REVIEW_STATUS,
  getReviewActions,
} from "../constants";
import {
  useEnqueueReviewSnapshot,
  useReview,
  useReviewRecord,
} from "../queries/reviews.query";

// ─── Small pieces ─────────────────────────────────────────────────────────────

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

function SigningProgress({ nextParty }) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {PARTY_ORDER.map((party) => {
        const idx = PARTY_ORDER.indexOf(party);
        const nextIdx = nextParty ? PARTY_ORDER.indexOf(nextParty) : Infinity;
        const done = idx < nextIdx;
        const isNext = party === nextParty;
        return (
          <li
            key={party}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
              done && "bg-emerald-50 text-emerald-700 ring-emerald-200",
              isNext && "bg-amber-50 text-amber-700 ring-amber-200",
              !done &&
                !isNext &&
                "bg-neutral-50 text-neutral-500 ring-neutral-200",
            )}
          >
            {PARTY_LABELS[party]}
            {done ? " ✓" : isNext ? " · next" : ""}
          </li>
        );
      })}
    </ol>
  );
}

function PdfWaiting({ jobId, onReady }) {
  const { data: job } = usePdfJob(jobId, { enabled: !!jobId });
  const status = job?.status;

  useEffect(() => {
    if (status === PDF_JOB_STATUS.COMPLETED) onReady?.();
  }, [status, onReady]);

  if (status === PDF_JOB_STATUS.FAILED) {
    return (
      <div className="rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
        Snapshot PDF generation failed
        {job?.errorMessage ? `: ${job.errorMessage}` : "."}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
      <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
      Generating the snapshot PDF… signing opens once it&apos;s ready.
    </div>
  );
}

// Render the saved record payload read-only.
function RecordView({ payload }) {
  if (!payload) {
    return (
      <p className="text-sm text-neutral-400">
        No record yet. Add SMART goals and meeting notes to begin.
      </p>
    );
  }
  const goals = payload.smartGoals ?? [];
  return (
    <div className="space-y-5">
      {goals.length ? (
        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
            SMART goals
          </p>
          {goals.map((g, i) => (
            <div
              key={i}
              className="rounded-lg border border-neutral-200 p-3 text-sm"
            >
              <p className="font-medium text-neutral-900">{g.objective}</p>
              <dl className="mt-2 grid grid-cols-1 gap-1 text-xs text-neutral-600 sm:grid-cols-2">
                <div>
                  <dt className="inline font-semibold">Measurable: </dt>
                  <dd className="inline">{g.measurable}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold">Achievable: </dt>
                  <dd className="inline">{g.achievable}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold">Relevant: </dt>
                  <dd className="inline">{g.relevant}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold">Time-bound: </dt>
                  <dd className="inline">{g.timeBound}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {payload.wellbeing?.score !== null &&
        payload.wellbeing?.score !== undefined ? (
          <Field
            label="Wellbeing score"
            value={`${payload.wellbeing.score} / 10`}
          />
        ) : null}
        {payload.wellbeing?.notes ? (
          <Field label="Wellbeing notes" value={payload.wellbeing.notes} />
        ) : null}
      </div>
      {payload.progressSummary ? (
        <Field label="Progress summary" value={payload.progressSummary} />
      ) : null}
      {payload.actionsAgreed ? (
        <Field label="Actions agreed" value={payload.actionsAgreed} />
      ) : null}
      {payload.employerComments ? (
        <Field label="Employer comments" value={payload.employerComments} />
      ) : null}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ReviewDetailView({ reviewId }) {
  const { can } = useRoleAccess();
  const canManage = can("admin");

  const { data: review, isError } = useReview(reviewId);
  const { data: record } = useReviewRecord(reviewId);
  const snapshot = useEnqueueReviewSnapshot();
  const { download, isDownloading } = useDownloadObject();

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [recordOpen, setRecordOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [signParty, setSignParty] = useState(null);
  const [nextParty, setNextParty] = useState(PARTY.APPRENTICE);

  const actions = getReviewActions(review);
  const awaitingSignatures =
    review?.status === REVIEW_STATUS.AWAITING_SIGNATURES;
  const snapshotPending =
    review?.snapshotPdfJobId &&
    review?.status !== REVIEW_STATUS.AWAITING_SIGNATURES &&
    review?.status !== REVIEW_STATUS.COMPLETED;

  const handleSigned = (result) => setNextParty(result?.nextParty ?? null);

  if (isError) {
    return (
      <div className="space-y-4">
        <GoBackButton className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800" />
        <Card>
          <CardContent className="py-10 text-center text-sm text-neutral-500">
            This review could not be found.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GoBackButton className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800" />

      <PageSubheader
        icon={ClipboardList}
        eyebrow="Progress review"
        title={review?.title || "Progress review"}
        description={review ? formatDateTime(review.scheduledAt) : undefined}
        actions={
          canManage && review ? (
            <div className="flex flex-wrap items-center gap-2">
              {actions.edit ? (
                <Button
                  size="sm"
                  color="black"
                  variant="neutral"
                  startIcon={<Pencil className="size-4" />}
                  onClick={() => setScheduleOpen(true)}
                >
                  Reschedule
                </Button>
              ) : null}
              {actions.editRecord ? (
                <Button
                  size="sm"
                  color="green"
                  startIcon={<ClipboardList className="size-4" />}
                  onClick={() => setRecordOpen(true)}
                >
                  {record ? "Edit record" : "Add record"}
                </Button>
              ) : null}
              {awaitingSignatures && nextParty ? (
                <Button
                  size="sm"
                  color="green"
                  startIcon={<PenTool className="size-4" />}
                  onClick={() => setSignParty(nextParty)}
                >
                  Sign as {PARTY_LABELS[nextParty]}
                </Button>
              ) : null}
              {actions.downloadSigned ? (
                <Button
                  size="sm"
                  color="black"
                  variant="neutral"
                  loading={isDownloading}
                  startIcon={<Download className="size-4" />}
                  onClick={() => download(review.finalSignedPdfKey)}
                >
                  Download PDF
                </Button>
              ) : null}
              {actions.cancel ? (
                <Button
                  size="sm"
                  color="black"
                  variant="neutral"
                  startIcon={<XCircle className="size-4" />}
                  onClick={() => setCancelOpen(true)}
                  className="!text-red-600 hover:!bg-red-50"
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          ) : null
        }
      />

      {review ? (
        <>
          {/* Summary */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-neutral-900">
                Summary
              </h2>
              <div className="flex items-center gap-2">
                <ReviewDueChip review={review} />
                <ReviewStatusBadge status={review.status} />
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Field
                label="Scheduled"
                value={formatDateTime(review.scheduledAt)}
              />
              <Field label="Type" value={review.reviewType || "—"} />
              <Field label="Apprentice" value={review.apprenticeId} />
              <Field label="Enrolment" value={review.enrolmentId} />
            </CardContent>
          </Card>

          {/* PDF + signing */}
          {snapshotPending ? (
            <PdfWaiting jobId={review.snapshotPdfJobId} />
          ) : null}

          {awaitingSignatures ? (
            <Card>
              <CardHeader>
                <h2 className="text-base font-semibold text-neutral-900">
                  Signatures
                </h2>
              </CardHeader>
              <CardContent>
                <SigningProgress nextParty={nextParty} />
              </CardContent>
            </Card>
          ) : null}

          {/* Record */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-neutral-400" aria-hidden />
                <h2 className="text-base font-semibold text-neutral-900">
                  Record
                </h2>
              </div>
              {canManage && actions.editRecord ? (
                <Button
                  size="xs"
                  color="black"
                  variant="neutral"
                  startIcon={<Pencil className="size-3.5" />}
                  onClick={() => setRecordOpen(true)}
                >
                  {record ? "Edit" : "Add"}
                </Button>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-4">
              <RecordView payload={record?.payload} />

              {/* Generate snapshot once a record exists and not yet signing */}
              {canManage && actions.snapshot && record?.payload ? (
                <div className="border-t border-neutral-100 pt-4">
                  <Button
                    size="sm"
                    color="black"
                    variant="neutral"
                    loading={snapshot.isPending}
                    disabled={snapshot.isPending}
                    startIcon={<FileText className="size-4" />}
                    onClick={() => snapshot.mutate(review.id)}
                  >
                    {review.snapshotPdfJobId
                      ? "Regenerate snapshot PDF"
                      : "Generate snapshot PDF"}
                  </Button>
                  <p className="mt-1.5 text-xs text-neutral-400">
                    A snapshot PDF must be generated before the parties can
                    sign.
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Modals */}
          <ReviewScheduleModal
            open={scheduleOpen}
            onClose={() => setScheduleOpen(false)}
            review={review}
          />
          <ReviewRecordModal
            reviewId={review.id}
            record={record?.payload ?? null}
            open={recordOpen}
            onClose={() => setRecordOpen(false)}
          />
          <CancelReviewModal
            review={review}
            open={cancelOpen}
            onClose={() => setCancelOpen(false)}
          />
          <SignReviewModal
            review={review}
            party={signParty}
            open={Boolean(signParty)}
            onClose={() => setSignParty(null)}
            onSigned={handleSigned}
          />
        </>
      ) : (
        <Card>
          <CardContent className="flex items-center gap-2 text-sm text-neutral-400">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading review…
          </CardContent>
        </Card>
      )}
    </div>
  );
}
