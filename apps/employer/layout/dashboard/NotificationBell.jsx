"use client";

import { cn } from "@gradlly/utils";
import { Bell, CheckCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const notifications = [
  {
    id: 1,
    title: "Application received",
    desc: "A new application has been submitted for review.",
    time: "5m ago",
    unread: true,
  },
  {
    id: 2,
    title: "Apprentice message",
    desc: "Your apprentice sent you a new message.",
    time: "2h ago",
    unread: true,
  },
  {
    id: 3,
    title: "Milestone sign-off due",
    desc: "Q3 milestone sign-off is due this week.",
    time: "1d ago",
    unread: false,
  },
];

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const unread = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    function onPointer(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        aria-expanded={open}
        aria-label={`Notifications${unread ? ` — ${unread} unread` : ""}`}
        data-icon-button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative flex size-9 items-center justify-center rounded-xl text-text-secondary transition-colors duration-150 hover:bg-surface-2 hover:text-text-primary",
          open && "bg-surface-2 text-text-primary",
        )}
      >
        <Bell aria-hidden="true" className="size-4" />
        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute right-2 top-2 size-2 rounded-full ring-2 ring-surface-0"
            style={{ background: "var(--portal-accent)" }}
          />
        )}
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-full z-100 mt-2 w-85 overflow-hidden rounded-2xl border border-(--color-border) bg-surface-0 shadow-xl animate-[dropdown-enter_150ms_ease-out_forwards]"
          style={{
            boxShadow:
              "0 20px 40px rgba(0,0,0,0.1),0 0 0 1px var(--color-border)",
          }}
        >
          <div className="flex items-center justify-between border-b border-(--color-border) px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-semibold text-text-primary">
                Notifications
              </h2>
              {unread > 0 && (
                <span
                  className="rounded-full px-2 py-0.5 text-2xs font-bold text-white"
                  style={{ background: "var(--portal-accent)" }}
                >
                  {unread} new
                </span>
              )}
            </div>
            <button
              data-icon-button
              aria-label="Mark all as read"
              className="flex size-7 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-surface-2 hover:text-text-primary"
            >
              <CheckCheck aria-hidden="true" className="size-3.5" />
            </button>
          </div>
          <div className="divide-y divide-(--color-border)">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "flex cursor-pointer gap-3.5 px-4 py-3.5 transition-colors duration-100 hover:bg-surface-1",
                  n.unread && "bg-primary-50/60",
                )}
              >
                <div className="mt-1.25 shrink-0">
                  <span
                    aria-hidden="true"
                    className="block size-2 rounded-full"
                    style={
                      n.unread
                        ? { background: "var(--portal-accent)" }
                        : { background: "transparent" }
                    }
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-text-primary">
                    {n.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-text-secondary">
                    {n.desc}
                  </p>
                  <p className="mt-1.5 text-2xs text-text-tertiary">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-(--color-border) bg-surface-1 px-4 py-2.5">
            <button
              className="w-full text-center text-xs font-semibold transition-opacity hover:opacity-70"
              style={{ color: "var(--portal-accent)" }}
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
