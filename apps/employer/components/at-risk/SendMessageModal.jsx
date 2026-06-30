"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/Modal";
import { useSendMessage } from "@/features/at-risk/queries/at-risk.query";

import { T } from "./tokens";

const RECIPIENTS = [
  { key: "apprentice", label: "Apprentice" },
  { key: "provider", label: "Provider / Tutor" },
  { key: "manager", label: "Line Manager" },
];

/**
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   apprenticeId: string,
 *   apprenticeName: string
 * }} props
 */
export function SendMessageModal({
  open,
  onClose,
  apprenticeId,
  apprenticeName,
}) {
  const { mutate, isPending } = useSendMessage(apprenticeId);

  const [form, setForm] = useState({
    recipient: "apprentice",
    subject: "",
    body: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.subject.trim()) e.subject = "Subject is required.";
    if (!form.body.trim()) e.body = "Message body is required.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }
    mutate(form, {
      onSuccess: () => {
        onClose();
        setForm({ recipient: "apprentice", subject: "", body: "" });
      },
    });
  };

  const inputCls =
    "w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-100";
  const inputStyle = {
    backgroundColor: T.surface,
    borderColor: T.border,
    color: T.ink,
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title="Send Message"
      description={`Regarding ${apprenticeName}`}
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold border hover:opacity-80 transition-opacity"
            style={{ borderColor: T.border, color: T.subtle }}
          >
            Cancel
          </button>
          <button
            form="message-form"
            type="submit"
            disabled={isPending}
            className="px-4 py-2 rounded-xl text-xs font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: T.blue, color: "#fff" }}
          >
            {isPending ? "Sending…" : "Send Message"}
          </button>
        </div>
      }
    >
      <form
        id="message-form"
        onSubmit={handleSubmit}
        className="space-y-4"
        noValidate
      >
        {/* Recipient */}
        <div>
          <label
            className="block text-xs font-semibold mb-1.5"
            style={{ color: T.ink }}
          >
            Recipient
          </label>
          <div
            className="flex gap-2"
            role="group"
            aria-label="Message recipient"
          >
            {RECIPIENTS.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => handleChange("recipient", r.key)}
                aria-pressed={form.recipient === r.key}
                className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-all"
                style={{
                  backgroundColor:
                    form.recipient === r.key ? T.blue : T.surface,
                  color: form.recipient === r.key ? "#fff" : T.subtle,
                  borderColor: form.recipient === r.key ? T.blue : T.border,
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="msg-subject"
            className="block text-xs font-semibold mb-1.5"
            style={{ color: T.ink }}
          >
            Subject{" "}
            <span aria-hidden style={{ color: T.red }}>
              *
            </span>
          </label>
          <input
            id="msg-subject"
            type="text"
            value={form.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            placeholder="e.g. OTJ Progress Update Required"
            aria-required="true"
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "msg-subject-error" : undefined}
            className={inputCls}
            style={{
              ...inputStyle,
              borderColor: errors.subject ? T.red : T.border,
            }}
          />
          {errors.subject && (
            <p
              id="msg-subject-error"
              className="mt-1 text-[10px]"
              style={{ color: T.red }}
              role="alert"
            >
              {errors.subject}
            </p>
          )}
        </div>

        {/* Body */}
        <div>
          <label
            htmlFor="msg-body"
            className="block text-xs font-semibold mb-1.5"
            style={{ color: T.ink }}
          >
            Message{" "}
            <span aria-hidden style={{ color: T.red }}>
              *
            </span>
          </label>
          <textarea
            id="msg-body"
            rows={5}
            value={form.body}
            onChange={(e) => handleChange("body", e.target.value)}
            placeholder="Write your message here…"
            aria-required="true"
            aria-invalid={Boolean(errors.body)}
            aria-describedby={errors.body ? "msg-body-error" : undefined}
            className={`${inputCls} resize-none`}
            style={{
              ...inputStyle,
              borderColor: errors.body ? T.red : T.border,
            }}
          />
          {errors.body && (
            <p
              id="msg-body-error"
              className="mt-1 text-[10px]"
              style={{ color: T.red }}
              role="alert"
            >
              {errors.body}
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}
