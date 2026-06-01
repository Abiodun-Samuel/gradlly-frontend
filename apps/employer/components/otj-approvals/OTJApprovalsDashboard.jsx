"use client";
import { Bell, Settings } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { T } from "@/components/dashboard/levy/tokens";

import { OTJ_QUEUE } from "./data";
import { OTJBulkToolbar } from "./OTJBulkToolbar";
import { OTJEvidenceModal } from "./OTJEvidenceModal";
import { OTJFilterBar } from "./OTJFilterBar";
import { OTJNotificationDrawer } from "./OTJNotificationDrawer";
import { OTJQueueCard } from "./OTJQueueCard";
import { OTJSummaryBanner } from "./OTJSummaryBanner";

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <div
        className="h-16 w-16 rounded-full flex items-center justify-center text-3xl"
        style={{ backgroundColor: T.greenLight }}
      >
        ✓
      </div>
      <p className="text-base font-bold" style={{ color: T.ink }}>
        All caught up
      </p>
      <p className="text-sm max-w-xs" style={{ color: T.muted }}>
        No OTJ entries pending approval. Check back after the next digest on
        Monday 07 Apr.
      </p>
      <button
        type="button"
        className="text-sm font-semibold hover:underline mt-1"
        style={{ color: T.blue }}
      >
        View approved entries →
      </button>
    </div>
  );
}

export function OTJApprovalsDashboard() {
  const [entries] = useState(OTJ_QUEUE);
  const [approved, setApproved] = useState(new Set());
  const [rejected, setRejected] = useState(new Set());
  const [selected, setSelected] = useState(new Set());
  const [tab, setTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [evidence, setEvidence] = useState(null);
  const [notif, setNotif] = useState(false);

  const pending = entries.filter(
    (e) => !approved.has(e.id) && !rejected.has(e.id),
  );
  const visible = (
    tab === "approved"
      ? entries.filter((e) => approved.has(e.id))
      : tab === "rejected"
        ? entries.filter((e) => rejected.has(e.id))
        : pending
  ).filter(
    (e) =>
      !search ||
      e.apprentice.toLowerCase().includes(search.toLowerCase()) ||
      e.activity.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleSelect = (id) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const onApprove = (id) => {
    setApproved((s) => new Set([...s, id]));
    toast.success("Entry approved");
  };
  const onReject = (id) => {
    setRejected((s) => new Set([...s, id]));
    toast.error("Entry rejected");
  };
  const bulkApprove = () => {
    const ids = selected.size > 0 ? [...selected] : pending.map((e) => e.id);
    setApproved((s) => new Set([...s, ...ids]));
    setSelected(new Set());
    toast.success(`${ids.length} entries approved`);
  };

  return (
    <div
      className="space-y-5"
      style={{ animation: "slide-up 320ms var(--ease-out) both" }}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs" style={{ color: T.muted }}>
            Midlands Engineering → OTJ Approvals
          </p>
          <h1 className="text-xl font-extrabold" style={{ color: T.ink }}>
            OTJ approvals
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setNotif(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            <Settings className="h-3.5 w-3.5" /> Notification settings
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-xl border hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>

      <OTJSummaryBanner pending={pending.length} onBulkApprove={bulkApprove} />
      <OTJFilterBar
        tab={tab}
        onTab={setTab}
        search={search}
        onSearch={setSearch}
      />

      <div className="space-y-3">
        {visible.length === 0 ? (
          <EmptyState />
        ) : (
          visible.map((entry, i) => (
            <OTJQueueCard
              key={entry.id}
              entry={entry}
              index={i}
              selected={selected.has(entry.id)}
              onSelect={() => toggleSelect(entry.id)}
              onApprove={onApprove}
              onReject={onReject}
              onEvidence={setEvidence}
            />
          ))
        )}
      </div>

      <OTJBulkToolbar
        count={selected.size}
        onApprove={bulkApprove}
        onReject={() => {}}
        onClear={() => setSelected(new Set())}
      />
      {evidence && (
        <OTJEvidenceModal entry={evidence} onClose={() => setEvidence(null)} />
      )}
      {notif && <OTJNotificationDrawer onClose={() => setNotif(false)} />}
    </div>
  );
}
