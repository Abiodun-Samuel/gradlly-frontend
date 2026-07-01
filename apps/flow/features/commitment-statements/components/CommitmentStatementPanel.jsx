"use client";

import {
  Download,
  FilePlus2,
  FileSignature,
  Loader2,
  Pencil,
  PenTool,
  Send,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { usePdfJob } from "@/features/pdf/queries/pdf.query";
import { PDF_JOB_STATUS } from "@/features/pdf/services/pdf.service";
import { useDownloadObject } from "@/features/storage/queries/storage.query";
import { cn } from "@/utils/helper";

import { CommitmentConfirmModal } from "./CommitmentConfirmModal";
import { CommitmentFormModal } from "./CommitmentFormModal";
import { CommitmentStatusBadge } from "./CommitmentStatusBadge";
import { SignCommitmentModal } from "./SignCommitmentModal";
import {
  COMMITMENT_ACTION,
  COMMITMENT_STATUS,
  PARTY,
  PARTY_LABELS,
  PARTY_ORDER,
  getCommitmentActions,
  isAwaitingPdf,
} from "../constants";
import {
  useCancelCommitmentStatement,
  useEnrolmentCommitment,
  usePublishCommitmentStatement,
} from "../queries/commitment-statements.query";

// ─── Content read view ───────────────────────────────────────────────────────

function ContentField({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </p>
      <p className="mt-0.5 whitespace-pre-wrap text-sm text-neutral-700">
        {value}
      </p>
    </div>
  );
}

// ─── Snapshot PDF waiting strip ──────────────────────────────────────────────

function PdfWaiting({ jobId, onReady }) {
  const { data: job } = usePdfJob(jobId, { enabled: !!jobId });
  const status = job?.status;

  // When the snapshot completes, ask the parent to refetch the statement (its
  // status flips to awaiting_signatures server-side on the first sign call, but
  // a refetch surfaces the completed PDF state promptly).
  useEffect(() => {
    if (status === PDF_JOB_STATUS.COMPLETED) onReady?.();
  }, [status, onReady]);

  if (status === PDF_JOB_STATUS.FAILED) {
    return (
      <div className="rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
        Snapshot PDF generation failed
        {job?.errorMessage ? `: ${job.errorMessage}` : "."} You may need to
        cancel and create a new version.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
      <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
      Generating the snapshot PDF… signing opens automatically once it&apos;s
      ready.
    </div>
  );
}

// ─── Signing progress ────────────────────────────────────────────────────────

function SigningProgress({ nextParty }) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {PARTY_ORDER.map((party) => {
        const isNext = party === nextParty;
        const idx = PARTY_ORDER.indexOf(party);
        const nextIdx = nextParty ? PARTY_ORDER.indexOf(nextParty) : Infinity;
        const done = idx < nextIdx;
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

// ─── Main panel ──────────────────────────────────────────────────────────────

/**
 * Manages the commitment statement for a single enrolment (1:1). Shows the
 * current version, gates lifecycle actions by status, handles the publish →
 * PDF-wait → sign flow, and versioning.
 *
 * @param {object}  enrolment   the parent enrolment (provides ids + apprenticeId)
 * @param {boolean} canManage   owner/admin gate from the page
 */
export function CommitmentStatementPanel({ enrolment, canManage }) {
  const enrolmentId = enrolment?.id;
  const { data, isLoading, refetch } = useEnrolmentCommitment(enrolmentId);
  const statement = data?.current ?? null;

  const publish = usePublishCommitmentStatement();
  const cancel = useCancelCommitmentStatement();
  const { download, isDownloading } = useDownloadObject();

  const [formMode, setFormMode] = useState(null); // "create" | "edit" | "new-version"
  const [confirmAction, setConfirmAction] = useState(null); // publish | cancel
  const [signParty, setSignParty] = useState(null);
  // The next party to sign — seeded to apprentice when awaiting signatures,
  // then advanced from each sign response.
  const [nextParty, setNextParty] = useState(PARTY.APPRENTICE);

  const actions = getCommitmentActions(statement);
  const awaitingSignatures =
    statement?.status === COMMITMENT_STATUS.AWAITING_SIGNATURES;

  const MUTATIONS = {
    [COMMITMENT_ACTION.PUBLISH]: publish,
    [COMMITMENT_ACTION.CANCEL]: cancel,
  };

  const handleSigned = (result) => {
    // Advance the local pointer; null means fully signed.
    setNextParty(result?.nextParty ?? null);
    refetch();
  };

  // ── Empty / loading ──
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 text-sm text-neutral-400">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Loading commitment statement…
        </CardContent>
      </Card>
    );
  }

  if (!statement) {
    return (
      <>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-100">
              <FileSignature className="size-5" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                No commitment statement yet
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Create the tripartite training plan for this enrolment.
              </p>
            </div>
            {canManage ? (
              <Button
                size="sm"
                color="green"
                startIcon={<FileSignature className="size-4" />}
                onClick={() => setFormMode("create")}
              >
                Create statement
              </Button>
            ) : null}
          </CardContent>
        </Card>

        <CommitmentFormModal
          open={formMode === "create"}
          onClose={() => setFormMode(null)}
          mode="create"
          context={{
            enrolmentId,
            apprenticeId: enrolment?.apprenticeId,
          }}
        />
      </>
    );
  }

  const content = statement.content ?? {};

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <FileSignature className="size-4 text-neutral-400" aria-hidden />
            <div>
              <h2 className="text-base font-semibold text-neutral-900">
                Commitment statement
              </h2>
              <p className="mt-0.5 text-xs text-neutral-500">
                Version {statement.version}
              </p>
            </div>
            <CommitmentStatusBadge status={statement.status} />
          </div>

          {canManage ? (
            <div className="flex flex-wrap items-center gap-1.5">
              {actions.edit ? (
                <Button
                  size="xs"
                  color="black"
                  variant="neutral"
                  startIcon={<Pencil className="size-3.5" />}
                  onClick={() => setFormMode("edit")}
                >
                  Edit
                </Button>
              ) : null}
              {actions.publish ? (
                <Button
                  size="xs"
                  color="green"
                  startIcon={<Send className="size-3.5" />}
                  onClick={() => setConfirmAction(COMMITMENT_ACTION.PUBLISH)}
                >
                  Publish
                </Button>
              ) : null}
              {awaitingSignatures && nextParty ? (
                <Button
                  size="xs"
                  color="green"
                  startIcon={<PenTool className="size-3.5" />}
                  onClick={() => setSignParty(nextParty)}
                >
                  Sign as {PARTY_LABELS[nextParty]}
                </Button>
              ) : null}
              {actions.downloadSigned ? (
                <Button
                  size="xs"
                  color="black"
                  variant="neutral"
                  loading={isDownloading}
                  startIcon={<Download className="size-3.5" />}
                  onClick={() => download(statement.finalSignedPdfKey)}
                >
                  Download PDF
                </Button>
              ) : null}
              {actions.newVersion ? (
                <Button
                  size="xs"
                  color="black"
                  variant="neutral"
                  startIcon={<FilePlus2 className="size-3.5" />}
                  onClick={() => setFormMode("new-version")}
                >
                  New version
                </Button>
              ) : null}
              {actions.cancel ? (
                <Button
                  size="xs"
                  color="black"
                  variant="neutral"
                  startIcon={<XCircle className="size-3.5" />}
                  onClick={() => setConfirmAction(COMMITMENT_ACTION.CANCEL)}
                  className="!text-red-600 hover:!bg-red-50"
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          ) : null}
        </CardHeader>

        <CardContent className="space-y-5">
          {/* PDF waiting strip (submitted → awaiting_signatures) */}
          {isAwaitingPdf(statement) && statement.snapshotPdfJobId ? (
            <PdfWaiting jobId={statement.snapshotPdfJobId} onReady={refetch} />
          ) : null}

          {/* Signing progress */}
          {awaitingSignatures ? (
            <div className="space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                Signing progress
              </p>
              <SigningProgress nextParty={nextParty} />
            </div>
          ) : null}

          {/* Content */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <ContentField
                label="Training plan summary"
                value={content.trainingPlanSummary}
              />
            </div>
            <ContentField
              label="Employer commitments"
              value={content.employerCommitments}
            />
            <ContentField
              label="Apprentice commitments"
              value={content.apprenticeCommitments}
            />
            <ContentField
              label="Provider commitments"
              value={content.providerCommitments}
            />
            <ContentField
              label="Additional terms"
              value={content.additionalTerms}
            />
            {content.weeklyHours !== null &&
            content.weeklyHours !== undefined ? (
              <ContentField
                label="Weekly hours"
                value={String(content.weeklyHours)}
              />
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <CommitmentFormModal
        open={formMode === "edit"}
        onClose={() => setFormMode(null)}
        mode="edit"
        statement={statement}
      />
      <CommitmentFormModal
        open={formMode === "new-version"}
        onClose={() => setFormMode(null)}
        mode="new-version"
        statement={statement}
        context={{
          enrolmentId,
          apprenticeId: enrolment?.apprenticeId,
          groupId: statement.groupId,
        }}
      />
      <CommitmentConfirmModal
        action={confirmAction}
        statementId={statement.id}
        mutation={confirmAction ? MUTATIONS[confirmAction] : null}
        open={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
      />
      <SignCommitmentModal
        statement={statement}
        party={signParty}
        open={Boolean(signParty)}
        onClose={() => setSignParty(null)}
        onSigned={handleSigned}
      />
    </>
  );
}
