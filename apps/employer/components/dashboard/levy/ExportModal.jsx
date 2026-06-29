"use client";
// F1.1.5 — Levy Report Export: PDF download + monthly email scheduling

import { Download, FileText, Send } from "lucide-react";
import { useState } from "react";

import { Modal } from "@/components/ui/Modal";
import { toastDefault, toastSuccess } from "@/hooks/useToast";

import { T } from "./tokens";

const INCLUDES = [
  "Available levy balance (live from DAS)",
  "Monthly contributions — last 12 months",
  "Annual utilisation breakdown",
  "12-month spend forecast",
  "Active apprentice count & cost summary",
  "Expiry schedule — next 24 months",
];

export function ExportModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [exporting, setExp] = useState(false);

  function handleExport() {
    setExp(true);
    toastDefault("Generating board-ready PDF report…");
    setTimeout(() => {
      setExp(false);
      toastSuccess("Levy report downloaded (under 10s)");
      onClose();
    }, 2000);
  }

  function handleEmail() {
    if (!email.trim()) return;
    toastSuccess(`Monthly report scheduled for ${email}`);
    setEmail("");
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title="Export Levy Report"
      description="Board-ready PDF · Midlands Engineering Ltd · Gradlly"
    >
      <div className="space-y-4">
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4" style={{ color: T.blue }} />
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: T.muted }}
            >
              Report includes
            </p>
          </div>
          <ul className="space-y-1.5">
            {INCLUDES.map((item) => (
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

        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm hover:opacity-80 transition-opacity disabled:opacity-60"
          style={{ backgroundColor: T.blue, color: "#fff" }}
        >
          <Download className="h-4 w-4" />
          {exporting ? "Generating PDF…" : "Download PDF Report"}
        </button>

        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: T.subtle }}>
            Schedule monthly email report
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@company.co.uk"
              className="flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              style={{
                borderColor: T.border,
                color: T.ink,
                backgroundColor: T.surface,
              }}
            />
            <button
              type="button"
              onClick={handleEmail}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm hover:opacity-80 transition-opacity"
              style={{ backgroundColor: T.greenLight, color: T.green }}
            >
              <Send className="h-3.5 w-3.5" /> Schedule
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
