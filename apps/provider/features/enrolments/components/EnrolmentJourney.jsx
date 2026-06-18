"use client";

import {
  AlertCircle,
  Check,
  Circle,
  CircleDashed,
  CircleDot,
  Clock,
  Lock,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn, formatDate } from "@/utils/helper";

import { EpaCountdownBadge, OtjPaceBadge } from "./EnrolmentBadges";

// ─── Milestone timeline ──────────────────────────────────────────────────────

const MILESTONE_STATUS_STYLE = {
  complete: { ring: "bg-emerald-500 text-white", icon: Check },
  current: { ring: "bg-primary-600 text-white", icon: CircleDot },
  upcoming: { ring: "bg-neutral-100 text-neutral-400", icon: Circle },
};

function Milestone({ milestone, isLast }) {
  const style =
    MILESTONE_STATUS_STYLE[milestone.status] ?? MILESTONE_STATUS_STYLE.upcoming;
  const Icon = style.icon;

  return (
    <li className="relative flex gap-3 pb-5 last:pb-0">
      {!isLast ? (
        <span
          aria-hidden
          className="absolute left-3 top-7 h-[calc(100%-1rem)] w-px bg-neutral-200"
        />
      ) : null}
      <span
        className={cn(
          "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full",
          style.ring,
        )}
      >
        <Icon className="size-3.5" strokeWidth={2.5} aria-hidden />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p
            className={cn(
              "text-sm font-medium",
              milestone.status === "upcoming"
                ? "text-neutral-400"
                : "text-neutral-900",
            )}
          >
            {milestone.title}
          </p>
          {milestone.date ? (
            <span className="text-xs tabular-nums text-neutral-400">
              {formatDate(milestone.date)}
            </span>
          ) : null}
        </div>
        {milestone.description ? (
          <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">
            {milestone.description}
          </p>
        ) : null}
      </div>
    </li>
  );
}

// ─── Gateway checklist ───────────────────────────────────────────────────────

const CRITERION_STATUS_STYLE = {
  complete: { className: "text-emerald-600", icon: Check, label: "Complete" },
  in_progress: {
    className: "text-amber-600",
    icon: Clock,
    label: "In progress",
  },
  not_started: {
    className: "text-neutral-400",
    icon: CircleDashed,
    label: "Not started",
  },
  blocked: { className: "text-danger-500", icon: Lock, label: "Blocked" },
};

function GatewayCriterion({ criterion }) {
  const style =
    CRITERION_STATUS_STYLE[criterion.status] ??
    CRITERION_STATUS_STYLE.not_started;
  const Icon = style.icon;

  return (
    <li className="flex items-start gap-3 py-2.5">
      <Icon
        className={cn("mt-0.5 size-4 shrink-0", style.className)}
        strokeWidth={2}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p className="text-sm font-medium text-neutral-800">
            {criterion.title}
          </p>
          <span className={cn("text-xs font-medium", style.className)}>
            {style.label}
          </span>
        </div>
        {criterion.description ? (
          <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">
            {criterion.description}
          </p>
        ) : null}
      </div>
    </li>
  );
}

function GatewayProgress({ percent, ready }) {
  const pct = Math.max(0, Math.min(100, percent ?? 0));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-neutral-500">Gateway readiness</span>
        <span
          className={cn(
            "font-semibold tabular-nums",
            ready ? "text-emerald-600" : "text-neutral-700",
          )}
        >
          {pct}%{ready ? " · Ready" : ""}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            ready ? "bg-emerald-500" : "bg-primary-500",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── OTJ pace ────────────────────────────────────────────────────────────────

function PaceStat({ label, value }) {
  return (
    <div className="rounded-xl border border-neutral-100 bg-neutral-50/60 px-3 py-2.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums text-neutral-800">
        {value}
      </p>
    </div>
  );
}

function hoursFromMinutes(min) {
  if (min === null || min === undefined) return "—";
  return `${Math.round((min / 60) * 10) / 10}h`;
}

function OtjPace({ pace }) {
  if (!pace) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-500">
          Off-the-job pace
        </span>
        <OtjPaceBadge level={pace.alertLevel} />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <PaceStat
          label="Approved"
          value={hoursFromMinutes(pace.approvedMinutes)}
        />
        <PaceStat
          label="Expected by today"
          value={hoursFromMinutes(pace.expectedMinutesByToday)}
        />
        <PaceStat
          label="Target"
          value={hoursFromMinutes(pace.totalTargetMinutes)}
        />
        {pace.behindPercent !== null && pace.behindPercent !== undefined ? (
          <PaceStat label="Behind" value={`${pace.behindPercent}%`} />
        ) : null}
        {pace.requiredWeeklyHours !== null &&
        pace.requiredWeeklyHours !== undefined ? (
          <PaceStat
            label="Required / week"
            value={`${pace.requiredWeeklyHours}h`}
          />
        ) : null}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function EnrolmentJourney({ journey, isLoading, isError }) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-3 py-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-full animate-pulse rounded-md bg-neutral-100"
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError || !journey) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 py-6 text-sm text-neutral-500">
          <AlertCircle className="size-4 text-neutral-400" aria-hidden />
          The journey could not be loaded.
        </CardContent>
      </Card>
    );
  }

  const milestones = journey.milestones ?? [];
  const checklist = journey.gatewayChecklist ?? [];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Timeline + EPA countdown */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-900">
            Programme timeline
          </h2>
          <EpaCountdownBadge
            band={journey.epaCountdownBand}
            daysToEpa={journey.daysToEpa}
          />
        </CardHeader>
        <CardContent>
          {milestones.length ? (
            <ol>
              {milestones.map((m, i) => (
                <Milestone
                  key={m.code ?? i}
                  milestone={m}
                  isLast={i === milestones.length - 1}
                />
              ))}
            </ol>
          ) : (
            <p className="text-sm text-neutral-400">No milestones yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Gateway + pace */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-neutral-900">
              Gateway checklist
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <GatewayProgress
              percent={journey.gatewayCompletionPercent}
              ready={journey.gatewayReady}
            />
            {checklist.length ? (
              <ul className="divide-y divide-neutral-100">
                {checklist.map((c, i) => (
                  <GatewayCriterion key={c.code ?? i} criterion={c} />
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-400">
                No gateway criteria yet.
              </p>
            )}
          </CardContent>
        </Card>

        {journey.pace ? (
          <Card>
            <CardContent>
              <OtjPace pace={journey.pace} />
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
