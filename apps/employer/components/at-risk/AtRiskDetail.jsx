"use client";

import {
  ArrowLeft,
  CalendarDays,
  CheckCheck,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ApprenticeAvatar } from "@/components/apprentices/ApprenticeAvatar";
import {
  useAtRiskApprentice,
  useMarkAsReviewed,
} from "@/features/at-risk/queries/at-risk.query";

import { AtRiskBadge } from "./AtRiskBadge";
import { AtRiskInterventionsTab } from "./AtRiskInterventionsTab";
import { AtRiskNotificationsTab } from "./AtRiskNotificationsTab";
import { AtRiskOverviewTab } from "./AtRiskOverviewTab";
import { AtRiskTimelineTab } from "./AtRiskTimelineTab";
import { InterventionModal } from "./InterventionModal";
import { ScheduleReviewModal } from "./ScheduleReviewModal";
import { SendMessageModal } from "./SendMessageModal";
import { T } from "./tokens";

const TABS = ["Overview", "Timeline", "Interventions", "Notifications"];

function Skeleton() {
  return (
    <div
      className="space-y-5 animate-pulse"
      aria-busy="true"
      aria-label="Loading apprentice profile"
    >
      <div
        className="rounded-2xl p-6"
        style={{
          backgroundColor: T.card,
          border: `1px solid ${T.border}`,
          height: 120,
        }}
      />
      <div
        className="rounded-2xl p-6"
        style={{
          backgroundColor: T.card,
          border: `1px solid ${T.border}`,
          height: 400,
        }}
      />
    </div>
  );
}

function ErrorState({ onRetry: _onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <p className="text-sm font-bold" style={{ color: T.ink }}>
        Apprentice not found
      </p>
      <p className="text-xs" style={{ color: T.muted }}>
        This profile may have been removed or the ID is incorrect.
      </p>
      <Link
        href="/at-risk"
        className="mt-2 px-4 py-2 rounded-xl text-xs font-bold hover:opacity-80 transition-opacity"
        style={{ backgroundColor: T.blue, color: "#fff" }}
      >
        Back to At-Risk Management
      </Link>
    </div>
  );
}

/**
 * @param {{ id: string }} props
 */
