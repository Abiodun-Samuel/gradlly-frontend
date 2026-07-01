"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { IlrSubmissionStatusBadge } from "./IlrBadges";
import { ILR_SUBMISSION_STATUS, isSubmissionInFlight } from "../constants";
import { useIlrSubmission } from "../queries/ilr.query";

/**
 * Polls a live submission (from a submit/amend response) until terminal, and
 * renders its progress / ESFA receipt / failure.
 *
 * @param {string} submissionId
 */
export function SubmissionTracker({ submissionId }) {
  const { data: submission } = useIlrSubmission(submissionId, {
    enabled: !!submissionId,
  });

  if (!submission) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
        <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
        Queuing submission…
      </div>
    );
  }

  const inFlight = isSubmissionInFlight(submission);
  const submitted = submission.status === ILR_SUBMISSION_STATUS.SUBMITTED;
  const failed = submission.status === ILR_SUBMISSION_STATUS.FAILED;

  return (
    <div className="space-y-3 rounded-xl border border-neutral-200 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-900">
          {submission.isAmendment ? "Amendment" : "Submission"} · attempt{" "}
          {submission.attempt}
        </p>
        <IlrSubmissionStatusBadge status={submission.status} />
      </div>

      {inFlight ? (
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
          Sending to the ESFA… this updates automatically.
        </div>
      ) : null}

      {submitted ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <CheckCircle2 className="size-4 shrink-0" aria-hidden />
            Accepted by the ESFA.
          </div>
          {submission.esfaReference ? (
            <div className="rounded-lg bg-neutral-50 px-3 py-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                ESFA reference
              </p>
              <p className="mt-0.5 font-mono text-sm text-neutral-700">
                {submission.esfaReference}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {failed ? (
        <div className="flex items-start gap-2 rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-sm text-danger-700">
          <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            Submission failed
            {submission.lastError ? `: ${submission.lastError}` : "."} Fix any
            issues and resubmit.
          </span>
        </div>
      ) : null}
    </div>
  );
}
