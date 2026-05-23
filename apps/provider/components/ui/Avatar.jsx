import Image from "next/image";

import { cn } from "@/utils/helper";

const sizeMap = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
};

export function Avatar({ initials, src, alt, size = "sm", className }) {
  const sizeClass = sizeMap[size] ?? sizeMap.sm;

  if (src) {
    return (
      <div
        className={cn(
          "relative rounded-full shrink-0 overflow-hidden",
          sizeClass,
          className,
        )}
      >
        <Image
          src={src}
          alt={alt ?? initials ?? "Avatar"}
          fill
          className="object-cover"
          sizes="100%"
        />
      </div>
    );
  }

  return (
    <div
      aria-label={alt ?? initials ?? "User avatar"}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white select-none",
        "bg-linear-to-br from-primary-500 to-primary-700",
        sizeClass,
        className,
      )}
    >
      {initials}
    </div>
  );
}
