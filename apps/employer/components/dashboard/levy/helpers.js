import { T } from "./tokens";

export const fmt = (n) => "£" + n.toLocaleString("en-GB");

export function scoreColor(s) {
  if (s < 40) return T.red;
  if (s < 70) return T.amber;
  return T.green;
}

export function urgencyStyle(u) {
  const map = {
    urgent: { bg: T.red, light: T.redLight },
    warning: { bg: T.amber, light: T.amberLight },
    scheduled: { bg: "#9ca3af", light: "#f3f4f6" },
    future: { bg: "#c8c5bf", light: T.bg },
  };
  return map[u] ?? null;
}

export function statusColors(c) {
  if (c === "green") return { bg: T.greenLight, text: T.green };
  if (c === "amber") return { bg: T.amberLight, text: T.amber };
  return { bg: T.redLight, text: T.red };
}

export function fmtAgo(date) {
  if (!date) return "—";
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}
