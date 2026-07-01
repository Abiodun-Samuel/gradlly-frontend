"use client";

import { ArrowDownCircle, ExternalLink, Receipt } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { InputField } from "@/components/form/InputField";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { cn, formatDate } from "@/utils/helper";

import { useFundingPayments } from "../queries/das.query";

function money(value, currency = "GBP") {
  if (value === null || value === undefined) return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency || "GBP",
  }).format(n);
}

function AmountCell({ payment }) {
  const isClawback = payment.clawbackNotice !== null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold tabular-nums",
        isClawback ? "text-danger-600" : "text-neutral-800",
      )}
    >
      {isClawback ? (
        <ArrowDownCircle className="size-3.5 shrink-0" aria-hidden />
      ) : null}
      {money(payment.amount, payment.currency)}
    </span>
  );
}

export function FundingPaymentsTable() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const params = useMemo(
    () => ({ page, perPage, from: from || undefined, to: to || undefined }),
    [page, perPage, from, to],
  );

  const { data, isLoading, isFetching } = useFundingPayments(params);
  const payments = data?.payments ?? [];
  const meta = data?.meta ?? null;

  const changePerPage = (next) => {
    setPerPage(next);
    setPage(1);
  };

  const columns = [
    {
      key: "paymentDate",
      header: "Date",
      primary: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-neutral-800">
            {formatDate(row.paymentDate)}
          </span>
          {row.clawbackNotice !== null ? (
            <span className="rounded-full bg-danger-50 px-2 py-0.5 text-[10px] font-bold text-danger-600 ring-1 ring-inset ring-danger-200">
              Clawback
            </span>
          ) : null}
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      mobileLabel: "Amount",
      cell: (row) => <AmountCell payment={row} />,
    },
    {
      key: "fundingPeriod",
      header: "Period",
      mobileLabel: "Period",
      cell: (row) => (
        <span className="text-neutral-600">{row.fundingPeriod || "—"}</span>
      ),
    },
    {
      key: "externalReference",
      header: "Reference",
      mobileLabel: "Reference",
      cell: (row) => (
        <span className="font-mono text-xs text-neutral-500">
          {row.externalReference}
        </span>
      ),
    },
    {
      key: "enrolmentId",
      header: "Enrolment",
      align: "right",
      mobileLabel: "Enrolment",
      cell: (row) =>
        row.enrolmentId ? (
          <Link
            href={`/enrolments/${row.enrolmentId}`}
            title="View enrolment"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary-700 hover:underline"
          >
            <ExternalLink className="size-3.5" aria-hidden />
            View
          </Link>
        ) : (
          <span className="text-neutral-300">—</span>
        ),
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="size-4 text-neutral-400" aria-hidden />
          <h2 className="text-base font-semibold text-neutral-900">
            Funding payments
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <InputField
            name="from"
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setPage(1);
            }}
          />
          <span className="text-xs text-neutral-400">to</span>
          <InputField
            name="to"
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={payments}
          rowKey={(row) => row.id}
          isLoading={isLoading}
          meta={meta}
          onPageChange={setPage}
          onPerPageChange={changePerPage}
          empty={{
            icon: Receipt,
            title: "No funding payments",
            description:
              "Payments synced from DAS appear here. Try a manual sync or widen the date range.",
          }}
          className={cn(
            isFetching && !isLoading && "opacity-70 transition-opacity",
          )}
        />
      </CardContent>
    </Card>
  );
}
