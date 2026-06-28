import { Download } from "lucide-react";

import { T } from "./tokens";

const TYPE_COLOR = {
  Commitment: T.blue,
  Review: T.green,
  Correspondence: T.muted,
};

function Badge({ type }) {
  const color = TYPE_COLOR[type] ?? T.muted;
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {type}
    </span>
  );
}

const DOCS = [
  {
    name: "Commitment statement (CS-001)",
    type: "Commitment",
    date: "01 Mar 2024",
  },
  { name: "6-month review record", type: "Review", date: "03 Sep 2024" },
];

export function ProfileDocuments({ a }) {
  const docs = a?.documents ?? DOCS;
  if (!docs.length) {
    return (
      <p className="text-sm text-center py-8" style={{ color: T.muted }}>
        No documents yet
      </p>
    );
  }
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${T.border}` }}
    >
      {docs.map((d, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-3 px-4 py-3"
          style={{
            borderBottom:
              i < docs.length - 1 ? `1px solid ${T.border}` : "none",
            backgroundColor: i % 2 === 0 ? T.surface : T.card,
          }}
        >
          <div className="min-w-0">
            <p
              className="text-xs font-semibold truncate"
              style={{ color: T.ink }}
            >
              {d.name}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
              {d.date}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge type={d.type} />
            <button
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold hover:opacity-80"
              style={{ backgroundColor: T.blueLight, color: T.blue }}
            >
              <Download className="h-3 w-3" /> Download
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
