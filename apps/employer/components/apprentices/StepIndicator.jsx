import { T } from "./tokens";

export function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => {
        const done = i + 1 < current;
        const active = i + 1 === current;
        return (
          <div key={i} className="flex items-center gap-2">
            <div
              className="h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-200"
              style={{
                backgroundColor: active ? T.blue : done ? T.green : T.border,
                color: active || done ? "#fff" : T.muted,
              }}
            >
              {done ? "✓" : i + 1}
            </div>
            {i < total - 1 && (
              <div
                className="h-px w-6 transition-colors duration-200"
                style={{ backgroundColor: done ? T.green : T.border }}
              />
            )}
          </div>
        );
      })}
      <p className="ml-2 text-xs font-semibold" style={{ color: T.muted }}>
        Step {current} of {total}
      </p>
    </div>
  );
}
