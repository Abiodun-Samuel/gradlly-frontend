"use client";

import { CheckCircle2, Circle, CircleDot, Trophy } from "lucide-react";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { GoBackButton } from "@/components/ui/GoBackButton";
import TextBadge from "@/components/ui/TextBadge";
import { useRoleAccess } from "@/features/auth/hooks/useRoleAccess";
import { CommitmentStatementPanel } from "@/features/commitment-statements/components/CommitmentStatementPanel";
import { toastSuccess } from "@/hooks/useToast";
import { cn } from "@/utils/helper";

import { MODULE_STATUS, MODULE_STATUS_META } from "../constants";
import {
  useAiProgrammeProgress,
  useCompleteAiProgramme,
  useUpdateAiProgrammeProgress,
} from "../queries/ai-programmes.query";

const STATUS_ICON = {
  not_started: Circle,
  in_progress: CircleDot,
  completed: CheckCircle2,
};

// Advance a module one step on click: not_started → in_progress → completed.
const NEXT_STATUS = {
  not_started: MODULE_STATUS.IN_PROGRESS,
  in_progress: MODULE_STATUS.COMPLETED,
  completed: MODULE_STATUS.NOT_STARTED,
};

function ModuleItem({ module, onSetStatus, disabled }) {
  const Icon = STATUS_ICON[module.status] ?? Circle;
  const meta =
    MODULE_STATUS_META[module.status] ?? MODULE_STATUS_META.not_started;

  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <Icon
          className={cn(
            "size-5 shrink-0",
            module.status === "completed" && "text-green-600",
            module.status === "in_progress" && "text-amber-500",
            module.status === "not_started" && "text-neutral-300",
          )}
          aria-hidden
        />
        <div className="min-w-0">
          <p className="truncate font-medium text-neutral-900">
            {module.title}
          </p>
          <TextBadge variant="light" color={meta.color} size="xs">
            {meta.label}
          </TextBadge>
        </div>
      </div>
      <Button
        variant="neutral"
        color="black"
        size="xs"
        disabled={disabled}
        onClick={() =>
          onSetStatus(module.moduleSlug, NEXT_STATUS[module.status])
        }
      >
        {module.status === "completed" ? "Reset" : "Advance"}
      </Button>
    </li>
  );
}

export function LearnerProgressView({ enrolmentId }) {
  const { can } = useRoleAccess();
  const canManage = can("admin");

  const {
    data: summary,
    isLoading,
    error,
  } = useAiProgrammeProgress(enrolmentId);

  const updateProgress = useUpdateAiProgrammeProgress(enrolmentId);
  const complete = useCompleteAiProgramme(enrolmentId, {
    onSuccess: () => toastSuccess("Programme completed"),
  });

  if (isLoading) {
    return <p className="text-sm text-neutral-400">Loading progress…</p>;
  }

  if (error || !summary) {
    return (
      <div className="space-y-4">
        <GoBackButton />
        <EmptyState
          icon={Trophy}
          title="No progress found"
          description="We couldn't load this learner's programme progress."
        />
      </div>
    );
  }

  const modules = summary.modules ?? [];
  const percent = summary.percentComplete ?? 0;
  const allDone =
    modules.length > 0 &&
    modules.every((m) => m.status === MODULE_STATUS.COMPLETED);
  const alreadyCompleted = summary.enrolmentStatus === "completed";

  const handleSetStatus = (moduleSlug, status) =>
    updateProgress.mutate({ moduleSlug, status });

  return (
    <div className="space-y-6">
      <GoBackButton />

      <div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900">
          {summary.programmeTitle}
        </h1>
        <p className="mt-0.5 text-sm text-neutral-500">
          Module progress for this apprentice.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-neutral-900">
              {percent}% complete
            </h2>
            {alreadyCompleted ? (
              <TextBadge variant="light" color="green" size="xs">
                Completed
              </TextBadge>
            ) : null}
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-1.5 rounded-full bg-primary-600 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </CardHeader>
        <CardContent>
          {modules.length ? (
            <ul className="divide-y divide-neutral-100">
              {modules.map((module) => (
                <ModuleItem
                  key={module.moduleSlug}
                  module={module}
                  onSetStatus={handleSetStatus}
                  disabled={updateProgress.isPending || alreadyCompleted}
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-500">No modules to track.</p>
          )}
        </CardContent>
      </Card>

      {!alreadyCompleted ? (
        <div>
          {complete.error ? (
            <p className="mb-3 text-sm text-danger-600" role="alert">
              {complete.error.message}
            </p>
          ) : null}
          <Button
            color="green"
            loading={complete.isPending}
            disabled={!allDone}
            onClick={() => complete.mutate()}
            startIcon={<Trophy className="size-4" />}
          >
            Mark programme complete
          </Button>
          {!allDone ? (
            <p className="mt-2 text-xs text-neutral-400">
              Complete every module to finish the programme.
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Tripartite commitment statement for this apprentice */}
      <CommitmentStatementPanel
        enrolment={{ id: enrolmentId, apprenticeId: summary.apprenticeId }}
        canManage={canManage}
      />
    </div>
  );
}
