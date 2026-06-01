"use client";

import { AlertTriangle, BookOpen, CalendarCheck, Users } from "lucide-react";

import { APPRENTICES } from "./data";
import { T } from "./tokens";

function Card({ icon, accent, bg, value, label, sub, badge, pulse, onClick }) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`rounded-2xl p-5 cursor-pointer transition-shadow hover:shadow-md ${pulse ? "levy-expiry-pulse" : ""}`}
      style={{
        backgroundColor: T.surface,
        border: `1px solid ${T.border}`,
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: bg }}
        >
          <span style={{ color: accent }}>{icon}</span>
        </div>
        {badge}
      </div>
      <p
        className="text-[26px] font-extrabold tabular-nums leading-none"
        style={{ color: T.ink }}
      >
        {value}
      </p>
      <p className="mt-1.5 text-xs font-semibold" style={{ color: T.muted }}>
        {label}
      </p>
      <p className="mt-0.5 text-xs" style={{ color: T.subtle }}>
        {sub}
      </p>
    </div>
  );
}

export function StatCards({ onFilter }) {
  const epaImm = APPRENTICES.filter((a) => a.epaDaysLeft < 90);
  const atRisk = APPRENTICES.filter((a) => a.status === "at_risk");
  const connorDays = APPRENTICES.find((a) => a.id === "CW")?.epaDaysLeft;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card
        icon={<Users className="h-4 w-4" />}
        value={APPRENTICES.length}
        label="Active apprentices"
        sub="Across 3 providers"
        onClick={() => onFilter?.("all")}
      />
      <Card
        icon={<BookOpen className="h-4 w-4" />}
        value={APPRENTICES.filter((a) => a.status === "on_track").length}
        label="On track"
        sub="Progressing well"
        onClick={() => onFilter?.("on_track")}
      />
      <Card
        icon={<AlertTriangle className="h-4 w-4" />}
        value={atRisk.length}
        label="At risk"
        sub="OTJ or review concern"
        pulse
        onClick={() => onFilter?.("at_risk")}
        badge={
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full levy-countdown-pulse"
            style={{ backgroundColor: T.amberLight, color: T.amber }}
          >
            OTJ
          </span>
        }
      />
      <Card
        icon={<CalendarCheck className="h-4 w-4" />}
        value={epaImm.length}
        label="EPA this quarter"
        sub={`Connor Walsh · ${connorDays} days`}
        onClick={() => onFilter?.("epa_imminent")}
        badge={
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: T.redLight, color: T.red }}
          >
            {connorDays}d
          </span>
        }
      />
    </div>
  );
}
