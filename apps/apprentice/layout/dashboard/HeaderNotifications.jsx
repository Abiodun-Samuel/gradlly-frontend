"use client";

import { Bell } from "lucide-react";
import Link from "next/link";

import { useUnreadNotificationCount } from "@/features/notifications/queries/notifications.query";
import { cn } from "@/utils/helper";

/**
 * HeaderNotifications
 *
 * Bell button in the dashboard header. Navigates to the notifications settings
 * page (no dropdown) and shows a live unread-count badge.
 */
export function HeaderNotifications() {
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const hasUnread = unreadCount > 0;
  const badge = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <Link
      href="/settings/notifications"
      aria-label={
        hasUnread ? `Notifications, ${unreadCount} unread` : "Notifications"
      }
      title="Notifications"
      className={cn(
        "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
        "border border-neutral-200 bg-white text-neutral-500 transition-colors duration-150",
        "hover:border-green-300 hover:bg-green-50 hover:text-green-700",
        "focus-visible:outline-2 focus-visible:outline-primary-700 focus-visible:outline-offset-2",
      )}
    >
      <Bell aria-hidden className="h-4.5 w-4.5" strokeWidth={1.75} />
      {hasUnread ? (
        <span
          aria-hidden
          className={cn(
            "absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full",
            "bg-danger-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white",
          )}
        >
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
