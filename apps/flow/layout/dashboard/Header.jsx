"use client";
import { cn } from "@gradlly/utils";
import { CalendarDays, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { NotificationBell } from "./NotificationBell";
import { ProfileDropdown } from "./ProfileDropdown";

import { pageLabels, portalMeta, sidebarData } from "@/data/sidebar.data";

function formatDate() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function getSectionBreadcrumb(pathname) {
  for (const section of sidebarData) {
    for (const item of section.items) {
      if (
        pathname === item.href ||
        (item.href !== "/" &&
          item.href !== "/home" &&
          pathname.startsWith(item.href))
      )
        return section.title;
      if (item.children) {
        for (const child of item.children) {
          if (
            pathname === child.href ||
            (child.href !== "/" && pathname.startsWith(child.href))
          )
            return section.title;
        }
      }
    }
  }
  return null;
}

export function Header({ onMenuClick }) {
  const pathname = usePathname();
  const title = pageLabels[pathname] ?? "Dashboard";
  const section = getSectionBreadcrumb(pathname);
  const date = formatDate();
  return (
    <header
      className="sticky top-0 z-200 flex h-18 shrink-0 items-center gap-4 bg-surface-0 px-4 sm:px-6"
      style={{
        borderBottom: "1px solid var(--color-border)",
        boxShadow: "0 1px 0 var(--color-border),0 4px 16px rgba(0,0,0,0.03)",
      }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          aria-label="Open navigation menu"
          data-icon-button
          onClick={onMenuClick}
          className="flex size-9 shrink-0 items-center justify-center rounded-xl text-text-tertiary transition-colors hover:bg-surface-2 hover:text-text-primary lg:hidden"
        >
          <Menu aria-hidden="true" className="size-4.5" />
        </button>
        <div
          aria-hidden="true"
          className="hidden h-8 w-px bg-surface-3 lg:block"
        />
        <div className="min-w-0">
          <div className="mb-1.25 flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-text-tertiary">
              {portalMeta?.name ?? "Portal"}
            </span>
            {section && (
              <>
                <span className="text-[11px] text-text-disabled">/</span>
                <span className="text-[11px] font-medium text-text-tertiary">
                  {section}
                </span>
              </>
            )}
          </div>
          <h1 className="truncate text-[17px] font-semibold leading-none tracking-tight text-text-primary">
            {title}
          </h1>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div
          className={cn(
            "hidden items-center gap-1.5 rounded-xl px-3 py-1.75 xl:flex border border-(--color-border) bg-surface-1",
          )}
        >
          <CalendarDays
            aria-hidden="true"
            className="size-3.5 text-text-tertiary"
          />
          <span className="text-xs font-medium text-text-secondary">
            {date}
          </span>
        </div>
        <NotificationBell />
        <div
          aria-hidden="true"
          className="h-5 w-px"
          style={{ background: "var(--color-border)" }}
        />
        <ProfileDropdown />
      </div>
    </header>
  );
}
