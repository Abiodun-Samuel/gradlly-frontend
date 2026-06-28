"use client";
import { Download } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { T } from "@/components/dashboard/levy/tokens";
import { Modal } from "@/components/ui/Modal";

export function ReportPreviewModal({ open, report, onClose }) {
  const [from, setFrom] = useState("2025-04-01");
  const [to, setTo] = useState("2026-03-31");
  const [format, setFormat] = useState("PDF");
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(`${report?.title} — ${format} downloaded`);
      onClose();
    }, 2000);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={report ? `${report.icon} ${report.title}` : ""}
      description={report?.sub}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold border hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={generate}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold hover:opacity-80 transition-all disabled:opacity-50"
            style={{ backgroundColor: T.blue, color: "#fff" }}
          >
            <Download className="h-4 w-4" />
            {loading ? "Generating…" : `Download ${format}`}
          </button>
        </>
      }
    >
      {report && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label
                className="block text-[10px] font-semibold mb-1"
                style={{ color: T.muted }}
              >
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg text-xs border focus:outline-none"
                style={{
                  borderColor: T.border,
                  color: T.ink,
                  backgroundColor: T.surface,
                }}
              >
                {["PDF", "CSV", "XLSX"].map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="block text-[10px] font-semibold mb-1"
                style={{ color: T.muted }}
              >
                From
              </label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg text-xs border focus:outline-none"
                style={{
                  borderColor: T.border,
                  color: T.ink,
                  backgroundColor: T.surface,
                }}
              />
            </div>
            <div>
              <label
                className="block text-[10px] font-semibold mb-1"
                style={{ color: T.muted }}
              >
                To
              </label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg text-xs border focus:outline-none"
                style={{
                  borderColor: T.border,
                  color: T.ink,
                  backgroundColor: T.surface,
                }}
              />
            </div>
          </div>

          <div
            className="rounded-xl p-3.5"
            style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-wide mb-2.5"
              style={{ color: T.muted }}
            >
              Report includes
            </p>
            <ul className="space-y-2">
              {report.includes.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-xs"
                  style={{ color: T.ink }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: T.green }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[11px]" style={{ color: T.muted }}>
            Last generated:{" "}
            <span className="font-medium" style={{ color: T.ink }}>
              {report.lastGenerated}
            </span>
          </p>
        </div>
      )}
    </Modal>
  );
}
