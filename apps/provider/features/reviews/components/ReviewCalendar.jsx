"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { cn } from "@/utils/helper";

import { REVIEW_STATUS } from "../constants";
import { useReviewCalendar } from "../queries/reviews.query";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DOT_COLOR = {
  [REVIEW_STATUS.SCHEDULED]: "bg-sky-500",
  [REVIEW_STATUS.IN_PROGRESS]: "bg-blue-500",
  [REVIEW_STATUS.AWAITING_SIGNATURES]: "bg-amber-500",
  [REVIEW_STATUS.COMPLETED]: "bg-emerald-500",
  [REVIEW_STATUS.CANCELLED]: "bg-neutral-300",
};

// Local YYYY-MM-DD key for grouping reviews by day.
function dayKey(date) {
  const off = date.getTimezoneOffset();
  return new Date(date.getTime() - off * 60000).toISOString().slice(0, 10);
}

// Build the 6-week grid (Mon-first) covering the given month.
function buildGrid(year, month) {
  const first = new Date(year, month, 1);
  // JS getDay: 0=Sun..6=Sat → shift so Monday is column 0.
  const lead = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - lead);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + i,
    );
    return d;
  });
}

export function ReviewCalendar() {
  const today = new Date();
  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  // Month bounds for the API (from/to required).
  const from = useMemo(
    () => new Date(year, month, 1).toISOString(),
    [year, month],
  );
  const to = useMemo(
    () => new Date(year, month + 1, 0, 23, 59, 59).toISOString(),
    [year, month],
  );

  const {
    data: reviews = [],
    isLoading,
    isFetching,
  } = useReviewCalendar({
    from,
    to,
  });

  // Group reviews by local day.
  const byDay = useMemo(() => {
    const map = new Map();
    for (const r of reviews) {
      if (!r.scheduledAt) continue;
      const key = dayKey(new Date(r.scheduledAt));
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    }
    return map;
  }, [reviews]);

  const grid = useMemo(() => buildGrid(year, month), [year, month]);
  const todayKey = dayKey(today);
  const monthLabel = cursor.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const goPrev = () => setCursor(new Date(year, month - 1, 1));
  const goNext = () => setCursor(new Date(year, month + 1, 1));
  const goToday = () =>
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous month"
            className="flex size-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-neutral-50"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next month"
            className="flex size-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-neutral-50"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
          <h2 className="ml-1 text-base font-semibold text-neutral-900">
            {monthLabel}
          </h2>
          {isFetching && !isLoading ? (
            <Loader2
              className="size-4 animate-spin text-neutral-300"
              aria-hidden
            />
          ) : null}
        </div>
        <button
          type="button"
          onClick={goToday}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Today
        </button>
      </div>

      {/* Grid */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="grid grid-cols-7 border-b border-neutral-200 bg-neutral-50">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-neutral-500"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {grid.map((date) => {
            const key = dayKey(date);
            const inMonth = date.getMonth() === month;
            const isToday = key === todayKey;
            const dayReviews = byDay.get(key) ?? [];

            return (
              <div
                key={key}
                className={cn(
                  "min-h-24 border-b border-r border-neutral-100 p-1.5 last:border-r-0",
                  !inMonth && "bg-neutral-50/50",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full text-xs",
                      isToday
                        ? "bg-primary-600 font-semibold text-white"
                        : inMonth
                          ? "text-neutral-700"
                          : "text-neutral-300",
                    )}
                  >
                    {date.getDate()}
                  </span>
                </div>

                <div className="mt-1 space-y-1">
                  {dayReviews.slice(0, 3).map((r) => (
                    <Link
                      key={r.id}
                      href={`/reviews/${r.id}`}
                      title={r.title || "Progress review"}
                      className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] text-neutral-700 transition-colors hover:bg-neutral-100"
                    >
                      <span
                        className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          DOT_COLOR[r.status] ?? "bg-neutral-300",
                        )}
                        aria-hidden
                      />
                      <span className="truncate">{r.title || "Review"}</span>
                    </Link>
                  ))}
                  {dayReviews.length > 3 ? (
                    <p className="px-1.5 text-[10px] font-medium text-neutral-400">
                      +{dayReviews.length - 3} more
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
