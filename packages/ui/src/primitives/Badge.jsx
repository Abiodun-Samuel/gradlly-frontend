import { cn } from "@gradlly/utils";

const tones = {
  neutral: "bg-slate-700/80 text-slate-100",
  success: "bg-emerald-600/90 text-white",
  warning: "bg-amber-500/90 text-slate-950",
  danger: "bg-red-600/90 text-white",
  info: "bg-blue-600/90 text-white",
};

export function Badge({ tone = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
