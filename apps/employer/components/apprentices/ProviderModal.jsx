"use client";
import { Copy, Mail, Phone, Send } from "lucide-react";
import { useState } from "react";

import { Modal } from "@/components/ui/Modal";
import { toastSuccess } from "@/hooks/useToast";

import { T } from "./tokens";

export function ProviderModal({ open, apprentice, onClose }) {
  const [sent, setSent] = useState(false);
  const a = apprentice;
  const c = a?.providerContact;

  const [msg, setMsg] = useState(
    () =>
      `Hi ${c?.name},\n\nI'm writing regarding ${a?.name}'s OTJ progress. They are currently at ${a?.otjActual}% against an expected ${a?.otjExpected}%. Could we arrange a call to discuss a catch-up plan?\n\nBest regards,\nSarah Rahman`,
  );

  const handleSend = () => {
    setSent(true);
    toastSuccess(`Message sent to ${c?.name}`);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={`Contact ${a?.provider}`}
      description={`Re: ${a?.name} — ${a?.standard}`}
      footer={
        <>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(c?.email ?? "");
              toastSuccess("Email copied");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border hover:opacity-75 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            <Copy className="h-3.5 w-3.5" /> Copy email
          </button>
          {!sent ? (
            <button
              type="button"
              onClick={handleSend}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold hover:opacity-80 transition-opacity"
              style={{ backgroundColor: T.blue, color: "#fff" }}
            >
              <Send className="h-3.5 w-3.5" /> Send message
            </button>
          ) : (
            <span
              className="px-4 py-2 text-sm font-semibold"
              style={{ color: T.green }}
            >
              ✓ Message sent
            </span>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <div
          className="rounded-xl px-4 py-3 space-y-2"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        >
          <p className="text-sm font-semibold" style={{ color: T.ink }}>
            {c?.name}
          </p>
          <a
            href={`mailto:${c?.email}`}
            className="flex items-center gap-1.5 text-xs hover:underline"
            style={{ color: T.blue }}
          >
            <Mail className="h-3.5 w-3.5" /> {c?.email}
          </a>
          <a
            href={`tel:${c?.phone}`}
            className="flex items-center gap-1.5 text-xs hover:underline"
            style={{ color: T.blue }}
          >
            <Phone className="h-3.5 w-3.5" /> {c?.phone}
          </a>
        </div>

        <div>
          <label
            className="block text-xs font-semibold mb-1.5"
            style={{ color: T.muted }}
          >
            Message
          </label>
          <textarea
            rows={6}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-xs resize-none focus:outline-none"
            style={{
              backgroundColor: T.card,
              border: `1px solid ${T.border}`,
              color: T.ink,
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
