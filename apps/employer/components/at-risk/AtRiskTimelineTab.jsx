"use client";

import { activityTypeMeta } from "./helpers";
import { T } from "./tokens";

/**
 * @param {{ a: import("./data").AtRiskApprentice }} props
 */
export function AtRiskTimelineTab({ a }) {
  if (!a.activityTimeline?.length) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm font-semibold" style={{ color: T.muted }}>
          No activity recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p
        className="text-xs font-bold uppercase tracking-wider mb-4"
        style={{ color: T.muted }}
      >
        Activity Timeline
      </p>
      <ol className="relative" aria-label="Activity timeline">
        {/* Vertical line */}
        <div
          className="absolute left-[15px] top-2 bottom-2 w-px"
          style={{ backgroundColor: T.border }}
          aria-hidden
        />

        {a.activityTimeline.map((event) => {
          const meta = activityTypeMeta(event.type);
          return (
            <li key={event.id} className="relative flex gap-4 pb-5 pl-10">
              {/* Dot */}
              <div
                className="absolute left-0 top-1 h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{
                  backgroundColor: meta.bg,
                  color: meta.color,
                  border: `2px solid ${T.surface}`,
                }}
                aria-hidden
              >
                {meta.label.charAt(0)}
              </div>

              <div
                className="flex-1 rounded-xl p-3"
                style={{
                  backgroundColor: T.card,
                  border: `1px solid ${T.border}`,
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: meta.bg, color: meta.color }}
                  >
                    {meta.label}
                  </span>
                  <time
                    className="text-[10px]"
                    style={{ color: T.muted }}
                    dateTime={event.date}
                  >
                    {event.date}
                  </time>
                </div>
                <p className="text-xs" style={{ color: T.subtle }}>
                  {event.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
