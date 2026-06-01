"use client";
import { useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";

import { SME_DIR } from "./data";
import { SMECard } from "./SMECard";

const SECTORS = [
  "All",
  "Manufacturing",
  "Construction",
  "Technology",
  "Hospitality",
];
const LOCS = ["All", "Coventry", "Birmingham", "Wolverhampton", "Solihull"];
const RANGES = ["All", "Under £5k", "£5k–£10k", "Over £10k"];
const SORTS = [
  "Best match",
  "Funding needed (low–high)",
  "Funding needed (high–low)",
  "Alphabetical",
];

function inRange(n, r) {
  if (r === "Under £5k") return n < 5000;
  if (r === "£5k–£10k") return n >= 5000 && n <= 10000;
  if (r === "Over £10k") return n > 10000;
  return true;
}

export function SMEFinder({ searchRef, onRequestMatch }) {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("All");
  const [loc, setLoc] = useState("All");
  const [range, setRange] = useState("All");
  const [verified, setVerified] = useState(false);
  const [sort, setSort] = useState("Best match");

  const isFiltering =
    q || sector !== "All" || loc !== "All" || range !== "All" || verified;
  const matchedIds = new Set(
    SME_DIR.filter(
      (s) =>
        (!q ||
          [s.name, s.sector, s.location].some((v) =>
            v.toLowerCase().includes(q.toLowerCase()),
          )) &&
        (sector === "All" || s.sector === sector) &&
        (loc === "All" || s.location === loc) &&
        inRange(s.fundingNeeded, range) &&
        (!verified || s.learnfloVerified),
    ).map((s) => s.id),
  );

  const sorted = [...SME_DIR].sort((a, b) => {
    if (sort === "Best match") return b.matchScore - a.matchScore;
    if (sort === "Funding needed (low–high)")
      return a.fundingNeeded - b.fundingNeeded;
    if (sort === "Funding needed (high–low)")
      return b.fundingNeeded - a.fundingNeeded;
    return a.name.localeCompare(b.name);
  });

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
    >
      <div
        className="px-5 py-4 flex items-center justify-between flex-wrap gap-3"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        <div>
          <p className="text-sm font-bold" style={{ color: T.ink }}>
            Find SME recipients
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
            Learnflo-verified SME partners in your region
          </p>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none"
          style={{
            borderColor: T.border,
            color: T.ink,
            backgroundColor: T.surface,
          }}
        >
          {SORTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div
        className="px-5 py-3 space-y-2"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none"
            style={{ color: T.muted }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search by name, sector, or location…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-8 pr-3.5 py-2 rounded-xl text-xs border focus:outline-none"
            style={{
              borderColor: T.border,
              color: T.ink,
              backgroundColor: T.card,
            }}
          />
        </div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {SECTORS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSector(s)}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-150"
                style={{
                  backgroundColor: sector === s ? T.green : T.card,
                  color: sector === s ? "#fff" : T.subtle,
                  border: `1px solid ${sector === s ? T.green : T.border}`,
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {[
              [LOCS, loc, setLoc],
              [RANGES, range, setRange],
            ].map(([opts, val, setter], i) => (
              <select
                key={i}
                value={val}
                onChange={(e) => setter(e.target.value)}
                className="text-[11px] px-2 py-1 rounded-lg border focus:outline-none"
                style={{
                  borderColor: T.border,
                  color: T.ink,
                  backgroundColor: T.surface,
                }}
              >
                {opts.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ))}
            <label
              className="flex items-center gap-1.5 text-[11px] cursor-pointer whitespace-nowrap"
              style={{ color: T.subtle }}
            >
              <input
                type="checkbox"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
                style={{ accentColor: T.green }}
              />
              Verified only
            </label>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-2.5">
        {sorted.map((s, i) => (
          <SMECard
            key={s.id}
            sme={s}
            index={i}
            faded={isFiltering && !matchedIds.has(s.id)}
            onRequestMatch={onRequestMatch}
          />
        ))}
      </div>
    </div>
  );
}
