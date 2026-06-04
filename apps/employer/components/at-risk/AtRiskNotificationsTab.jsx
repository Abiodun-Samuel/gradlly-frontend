"use client";

import { notifStatusMeta, recipientLabel } from "./helpers";
import { T } from "./tokens";

const CHANNEL_ICON = { email: "✉", sms: "💬", portal: "🔔" };

/**
 * @param {{ notifications: import("./data").NotificationRecord[] }} props
 */
export function AtRiskNotificationsTab({ notifications }) {
  if (!notifications?.length) {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
      >
        <p className="text-sm font-semibold" style={{ color: T.muted }}>
          No notifications sent
        </p>
        <p className="text-xs mt-1" style={{ color: T.subtle }}>
          Notifications will appear here once this apprentice is flagged at
          risk.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p
        className="text-xs font-bold uppercase tracking-wider"
        style={{ color: T.muted }}
      >
        Notification History
      </p>

      <div className="space-y-2">
        {notifications.map((n) => {
          const statusMeta = notifStatusMeta(n.status);
          return (
            <div
              key={n.id}
              className="flex items-start gap-3 rounded-xl p-3"
              style={{
                backgroundColor: T.card,
                border: `1px solid ${T.border}`,
              }}
            >
              {/* Channel icon */}
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                style={{
                  backgroundColor: T.surface,
                  border: `1px solid ${T.border}`,
                }}
                aria-hidden
              >
                {CHANNEL_ICON[n.channel] ?? "📨"}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p
                    className="text-xs font-semibold truncate"
                    style={{ color: T.ink }}
                  >
                    {n.subject}
                  </p>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: statusMeta.bg,
                      color: statusMeta.color,
                    }}
                  >
                    {statusMeta.label}
                  </span>
                </div>
                <div
                  className="flex items-center gap-3 text-[10px]"
                  style={{ color: T.muted }}
                >
                  <span>
                    To:{" "}
                    <strong style={{ color: T.subtle }}>
                      {recipientLabel(n.recipient)}
                    </strong>
                  </span>
                  <span>·</span>
                  <span className="capitalize">{n.channel}</span>
                  <span>·</span>
                  <time dateTime={n.date}>{n.date}</time>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
