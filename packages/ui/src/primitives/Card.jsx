import { cn } from "@gradlly/utils";

export function Card({ className, children }) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-white/70 bg-white/90 p-5 shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </article>
  );
}
