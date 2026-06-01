import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

import { T } from "./tokens";

const icons = {
  complete: <CheckCircle2 className="h-4 w-4" style={{ color: T.green }} />,
  upcoming: <Clock className="h-4 w-4" style={{ color: T.blue }} />,
  overdue: <AlertTriangle className="h-4 w-4" style={{ color: T.red }} />,
};
const colors = { complete: T.green, upcoming: T.blue, overdue: T.red };

export function ProfileMilestones({ milestones }) {
  return (
    <div className="space-y-1">
      {milestones.map((m, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-xl px-4 py-3"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        >
          <span className="mt-0.5 shrink-0">{icons[m.status]}</span>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: T.ink }}>
              {m.label}
            </p>
            <p className="text-xs mt-0.5" style={{ color: T.muted }}>
              {m.date}
            </p>
          </div>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
            style={{
              backgroundColor: `${colors[m.status]}12`,
              color: colors[m.status],
            }}
          >
            {m.status}
          </span>
        </div>
      ))}
    </div>
  );
}
