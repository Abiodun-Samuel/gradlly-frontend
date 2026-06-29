import { T } from "./tokens";

export const statusMeta = (s) =>
  s === "on_track"
    ? { label: "On track", color: T.green, bg: T.greenLight }
    : s === "at_risk"
      ? { label: "At risk", color: T.amber, bg: T.amberLight }
      : s === "overdue"
        ? { label: "Overdue", color: T.red, bg: T.redLight }
        : s === "epa_ready"
          ? { label: "EPA Ready", color: "#1847d4", bg: "#e8eefb" }
          : s === "epa_imminent"
            ? { label: "EPA imminent", color: T.red, bg: T.redLight }
            : { label: "Unknown", color: T.muted, bg: T.card };

export const otjColor = (actual, expected) =>
  actual - expected >= 0 ? T.green : actual - expected >= -15 ? T.amber : T.red;

export const attendanceColor = (p) =>
  p >= 90 ? T.green : p >= 80 ? T.amber : T.red;

export const epaDays = (days) =>
  days < 60
    ? { color: T.red, label: `${days}d` }
    : days < 180
      ? { color: T.amber, label: `${days}d` }
      : null;
