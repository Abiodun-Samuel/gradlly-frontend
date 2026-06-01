"use client";

import { Download, X } from "lucide-react";
import { useState } from "react";

import { ApprenticeAvatar } from "./ApprenticeAvatar";
import { ProfileActivity } from "./ProfileActivity";
import { ProfileMilestones } from "./ProfileMilestones";
import { ProfileOverview } from "./ProfileOverview";
import { StatusBadge } from "./StatusBadge";
import { T } from "./tokens";

const TABS = ["Overview", "Milestones", "Activity"];

export function ProfilePanel({ apprentice, onClose, onContact }) {
  const [tab, setTab] = useState("Overview");
  if (!apprentice) return null;
  const a = apprentice;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[230] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 h-full z-[240] flex flex-col overflow-hidden shadow-2xl"
        style={{
          width: 480,
          backgroundColor: T.surface,
          borderLeft: `1px solid ${T.border}`,
          animation: "slide-in-right 300ms cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {/* Header */}
        <div
          className="flex items-start gap-3 px-5 py-4 shrink-0"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          <ApprenticeAvatar
            initials={a.initials}
            color={a.avatarColor}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base" style={{ color: T.ink }}>
              {a.name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: T.muted }}>
              {a.standard}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <StatusBadge status={a.status} />
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                style={{ backgroundColor: T.card, color: T.muted }}
              >
                {a.cohort}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:opacity-80"
              style={{
                backgroundColor: "#f5f4f2",
                color: T.subtle,
                border: `1px solid ${T.border}`,
              }}
            >
              <Download className="h-3 w-3" /> Export
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
              style={{ color: T.muted }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex shrink-0 px-5"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="px-4 py-3 text-sm font-semibold transition-colors duration-150 border-b-2 -mb-px"
              style={{
                color: tab === t ? T.blue : T.muted,
                borderColor: tab === t ? T.blue : "transparent",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto p-5"
          style={{ animation: "fade-in 200ms ease both" }}
        >
          {tab === "Overview" && (
            <ProfileOverview a={a} onContact={onContact} />
          )}
          {tab === "Milestones" && (
            <ProfileMilestones milestones={a.milestones} />
          )}
          {tab === "Activity" && (
            <ProfileActivity recentActivity={a.recentActivity} />
          )}
        </div>
      </div>
    </>
  );
}
