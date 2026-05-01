"use client";

import { cn } from "@gradlly/utils";
import { ChevronRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const badgeStyles = {
  success:
    "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/22",
  warning:
    "bg-amber-500/15 text-amber-300  ring-1 ring-inset ring-amber-500/22",
  info: "bg-primary-500/15 text-primary-300 ring-1 ring-inset ring-primary-500/22",
  danger: "bg-red-500/15   text-red-300   ring-1 ring-inset ring-red-500/22",
};

function SubItem({ item }) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href ||
    (item.href !== "/" && pathname.startsWith(item.href));
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg py-1.5 pl-10.5 pr-3 text-[13px] font-medium",
        "transition-colors duration-100",
        isActive ? "text-white/90" : "text-white/35 hover:text-white/62",
      )}
    >
      <span
        aria-hidden="true"
        className="size-1.5 shrink-0 rounded-full transition-colors duration-100"
        style={{
          background: isActive
            ? "var(--portal-accent)"
            : "rgba(255,255,255,0.2)",
        }}
      />
      {item.label}
    </Link>
  );
}

export function SidebarItem({ item }) {
  const pathname = usePathname();
  const hasChildren = Boolean(item.children?.length);
  const isActive =
    !hasChildren &&
    (pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(item.href)));
  const isGroupActive =
    hasChildren &&
    item.children.some(
      (c) =>
        pathname === c.href || (c.href !== "/" && pathname.startsWith(c.href)),
    );
  const [open, setOpen] = useState(isGroupActive);
  const IconComponent = LucideIcons[item.icon];
  const highlighted = isActive || isGroupActive;
  const baseRow = cn(
    "group relative flex w-full items-center gap-3 rounded-xl px-3 py-[9px] text-sm font-medium",
    "select-none transition-all duration-150 ease-out",
    highlighted
      ? "text-white"
      : "text-white/52 hover:bg-white/[0.05] hover:text-white/82",
  );
  const activeRowStyle = highlighted
    ? {
        background:
          "linear-gradient(90deg,rgba(var(--portal-accent-rgb,59,130,246),0.18) 0%,rgba(var(--portal-accent-rgb,59,130,246),0.06) 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }
    : {};
  const Icon = IconComponent ? (
    <IconComponent
      aria-hidden="true"
      className="size-4.25 shrink-0 transition-colors duration-150"
      strokeWidth={highlighted ? 2.5 : 2}
      style={{
        color: highlighted ? "var(--portal-accent)" : "rgba(255,255,255,0.38)",
      }}
    />
  ) : null;
  const Badge = item.badge ? (
    <span
      className={cn(
        "rounded-full px-1.5 py-0.5 text-2xs font-semibold leading-none",
        badgeStyles[item.badge.variant] ?? badgeStyles.info,
      )}
    >
      {item.badge.text}
    </span>
  ) : null;
  const ActiveBar = highlighted ? (
    <span
      aria-hidden="true"
      className="absolute inset-y-2 left-0 w-0.75 rounded-r-full"
      style={{ background: "var(--portal-accent)" }}
    />
  ) : null;
  if (hasChildren) {
    return (
      <div>
        <button
          data-icon-button
          onClick={() => setOpen((v) => !v)}
          className={baseRow}
          style={activeRowStyle}
        >
          {ActiveBar}
          {Icon}
          <span className="flex-1 truncate text-left">{item.label}</span>
          {Badge}
          <ChevronRight
            aria-hidden="true"
            className={cn(
              "size-3.5 shrink-0 text-white/22 transition-transform duration-200",
              open && "rotate-90",
            )}
          />
        </button>
        {open && (
          <div className="mt-0.5 space-y-0.5 animate-[dropdown-enter_150ms_ease-out_forwards]">
            {item.children.map((child) => (
              <SubItem key={child.href} item={child} />
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <Link href={item.href} className={baseRow} style={activeRowStyle}>
      {ActiveBar}
      {Icon}
      <span className="flex-1 truncate">{item.label}</span>
      {!hasChildren && Badge}
    </Link>
  );
}
