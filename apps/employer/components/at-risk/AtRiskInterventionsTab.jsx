"use client";

import { Plus } from "lucide-react";

import { interventionTypeMeta } from "./helpers";
import { T } from "./tokens";

const OUTCOME_META = {
  completed: { label: "Completed", color: T.green, bg: T.greenLight },
  in_progress: { label: "In Progress", color: "#1847d4", bg: "#e8eefb" },
  pending: { label: "Pending", color: T.amber, bg: T.amberLight },
};

/**
 * @param {{
 *   interventions: import("./data").Intervention[],
 *   onAddIntervention: () => void
 * }} props
 */
export function AtRiskInterventionsTab({ interventions, onAddIntervention }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: T.muted }}
        >
          Intervention History
        </p>
        <button
          type="button"
          onClick={onAddIntervention}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ backgroundColor: T.blue, color: "#fff" }}
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Add Note
        </button>
      </div>

      {interventions.length === 0 ? (
        <div
          className="rounded-xl p-8 text-center"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        >
          <p className="text-sm font-semibold" style={{ color: T.muted }}>
            No interventions recorded
          </p>
          <p className="text-xs mt-1" style={{ color: T.subtle }}>
            Document actions taken to support this apprentice.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {interventions.map((iv) => {
            const typeMeta = interventionTypeMeta(iv.type);
            const outcomeMeta =
              OUTCOME_META[iv.outcome] ?? OUTCOME_META.pending;
            return (
              <div
                key={iv.id}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: T.card,
                  border: `1px solid ${T.border}`,
                  borderLeft: `3px solid ${typeMeta.color}`,
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: typeMeta.bg,
                        color: typeMeta.color,
                      }}
                    >
                      {typeMeta.label}
                    </span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: outcomeMeta.bg,
                        color: outcomeMeta.color,
                      }}
                    >
                      {outcomeMeta.label}
                    </span>
                  </div>
                  <time
                    className="text-[10px] shrink-0"
                    style={{ color: T.muted }}
                    dateTime={iv.date}
                  >
                    {iv.date}
                  </time>
                </div>

                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: T.ink }}
                >
                  {iv.title}
                </p>
                <p className="text-xs mb-2" style={{ color: T.subtle }}>
                  {iv.notes}
                </p>

                <div
                  className="flex items-center gap-4 text-[10px]"
                  style={{ color: T.muted }}
                >
                  {iv.followUpDate && (
                    <span>
                      Follow-up:{" "}
                      <strong style={{ color: T.subtle }}>
                        {iv.followUpDate}
                      </strong>
                    </span>
                  )}
                  <span>
                    By:{" "}
                    <strong style={{ color: T.subtle }}>{iv.createdBy}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
