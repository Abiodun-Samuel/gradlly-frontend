"use client";

import { Inbox } from "lucide-react";

import { cn } from "@/utils/helper";

import { Pagination } from "./Pagination";

/**
 * DataTable
 *
 * Reusable, fully responsive, config-driven table.
 * Renders a real <table> on md+ screens and a stacked card list on mobile,
 * so it never needs horizontal scrolling on small devices.
 *
 * Column shape:
 *   {
 *     key:       string,                 // unique id
 *     header:    string,                 // column heading
 *     cell:      (row) => ReactNode,     // cell renderer
 *     align?:    "left" | "right" | "center",
 *     headerClassName?: string,
 *     cellClassName?:   string,
 *     hideOnMobile?:    boolean,         // omit from the mobile card
 *     mobileLabel?:     string,          // label shown on the mobile card row
 *     primary?:         boolean,         // render prominently at top of mobile card
 *   }
 *
 * @param {object}   props
 * @param {Array}    props.columns
 * @param {Array}    props.data
 * @param {Function} [props.rowKey]        (row) => string | number  (defaults to row.id)
 * @param {boolean}  [props.isLoading]
 * @param {number}   [props.skeletonRows]
 * @param {object}   [props.empty]         { icon, title, description, action }
 * @param {object}   [props.meta]          API meta for pagination
 * @param {Function} [props.onPageChange]
 * @param {string}   [props.className]
 */
export function DataTable({
  columns = [],
  data = [],
  rowKey = (row) => row.id,
  isLoading = false,
  skeletonRows = 5,
  empty,
  meta,
  onPageChange,
  className,
}) {
  const alignClass = {
    left: "text-left",
    right: "text-right",
    center: "text-center",
  };

  const mobileColumns = columns.filter((c) => !c.hideOnMobile);
  const primaryCol = mobileColumns.find((c) => c.primary) ?? mobileColumns[0];
  const secondaryCols = mobileColumns.filter((c) => c !== primaryCol);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {isLoading ? (
          <SkeletonBody columns={columns} rows={skeletonRows} />
        ) : data.length === 0 ? (
          <EmptyBody empty={empty} />
        ) : (
          <>
            {/* ── Desktop table ── */}
            <div className="hidden md:block">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        scope="col"
                        className={cn(
                          "px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-neutral-500",
                          alignClass[col.align ?? "left"],
                          col.headerClassName,
                        )}
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr
                      key={rowKey(row)}
                      className="border-b border-neutral-100 transition-colors duration-100 last:border-0 hover:bg-neutral-50/70"
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn(
                            "px-5 py-4 text-neutral-600",
                            alignClass[col.align ?? "left"],
                            col.cellClassName,
                          )}
                        >
                          {col.cell(row)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile cards ── */}
            <ul className="divide-y divide-neutral-100 md:hidden">
              {data.map((row) => (
                <li key={rowKey(row)} className="space-y-3 p-4">
                  {primaryCol ? (
                    <div className="min-w-0">{primaryCol.cell(row)}</div>
                  ) : null}
                  <dl className="space-y-2 border-t border-neutral-100 pt-3">
                    {secondaryCols.map((col) => (
                      <div
                        key={col.key}
                        className="flex items-center justify-between gap-3"
                      >
                        <dt className="text-xs font-medium text-neutral-400">
                          {col.mobileLabel ?? col.header}
                        </dt>
                        <dd className="min-w-0 text-right text-sm text-neutral-700">
                          {col.cell(row)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {!isLoading && meta ? (
        <Pagination meta={meta} onPageChange={onPageChange} />
      ) : null}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonBody({ columns, rows }) {
  return (
    <div className="divide-y divide-neutral-100">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-5 py-4">
          {columns.map((col, c) => (
            <div
              key={col.key}
              className="h-4 animate-pulse rounded-md bg-neutral-100"
              style={{ width: c === 0 ? "30%" : "16%" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyBody({ empty }) {
  const Icon = empty?.icon ?? Inbox;
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-100">
        <Icon aria-hidden className="size-6.5" strokeWidth={1.5} />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-neutral-900">
          {empty?.title ?? "Nothing here yet"}
        </p>
        {empty?.description ? (
          <p className="max-w-sm text-sm text-neutral-500">
            {empty.description}
          </p>
        ) : null}
      </div>
      {empty?.action ?? null}
    </div>
  );
}
