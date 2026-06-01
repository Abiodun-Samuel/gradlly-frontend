"use client";
// F1.1.3 — Cost-per-apprentice table with levy % bars
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";

import { APPRENTICES } from "./data";
import { fmt, statusColors } from "./helpers";
import { T } from "./tokens";

const TH = ({ children, onClick, active }) => (
  <th
    className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider select-none"
    style={{
      color: active ? T.blue : T.muted,
      cursor: onClick ? "pointer" : "default",
    }}
    onClick={onClick}
  >
    {children}
  </th>
);

export function ApprenticeTable() {
  const [dir, setDir] = useState("desc");
  const rows = [...APPRENTICES].sort((a, b) =>
    dir === "desc" ? b.cost - a.cost : a.cost - b.cost,
  );
  const total = APPRENTICES.reduce((s, r) => s + r.cost, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Cost Per Apprentice</p>
            <h2 className="mt-0.5 text-base font-semibold text-neutral-900">
              Active programme costs
            </h2>
          </div>
          <Link
            href="/apprentices"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-80"
            style={{ backgroundColor: T.blueLight, color: T.blue }}
          >
            <PlusCircle className="h-3.5 w-3.5" /> Add
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ borderBottom: `1px solid ${T.border}` }}>
              <tr>
                <TH>Apprentice</TH>
                <TH
                  active
                  onClick={() => setDir((d) => (d === "desc" ? "asc" : "desc"))}
                >
                  Cost {dir === "desc" ? "↓" : "↑"}
                </TH>
                <TH>Levy %</TH>
                <TH>Status</TH>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const sc = statusColors(r.sc);
                return (
                  <tr
                    key={r.id}
                    className="transition-colors hover:bg-neutral-50 cursor-pointer"
                    style={{
                      borderBottom:
                        i < rows.length - 1 ? `1px solid ${T.border}` : "none",
                    }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                          style={{
                            backgroundColor: T.blueLight,
                            color: T.blue,
                          }}
                        >
                          {r.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p
                            className="text-xs font-semibold"
                            style={{ color: T.ink }}
                          >
                            {r.name}
                          </p>
                          <p className="text-[10px]" style={{ color: T.muted }}>
                            {r.standard}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-bold tabular-nums"
                        style={{ color: T.ink }}
                      >
                        {fmt(r.cost)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 min-w-[64px]">
                        <div
                          className="flex-1 h-1.5 rounded-full overflow-hidden"
                          style={{ backgroundColor: T.border }}
                        >
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${r.levyPct}%`,
                              backgroundColor:
                                r.levyPct === 100 ? T.green : T.amber,
                            }}
                          />
                        </div>
                        <span
                          className="text-[10px] font-bold w-7 text-right"
                          style={{ color: T.muted }}
                        >
                          {r.levyPct}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: sc.bg, color: sc.text }}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: T.card }}>
                <td
                  colSpan={4}
                  className="px-4 py-3 text-xs font-bold"
                  style={{ color: T.ink }}
                >
                  Total committed:{" "}
                  <span style={{ color: T.blue }}>{fmt(total)}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
