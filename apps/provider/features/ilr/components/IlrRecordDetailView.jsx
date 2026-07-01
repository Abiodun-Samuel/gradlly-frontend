"use client";

import { CheckSquare, History, Pencil, Send, Upload } from "lucide-react";
import { useMemo, useState } from "react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { GoBackButton } from "@/components/ui/GoBackButton";
import { PageSubheader } from "@/components/ui/PageSubheader";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";
import { formatDateTime } from "@/utils/helper";

import { IlrRecordStatusBadge, IlrSubmissionStatusBadge } from "./IlrBadges";
import { OverridesModal } from "./OverridesModal";
import { SubmissionTracker } from "./SubmissionTracker";
import { ValidationReport } from "./ValidationReport";
import { ILR_RECORD_STATUS, getIlrRecordActions } from "../constants";
import {
  useAmendIlrRecord,
  useIlrRecord,
  useRecordSubmissions,
  useSubmitIlrRecord,
  useValidateIlrRecord,
} from "../queries/ilr.query";

// ─── Fields viewer (grouped by entity) ───────────────────────────────────────
function FieldsView({ fields, overrides }) {
  const entities = Object.entries(fields ?? {});
  if (!entities.length) {
    return <p className="text-sm text-neutral-400">No mapped fields yet.</p>;
  }
  return (
    <div className="space-y-4">
      {entities.map(([entity, values]) => (
        <div key={entity}>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
            {entity}
          </p>
          <div className="overflow-hidden rounded-lg border border-neutral-200">
            <dl className="divide-y divide-neutral-100">
              {Object.entries(values ?? {}).map(([field, value]) => {
                const overridden =
                  overrides && `${entity}.${field}` in overrides;
                return (
                  <div
                    key={field}
                    className="flex items-center justify-between gap-3 px-3 py-1.5 text-sm"
                  >
                    <dt className="text-neutral-500">{field}</dt>
                    <dd className="flex items-center gap-1.5 truncate font-mono text-neutral-800">
                      {value ?? "—"}
                      {overridden ? (
                        <span className="rounded bg-amber-50 px-1 text-[10px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                          override
                        </span>
                      ) : null}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      ))}
    </div>
  );
}

export function IlrRecordDetailView({ recordId }) {
  const { isOwner, isAdmin } = useRoleAccess();
  const canSubmit = isOwner || isAdmin;

  const { data: record, isError } = useIlrRecord(recordId);
  const { data: submissions = [] } = useRecordSubmissions(recordId);

  const validate = useValidateIlrRecord();
  const submit = useSubmitIlrRecord();
  const amend = useAmendIlrRecord();

  const [overridesOpen, setOverridesOpen] = useState(false);
  // Live submission id to poll (set from submit/amend response).
  const [liveSubmissionId, setLiveSubmissionId] = useState(null);

  // Newest submission drives amend/in-flight gating.
  const latestSubmission = submissions[0] ?? null;
  const actions = useMemo(
    () => getIlrRecordActions(record, { canSubmit, latestSubmission }),
    [record, canSubmit, latestSubmission],
  );

  const hasValidated = Boolean(record?.lastValidatedAt);

  const handleSubmit = async () => {
    try {
      const sub = await submit.mutateAsync(record.id);
      if (sub?.id) setLiveSubmissionId(sub.id);
    } catch {
      // toast via mutation
    }
  };

  const handleAmend = async () => {
    try {
      const sub = await amend.mutateAsync(record.id);
      if (sub?.id) setLiveSubmissionId(sub.id);
    } catch {
      // toast via mutation
    }
  };

  if (isError) {
    return (
      <div className="space-y-4">
        <GoBackButton className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800" />
        <Card>
          <CardContent className="py-10 text-center text-sm text-neutral-500">
            This ILR record could not be found.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GoBackButton className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800" />

      <PageSubheader
        icon={CheckSquare}
        eyebrow="ILR / ESFA"
        title={record ? `ILR ${record.collectionPeriod}` : "ILR record"}
        description={
          record ? `Academic year ${record.academicYear}` : undefined
        }
        actions={
          record ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                color="black"
                variant="neutral"
                startIcon={<Pencil className="size-4" />}
                onClick={() => setOverridesOpen(true)}
              >
                Overrides
              </Button>
              <Button
                size="sm"
                color="green"
                variant="neutral"
                loading={validate.isPending}
                disabled={validate.isPending}
                startIcon={<CheckSquare className="size-4" />}
                onClick={() => validate.mutate(record.id)}
              >
                Validate
              </Button>
              {actions.submit ? (
                <Button
                  size="sm"
                  color="green"
                  loading={submit.isPending}
                  disabled={submit.isPending}
                  startIcon={<Send className="size-4" />}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              ) : null}
              {actions.amend ? (
                <Button
                  size="sm"
                  color="green"
                  loading={amend.isPending}
                  disabled={amend.isPending}
                  startIcon={<Upload className="size-4" />}
                  onClick={handleAmend}
                >
                  Amend
                </Button>
              ) : null}
            </div>
          ) : null
        }
      />

      {record ? (
        <>
          {/* Status + gating notices */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-neutral-900">
                Status
              </h2>
              <IlrRecordStatusBadge status={record.status} />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-neutral-600">
                <span>
                  Collection period:{" "}
                  <span className="font-medium text-neutral-800">
                    {record.collectionPeriod}
                  </span>
                </span>
                <span>
                  Last validated:{" "}
                  <span className="font-medium text-neutral-800">
                    {record.lastValidatedAt
                      ? formatDateTime(record.lastValidatedAt)
                      : "never"}
                  </span>
                </span>
              </div>

              {actions.inFlight ? (
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  A submission is in flight — submit/amend are disabled until it
                  finishes.
                </p>
              ) : null}
              {record.status === ILR_RECORD_STATUS.VALIDATED && !canSubmit ? (
                <p className="rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-500">
                  Only owners/admins can submit to the ESFA.
                </p>
              ) : null}
            </CardContent>
          </Card>

          {/* Live submission tracker (after submit/amend) */}
          {liveSubmissionId ? (
            <SubmissionTracker submissionId={liveSubmissionId} />
          ) : null}

          {/* Validation report */}
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-neutral-900">
                Validation
              </h2>
            </CardHeader>
            <CardContent>
              {hasValidated ? (
                <ValidationReport recordId={record.id} enabled={hasValidated} />
              ) : (
                <p className="text-sm text-neutral-400">
                  Not validated yet. Run validation to check this record against
                  ILR rules.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Fields */}
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-neutral-900">
                Fields
              </h2>
            </CardHeader>
            <CardContent>
              <FieldsView
                fields={record.fields}
                overrides={record.manualOverrides}
              />
            </CardContent>
          </Card>

          {/* Submission history */}
          {submissions.length ? (
            <Card>
              <CardHeader className="flex items-center gap-2">
                <History className="size-4 text-neutral-400" aria-hidden />
                <h2 className="text-base font-semibold text-neutral-900">
                  Submission history
                </h2>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-neutral-100">
                  {submissions.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between gap-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-neutral-700">
                          {s.isAmendment ? "Amendment" : "Submission"} · attempt{" "}
                          {s.attempt}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {s.esfaReference
                            ? `Ref ${s.esfaReference}`
                            : s.lastError
                              ? s.lastError
                              : formatDateTime(s.createdAt)}
                        </p>
                      </div>
                      <IlrSubmissionStatusBadge status={s.status} />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          <OverridesModal
            record={record}
            open={overridesOpen}
            onClose={() => setOverridesOpen(false)}
          />
        </>
      ) : (
        <Card>
          <CardContent className="py-10 text-center text-sm text-neutral-400">
            Loading record…
          </CardContent>
        </Card>
      )}
    </div>
  );
}
