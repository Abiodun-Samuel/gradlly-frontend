"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/Modal";
import { useScheduleReview } from "@/features/at-risk/queries/at-risk.query";

import { T } from "./tokens";

/**
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   apprenticeId: string,
 *   apprenticeName: string
 * }} props
 */
export function ScheduleReviewModal({
  open,
  onClose,
  apprenticeId,
  apprenticeName,
}) {
  const { mutate, isPending } = useScheduleReview(apprenticeId);

  const [form, setForm] = useState({ date: "", notes: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.date) e.date = "Review date is required.";
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
        setForm({ date: "", notes: "" });
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
      size="sm"
      title="Schedule Review"
      description={`Request a review for ${apprenticeName}`}
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
            form="review-form"
            type="submit"
            disabled={isPending}
            className="px-4 py-2 rounded-xl text-xs font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: T.blue, color: "#fff" }}
          >
            {isPending ? "Scheduling…" : "Schedule Review"}
          </button>
        </div>
      }
    >
      <form
        id="review-form"
        onSubmit={handleSubmit}
        className="space-y-4"
        noValidate
      >
        {/* Date */}
        <div>
          <label
            htmlFor="review-date"
            className="block text-xs font-semibold mb-1.5"
            style={{ color: T.ink }}
          >
            Review Date{" "}
            <span aria-hidden style={{ color: T.red }}>
              *
            </span>
          </label>
          <input
            id="review-date"
            type="date"
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
            aria-required="true"
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? "review-date-error" : undefined}
            className={inputCls}
            style={{
              ...inputStyle,
              borderColor: errors.date ? T.red : T.border,
            }}
          />
          {errors.date && (
            <p
              id="review-date-error"
              className="mt-1 text-[10px]"
              style={{ color: T.red }}
              role="alert"
            >
              {errors.date}
            </p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="review-notes"
            className="block text-xs font-semibold mb-1.5"
            style={{ color: T.ink }}
          >
            Notes{" "}
            <span
              className="text-[10px] font-normal"
              style={{ color: T.muted }}
            >
              (optional)
            </span>
          </label>
          <textarea
            id="review-notes"
            rows={3}
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Any context to share ahead of the review…"
            className={`${inputCls} resize-none`}
            style={inputStyle}
          />
        </div>
      </form>
    </Modal>
  );
}
