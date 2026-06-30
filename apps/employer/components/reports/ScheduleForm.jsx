"use client";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { T } from "@/components/dashboard/levy/tokens";

import { REPORT_TYPES, FREQUENCIES } from "./data";

export function ScheduleForm({ onViewSchedules }) {
  const [type, setType] = useState("");
  const [freq, setFreq] = useState("Monthly");
  const [emails, setEmails] = useState(["sarah.rahman@midlands-eng.co.uk"]);
  const [newEmail, setNewEmail] = useState("");
  const [condition, setCondition] = useState(false);
  const [sending, setSending] = useState(false);

  const canSchedule = !!type && emails.length > 0;

  const addEmail = () => {
    const trimmed = newEmail.trim();
    if (trimmed.includes("@") && !emails.includes(trimmed)) {
      setEmails((e) => [...e, trimmed]);
      setNewEmail("");
    }
  };

  const submit = () => {
    if (!canSchedule || sending) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success(
        `${type} report scheduled ${freq.toLowerCase()} → ${emails.length} recipient${emails.length > 1 ? "s" : ""}`,
      );
      setType("");
    }, 1200);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: T.surface, border: `1px solid ${T.border}` }}
    >
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        <div>
          <p className="text-sm font-bold" style={{ color: T.ink }}>
            Schedule a report
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
            Automate delivery to your team
          </p>
        </div>
        <button
          type="button"
          onClick={onViewSchedules}
          className="text-[11px] font-semibold hover:underline"
          style={{ color: T.blue }}
        >
          View schedules →
        </button>
      </div>
      <div className="p-5 space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              className="block text-[10px] font-semibold mb-1"
              style={{ color: T.muted }}
            >
              Report type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-xs border focus:outline-none"
              style={{
                borderColor: T.border,
                color: type ? T.ink : T.muted,
                backgroundColor: T.surface,
              }}
            >
              <option value="">Select report…</option>
              {REPORT_TYPES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="block text-[10px] font-semibold mb-1"
              style={{ color: T.muted }}
            >
              Frequency
            </label>
            <select
              value={freq}
              onChange={(e) => setFreq(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-xs border focus:outline-none"
              style={{
                borderColor: T.border,
                color: T.ink,
                backgroundColor: T.surface,
              }}
            >
              {FREQUENCIES.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            className="block text-[10px] font-semibold mb-1.5"
            style={{ color: T.muted }}
          >
            Recipients ({emails.length})
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {emails.map((e) => (
              <span
                key={e}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                style={{ backgroundColor: T.blueLight, color: T.blue }}
              >
                {e}
                <button
                  type="button"
                  onClick={() => setEmails((em) => em.filter((x) => x !== e))}
                  className="hover:opacity-70 ml-0.5"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addEmail()}
              placeholder="Add recipient email…"
              className="flex-1 px-3 py-1.5 rounded-lg text-xs border focus:outline-none"
              style={{
                borderColor: T.border,
                color: T.ink,
                backgroundColor: T.surface,
              }}
            />
            <button
              type="button"
              onClick={addEmail}
              className="flex h-8 w-8 items-center justify-center rounded-lg border hover:opacity-75"
              style={{ borderColor: T.border, color: T.subtle }}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <label
          className="flex items-center gap-2 cursor-pointer text-xs"
          style={{ color: T.subtle }}
        >
          <input
            type="checkbox"
            checked={condition}
            onChange={(e) => setCondition(e.target.checked)}
            style={{ accentColor: T.blue }}
          />
          Only send if at-risk learner count &gt; 0
        </label>

        <button
          type="button"
          onClick={submit}
          disabled={!canSchedule || sending}
          className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-80 disabled:opacity-40"
          style={{
            backgroundColor: canSchedule ? T.blue : T.border2,
            color: canSchedule ? "#fff" : T.muted,
          }}
        >
          {sending ? "⟳ Scheduling…" : "Schedule report"}
        </button>
      </div>
    </div>
  );
}