export function AtRiskDetail({ id }) {
  const { data: apprentice, isLoading, isError } = useAtRiskApprentice(id);
  const { mutate: markReviewed, isPending: isMarkingReviewed } =
    useMarkAsReviewed(id);

  const [tab, setTab] = useState("Overview");
  const [interventionOpen, setInterventionOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  if (isLoading) return <Skeleton />;
  if (isError || !apprentice) return <ErrorState />;

  const a = apprentice;
  const isReviewed = Boolean(a.lastReviewedAt);

  return (
    <div
      className="space-y-5"
      style={{ animation: "slide-up 320ms var(--ease-out) both" }}
    >
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <Link
          href="/at-risk"
          className="inline-flex items-center gap-1.5 text-xs font-semibold hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 rounded"
          style={{ color: T.blue }}
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          At-Risk Management
        </Link>
      </nav>

      {/* Header card */}
      <div
        className="rounded-2xl p-5"
        style={{
          backgroundColor: T.surface,
          border: `1px solid ${T.border}`,
          borderLeft: `4px solid ${a.risk.status === "overdue" ? T.red : a.risk.status === "at_risk" ? T.amber : T.green}`,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <ApprenticeAvatar
            initials={a.initials}
            color={a.avatarColor}
            size="lg"
          />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl font-extrabold" style={{ color: T.ink }}>
                {a.name}
              </h1>
              <AtRiskBadge status={a.risk.status} size="md" />
              {isReviewed && (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: T.greenLight, color: T.green }}
                >
                  Reviewed
                </span>
              )}
            </div>
            <p className="text-xs mb-0.5" style={{ color: T.muted }}>
              {a.standard} · {a.provider}
            </p>
            <p className="text-[11px]" style={{ color: T.muted }}>
              ID: {a.employeeId} · Manager: {a.lineManager}
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-4 mt-3">
              {[
                { label: "OTJ Actual", value: `${a.otjActual}%` },
                { label: "OTJ Expected", value: `${a.otjExpected}%` },
                { label: "Gap", value: `${a.risk.paceGap}pp`, highlight: true },
                { label: "Risk Score", value: `${a.risk.score}/100` },
                { label: "EPA Date", value: a.epaDate },
              ].map(({ label, value, highlight }) => (
                <div key={label}>
                  <p className="text-[10px]" style={{ color: T.muted }}>
                    {label}
                  </p>
                  <p
                    className="text-sm font-bold tabular-nums"
                    style={{
                      color: highlight
                        ? a.risk.paceGap > 30
                          ? T.red
                          : a.risk.paceGap > 15
                            ? T.amber
                            : T.green
                        : T.ink,
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setMessageOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderColor: T.border,
                color: T.subtle,
                backgroundColor: T.surface,
              }}
            >
              <MessageSquare className="h-3.5 w-3.5" aria-hidden />
              Send Message
            </button>
            <button
              type="button"
              onClick={() => setReviewOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderColor: T.border,
                color: T.subtle,
                backgroundColor: T.surface,
              }}
            >
              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
              Schedule Review
            </button>
            <button
              type="button"
              onClick={() => !isReviewed && markReviewed()}
              disabled={isReviewed || isMarkingReviewed}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border hover:opacity-80 transition-opacity disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderColor: isReviewed ? T.green : T.border,
                color: isReviewed ? T.green : T.subtle,
                backgroundColor: isReviewed ? T.greenLight : T.surface,
              }}
              aria-pressed={isReviewed}
            >
              <CheckCheck className="h-3.5 w-3.5" aria-hidden />
              {isMarkingReviewed
                ? "Marking…"
                : isReviewed
                  ? "Reviewed"
                  : "Mark as Reviewed"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
      >
        {/* Tab bar */}
        <div
          className="flex overflow-x-auto"
          style={{ borderBottom: `1px solid ${T.border}` }}
          role="tablist"
          aria-label="Apprentice detail sections"
        >
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              id={`tab-${t}`}
              aria-selected={tab === t}
              aria-controls={`tabpanel-${t}`}
              onClick={() => setTab(t)}
              className="px-4 py-3 text-xs font-semibold transition-colors duration-150 border-b-2 -mb-px whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset"
              style={{
                color: tab === t ? T.blue : T.muted,
                borderColor: tab === t ? T.blue : "transparent",
              }}
            >
              {t}
              {t === "Interventions" && a.interventions.length > 0 && (
                <span
                  className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                  style={{ backgroundColor: T.amberLight, color: T.amber }}
                >
                  {a.interventions.length}
                </span>
              )}
              {t === "Notifications" && a.notifications.length > 0 && (
                <span
                  className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                  style={{ backgroundColor: T.blueLight, color: T.blue }}
                >
                  {a.notifications.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          id={`tabpanel-${tab}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
          className="p-5"
          style={{ animation: "fade-in 200ms ease both" }}
        >
          {tab === "Overview" && <AtRiskOverviewTab a={a} />}
          {tab === "Timeline" && <AtRiskTimelineTab a={a} />}
          {tab === "Interventions" && (
            <AtRiskInterventionsTab
              interventions={a.interventions}
              onAddIntervention={() => setInterventionOpen(true)}
            />
          )}
          {tab === "Notifications" && (
            <AtRiskNotificationsTab notifications={a.notifications} />
          )}
        </div>
      </div>

      {/* Modals */}
      <InterventionModal
        open={interventionOpen}
        onClose={() => setInterventionOpen(false)}
        apprenticeId={a.id}
        apprenticeName={a.name}
      />
      <SendMessageModal
        open={messageOpen}
        onClose={() => setMessageOpen(false)}
        apprenticeId={a.id}
        apprenticeName={a.name}
      />
      <ScheduleReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        apprenticeId={a.id}
        apprenticeName={a.name}
      />
    </div>
  );
}
