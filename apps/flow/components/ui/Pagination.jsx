"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/utils/helper";

/**
 * Builds a compact page list with ellipses, e.g. [1, '…', 4, 5, 6, '…', 12].
 * Always shows first and last page, plus a window around the current page.
 */
function buildPageItems(page, totalPages, siblings = 1) {
  const totalNumbers = siblings * 2 + 5;
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, totalPages);
  const showLeftDots = left > 2;
  const showRightDots = right < totalPages - 1;

  const items = [1];
  if (showLeftDots) items.push("left-dots");
  for (
    let p = showLeftDots ? left : 2;
    p <= (showRightDots ? right : totalPages - 1);
    p++
  ) {
    items.push(p);
  }
  if (showRightDots) items.push("right-dots");
  items.push(totalPages);
  return items;
}

const DEFAULT_PER_PAGE_OPTIONS = [10, 20, 50, 100];

/**
 * Pagination
 *
 * Reusable, fully responsive pager driven by an API `meta` object. Optionally
 * renders a "rows per page" selector when `onPerPageChange` is provided.
 *
 * @param {object}   props
 * @param {object}   props.meta              { total, page, perPage, totalPages, hasNextPage, hasPreviousPage }
 * @param {Function} props.onPageChange      (nextPage:number) => void
 * @param {Function} [props.onPerPageChange] (perPage:number) => void  — enables the selector
 * @param {number[]} [props.perPageOptions]  options for the selector (default 10/20/50/100)
 * @param {boolean}  [props.disabled]
 * @param {string}   [props.className]
 */
export function Pagination({
  meta,
  onPageChange,
  onPerPageChange,
  perPageOptions = DEFAULT_PER_PAGE_OPTIONS,
  disabled = false,
  className,
}) {
  if (!meta) return null;

  const {
    total = 0,
    page = 1,
    perPage = 20,
    totalPages = 1,
    hasNextPage = false,
    hasPreviousPage = false,
  } = meta;

  const showPerPage = typeof onPerPageChange === "function";
  // Hide the whole bar only when there is nothing to page AND no selector to show.
  if (totalPages <= 1 && !showPerPage) return null;

  const items = buildPageItems(page, totalPages);
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  const go = (p) => {
    if (disabled) return;
    if (p < 1 || p > totalPages || p === page) return;
    onPageChange?.(p);
  };

  const arrowBtn = cn(
    "flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600",
    "transition-colors duration-150 hover:bg-neutral-50 hover:text-neutral-900",
    "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white",
  );

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-3 sm:flex-row",
        className,
      )}
    >
      {/* Left: summary + per-page selector */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
        <p className="text-xs text-neutral-500">
          Showing <span className="font-semibold text-neutral-700">{from}</span>
          {" to "}
          <span className="font-semibold text-neutral-700">{to}</span>
          {" of "}
          <span className="font-semibold text-neutral-700">{total}</span>
        </p>

        {showPerPage ? (
          <label className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="hidden sm:inline">Rows per page</span>
            <select
              value={perPage}
              disabled={disabled}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
              aria-label="Rows per page"
              className={cn(
                "h-8 rounded-lg border border-neutral-200 bg-white pl-2.5 pr-7 text-xs font-medium text-neutral-700",
                "transition-colors duration-150 hover:border-neutral-300",
                "focus:border-primary-400 focus:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              {perPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {/* Right: page navigation (hidden when only one page) */}
      {totalPages > 1 ? (
        <nav className="flex items-center gap-1" aria-label="Pagination">
          <button
            type="button"
            onClick={() => go(page - 1)}
            disabled={disabled || !hasPreviousPage}
            aria-label="Previous page"
            className={arrowBtn}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>

          {items.map((item, i) =>
            typeof item === "string" ? (
              <span
                key={`${item}-${i}`}
                className="flex h-9 w-9 items-center justify-center text-neutral-400"
                aria-hidden
              >
                <MoreHorizontal className="size-4" />
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => go(item)}
                disabled={disabled}
                aria-current={item === page ? "page" : undefined}
                className={cn(
                  "flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-semibold transition-colors duration-150",
                  item === page
                    ? "border-primary-700 bg-primary-700 text-white shadow-sm shadow-primary-700/20"
                    : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
                )}
              >
                {item}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => go(page + 1)}
            disabled={disabled || !hasNextPage}
            aria-label="Next page"
            className={arrowBtn}
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </nav>
      ) : null}
    </div>
  );
}
