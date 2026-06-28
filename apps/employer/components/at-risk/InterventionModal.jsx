"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/Modal";
import { useCreateIntervention } from "@/features/at-risk/queries/at-risk.query";

import { T } from "./tokens";

const TYPES = [
  { key: "note", label: "General Note" },
  { key: "plan", label: "Recovery Plan" },
  { key: "review", label: "Review Meeting" },
  { key: "message", label: "Message Record" },
];

/**
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   apprenticeId: string,
 *   apprenticeName: string
 * }} props
 */
export function InterventionModal({
  open,
  onClose,
  apprenticeId,
  apprenticeName,
}) {
  const { mutate, isPending } = useCreateIntervention(apprenticeId);

  const [form, setForm] = useState({
    type: "note",
    title: "",
    notes: "",
    followUpDate: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.notes.trim()) e.notes = "Description is required.";
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
        setForm({ type: "note", title: "", notes: "", followUpDate: "" });
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
      title="Create Intervention Note"
      description={`For ${apprenticeName}`}
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
            form="intervention-form"
            type="submit"
            disabled={isPending}
            className="px-4 py-2 rounded-xl text-xs font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: T.blue, color: "#fff" }}
          >
            {isPending ? "Saving…" : "Save Note"}
          </button>
        </div>
      }
    >
      <form
        id="intervention-form"
        onSubmit={handleSubmit}
        className="space-y-4"
        noValidate
      >
        {/* Type */}
        <div>
          <label
            className="block text-xs font-semibold mb-1.5"
            style={{ color: T.ink }}
          >
            Intervention Type
          </label>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Intervention type"
          >
            {TYPES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => handleChange("type", t.key)}
                aria-pressed={form.type === t.key}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                style={{
                  backgroundColor: form.type === t.key ? T.blue : T.surface,
                  color: form.type === t.key ? "#fff" : T.subtle,
                  borderColor: form.type === t.key ? T.blue : T.border,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="iv-title"
            className="block text-xs font-semibold mb-1.5"
            style={{ color: T.ink }}
          >
            Title{" "}
            <span aria-hidden style={{ color: T.red }}>
              *
            </span>
          </label>
          <input
            id="iv-title"
            type="text"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="e.g. OTJ Recovery Discussion"
            aria-required="true"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "iv-title-error" : undefined}
            className={inputCls}
            style={{
              ...inputStyle,
              borderColor: errors.title ? T.red : T.border,
            }}
          />
          {errors.title && (
            <p
              id="iv-title-error"
              className="mt-1 text-[10px]"
              style={{ color: T.red }}
              role="alert"
            >
              {errors.title}
            </p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="iv-notes"
            className="block text-xs font-semibold mb-1.5"
            style={{ color: T.ink }}
          >
            Description{" "}
            <span aria-hidden style={{ color: T.red }}>
              *
            </span>
          </label>
          <textarea
            id="iv-notes"
            rows={4}
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Describe the intervention, what was agreed, and any context…"
            aria-required="true"
            aria-invalid={Boolean(errors.notes)}
            aria-describedby={errors.notes ? "iv-notes-error" : undefined}
            className={`${inputCls} resize-none`}
            style={{
              ...inputStyle,
              borderColor: errors.notes ? T.red : T.border,
            }}
          />
          {errors.notes && (
            <p
              id="iv-notes-error"
              className="mt-1 text-[10px]"
              style={{ color: T.red }}
              role="alert"
            >
              {errors.notes}
            </p>
          )}
        </div>

        {/* Follow-up date */}
        <div>
          <label
            htmlFor="iv-followup"
            className="block text-xs font-semibold mb-1.5"
            style={{ color: T.ink }}
          >
            Follow-up Date{" "}
            <span
              className="text-[10px] font-normal"
              style={{ color: T.muted }}
            >
              (optional)
            </span>
          </label>
          <input
            id="iv-followup"
            type="date"
            value={form.followUpDate}
            onChange={(e) => handleChange("followUpDate", e.target.value)}
            className={inputCls}
            style={inputStyle}
          />
        </div>
      </form>
    </Modal>
  );
}
