import { T } from "./tokens";

/**
 * Derives risk status from the gap between expected and actual OTJ %.
 * Business rules: >30pp behind → overdue, >15pp behind → at_risk, else on_track.
 * @param {number} otjActual
 * @param {number} otjExpected
 * @returns {'on_track' | 'at_risk' | 'overdue'}
 */
export function computeRiskStatus(otjActual, otjExpected) {
  const gap = otjExpected - otjActual;
  if (gap > 30) return "overdue";
  if (gap > 15) return "at_risk";
  return "on_track";
}

/**
 * Returns display metadata for a risk status.
 * @param {'on_track' | 'at_risk' | 'overdue'} status
 */
export function riskMeta(status) {
  switch (status) {
    case "overdue":
      return { label: "Overdue", color: T.red, bg: T.redLight };
    case "at_risk":
      return { label: "At Risk", color: T.amber, bg: T.amberLight };
    default:
      return { label: "On Track", color: T.green, bg: T.greenLight };
  }
}

/**
 * Returns the accent color for a table row border based on risk status.
 * @param {'on_track' | 'at_risk' | 'overdue'} status
 */
export function riskAccent(status) {
  if (status === "overdue") return T.red;
  if (status === "at_risk") return T.amber;
  return "transparent";
}

/**
 * Formats an OTJ pace value as "X.X hrs/wk".
 * @param {number} hoursPerWeek
 */
export function formatPace(hoursPerWeek) {
  return `${Number(hoursPerWeek).toFixed(1)} hrs/wk`;
}

/**
 * Returns age of last activity as a human-readable string.
 * Expects date strings in "DD Mon YYYY" format or ISO.
 * @param {string | null | undefined} dateStr
 */
export function activityAge(dateStr) {
  if (!dateStr) return "—";
  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  const parts = dateStr.split(" ");
  const dt =
    parts.length === 3
      ? new Date(+parts[2], months[parts[1]], +parts[0])
      : new Date(dateStr);
  if (isNaN(dt)) return dateStr;
  const days = Math.floor((Date.now() - dt) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

/**
 * Returns a colour for the last-activity dot based on staleness.
 * @param {string | null | undefined} dateStr
 */
export function activityAgeColor(dateStr) {
  if (!dateStr) return T.muted;
  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  const parts = dateStr.split(" ");
  const dt =
    parts.length === 3
      ? new Date(+parts[2], months[parts[1]], +parts[0])
      : new Date(dateStr);
  if (isNaN(dt)) return T.muted;
  const days = Math.floor((Date.now() - dt) / 86400000);
  return days <= 7 ? T.green : days <= 30 ? T.amber : T.red;
}

/**
 * Returns icon name and label for an activity event type.
 * @param {'review' | 'otj_submission' | 'approval' | 'message' | 'status_change'} type
 */
export function activityTypeMeta(type) {
  switch (type) {
    case "review":
      return { label: "Review", color: "#1847d4", bg: "#e8eefb" };
    case "otj_submission":
      return { label: "OTJ Log", color: T.green, bg: T.greenLight };
    case "approval":
      return { label: "Approved", color: T.green, bg: T.greenLight };
    case "message":
      return { label: "Message", color: T.amber, bg: T.amberLight };
    case "status_change":
      return { label: "Status", color: T.red, bg: T.redLight };
    default:
      return { label: "Event", color: T.muted, bg: T.card };
  }
}

/**
 * Returns display metadata for an intervention type.
 * @param {'note' | 'message' | 'review' | 'plan'} type
 */
export function interventionTypeMeta(type) {
  switch (type) {
    case "plan":
      return { label: "Recovery Plan", color: T.red, bg: T.redLight };
    case "review":
      return { label: "Review", color: "#1847d4", bg: "#e8eefb" };
    case "message":
      return { label: "Message", color: T.amber, bg: T.amberLight };
    default:
      return { label: "Note", color: T.green, bg: T.greenLight };
  }
}

/**
 * Returns display metadata for a notification delivery status.
 * @param {'delivered' | 'pending' | 'failed'} status
 */
export function notifStatusMeta(status) {
  switch (status) {
    case "delivered":
      return { label: "Delivered", color: T.green, bg: T.greenLight };
    case "failed":
      return { label: "Failed", color: T.red, bg: T.redLight };
    default:
      return { label: "Pending", color: T.amber, bg: T.amberLight };
  }
}

/**
 * Returns display label for a notification recipient.
 * @param {'apprentice' | 'provider' | 'manager'} recipient
 */
export function recipientLabel(recipient) {
  switch (recipient) {
    case "apprentice":
      return "Apprentice";
    case "provider":
      return "Provider";
    default:
      return "Line Manager";
  }
}
