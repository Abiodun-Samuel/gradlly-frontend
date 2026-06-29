export function ApprenticeAvatar({ initials, color, size = "md" }) {
  const sz =
    size === "lg"
      ? "h-12 w-12 text-base"
      : size === "sm"
        ? "h-7 w-7 text-[10px]"
        : "h-8 w-8 text-xs";
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}
