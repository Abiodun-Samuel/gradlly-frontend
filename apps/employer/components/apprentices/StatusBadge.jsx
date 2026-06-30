import { statusMeta } from "./helpers";

export function StatusBadge({ status }) {
  const { label, color, bg } = statusMeta(status);
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap"
      style={{ backgroundColor: bg, color }}
    >
      {label}
    </span>
  );
}
