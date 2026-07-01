"use client";

import { CheckCircle2, Loader2, RotateCcw, XCircle } from "lucide-react";

import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatDateTime } from "@/utils/helper";

import { PushStatusBadge } from "./PushStatusBadge";
import {
  PIPELINES,
  PUSH_STATUS,
  PUSH_TRIGGER_LABELS,
  isPushInFlight,
} from "../constants";
import { usePush, useRetryPush } from "../queries/das-pushes.query";

function Field({ label, value, mono }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-sm text-neutral-500">{label}</span>
      <span
        className={
          mono
            ? "truncate font-mono text-xs text-neutral-700"
            : "truncate text-sm text-neutral-700"
        }
      >
        {value}
      </span>
    </div>
  );
}

/**
 * Inspect a push record and (re)poll it live. Retrying re-queues delivery and
 * the modal watches it progress to delivered/failed.
 *
 * @param {string} pipeline  PUSH_PIPELINE key
 * @param {string} pushId
 */
export function PushDetailModal({ pipeline, pushId, open, onClose }) {
  const config = PIPELINES[pipeline];
  const { data: push } = usePush(pipeline, pushId, {
    enabled: open && !!pushId,
  });
  const retry = useRetryPush(pipeline);

  const inFlight = isPushInFlight(push);
  const delivered = push?.status === PUSH_STATUS.DELIVERED;
  const failed = push?.status === PUSH_STATUS.FAILED;

  return (
    <Modal
      open={open}
      onClose={onClose}
      busy={retry.isPending}
      size="lg"
      icon={<RotateCcw className="size-4.5" strokeWidth={1.85} aria-hidden />}
      title={`${config?.label ?? ""} push`}
      description="Inspect delivery status and re-queue if it failed."
      footer={
        failed ? (
          <Button
            type="button"
            color="green"
            size="sm"
            loading={retry.isPending}
            disabled={retry.isPending}
            startIcon={<RotateCcw className="size-4" />}
            onClick={() => retry.mutate(push.id)}
          >
            Retry delivery
          </Button>
        ) : null
      }
    >
      {!push ? (
        <p className="flex items-center gap-2 py-4 text-sm text-neutral-400">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Loading push…
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">
              Attempt {push.attempts}
            </span>
            <PushStatusBadge status={push.status} />
          </div>

          {inFlight ? (
            <div className="flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
              <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
              Delivering to DAS… this updates automatically.
            </div>
          ) : null}

          {delivered ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle2 className="size-4 shrink-0" aria-hidden />
              Delivered to DAS.
            </div>
          ) : null}

          {failed && push.lastError ? (
            <div className="flex items-start gap-2 rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
              <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span className="break-words">{push.lastError}</span>
            </div>
          ) : null}

          <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-200 px-4 py-1">
            {config?.hasTrigger ? (
              <Field
                label="Trigger"
                value={PUSH_TRIGGER_LABELS[push.trigger] ?? push.trigger}
              />
            ) : null}
            <Field label="Enrolment" value={push.enrolmentId} mono />
            <Field label="Apprentice" value={push.apprenticeId} mono />
            {config?.hasReference ? (
              <Field label="DAS reference" value={push.dasReference} mono />
            ) : null}
            <Field
              label="Delivered at"
              value={push.deliveredAt ? formatDateTime(push.deliveredAt) : null}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
