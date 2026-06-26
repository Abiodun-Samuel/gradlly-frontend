"use client";

import Link from "next/link";

import { cn, formatRelativeTime } from "@/utils/helper";

import { getNotificationTypeMeta } from "../constants";

function getActionUrl(notification) {
  return (
    notification.actionUrl ??
    notification.metadata?.actionUrl ??
    notification.payload?.actionUrl ??
    null
  );
}

/**
 * NotificationItem
 *
 * A single notification row. Unread items carry a subtle tint and a dot; the
 * whole row is clickable to mark it read (no-op when already read). When the
 * notification payload includes actionUrl, the row links to that destination.
 */
export function NotificationItem({ notification, onMarkRead, isUpdating }) {
  const { id, type, title, body, readAt, createdAt } = notification;
  const actionUrl = getActionUrl(notification);
  const meta = getNotificationTypeMeta(type);
  const Icon = meta.icon;
  const isUnread = !readAt;

  const handleActivate = () => {
    if (isUnread && !isUpdating) onMarkRead?.(id);
  };

  const rowClassName = cn(
    "flex items-start gap-3 px-4 py-3.5 transition-colors duration-150 sm:px-5",
    actionUrl || isUnread ? "cursor-pointer" : "",
    isUnread
      ? "bg-primary-50/40 hover:bg-primary-50/70"
      : "hover:bg-neutral-50",
    isUpdating && "opacity-60",
  );

  const content = (
    <>
      <div
        className={cn(
          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg ring-1",
          meta.iconBg,
        )}
      >
        <Icon
          className={cn("size-4.5", meta.iconClass)}
          strokeWidth={1.75}
          aria-hidden
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p
            className={cn(
              "text-sm leading-snug",
              isUnread
                ? "font-semibold text-neutral-900"
                : "font-medium text-neutral-700",
            )}
          >
            {title}
          </p>
          {isUnread ? (
            <span
              aria-label="Unread"
              className="mt-1.5 size-2 shrink-0 rounded-full bg-primary-600"
            />
          ) : null}
        </div>
        {body ? (
          <p className="mt-0.5 text-sm leading-relaxed text-neutral-500">
            {body}
          </p>
        ) : null}
        <p className="mt-1 text-xs text-neutral-400">
          {formatRelativeTime(createdAt)}
        </p>
      </div>
    </>
  );

  if (actionUrl) {
    return (
      <Link href={actionUrl} onClick={handleActivate} className={rowClassName}>
        {content}
      </Link>
    );
  }

  return (
    <div
      role={isUnread ? "button" : undefined}
      tabIndex={isUnread ? 0 : undefined}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (isUnread && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleActivate();
        }
      }}
      className={rowClassName}
    >
      {content}
    </div>
  );
}
