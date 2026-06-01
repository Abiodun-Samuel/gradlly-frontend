import { T } from "./tokens";

export function ProfileActivity({ recentActivity }) {
  return (
    <div className="space-y-1">
      {recentActivity.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-3 py-3"
          style={{
            borderBottom:
              i < recentActivity.length - 1 ? `1px solid ${T.border}` : "none",
          }}
        >
          <span
            className="text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 tabular-nums whitespace-nowrap"
            style={{
              backgroundColor: T.card,
              color: T.muted,
              border: `1px solid ${T.border}`,
            }}
          >
            {item.date}
          </span>
          <p className="text-sm" style={{ color: T.ink }}>
            {item.text}
          </p>
        </div>
      ))}
    </div>
  );
}
