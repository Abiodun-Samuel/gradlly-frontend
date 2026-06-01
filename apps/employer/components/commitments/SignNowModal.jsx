"use client";
import { useRef, useState } from "react";

import { T } from "@/components/dashboard/levy/tokens";
import { Modal } from "@/components/ui/Modal";
import { toastSuccess } from "@/hooks/useToast";

const DOC = `Employer responsibilities: Midlands Engineering Ltd agrees to release Amara Diallo for all scheduled training days, provide meaningful work relevant to the Accounting Technician standard, conduct quarterly progress reviews with the provider, and ensure the apprentice is not charged for any element of their training.

OTJ delivery plan: Minimum 20% off-the-job — delivered via day release Thursdays + structured workplace projects.`;

function DrawCanvas({ onHasDrawing }) {
  const ref = useRef(null);
  const drawing = useRef(false);
  const clear = () => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 400, 120);
    onHasDrawing(false);
  };
  const getXY = (e) => {
    const r = ref.current.getBoundingClientRect();
    const pt = e.touches ? e.touches[0] : e;
    return [pt.clientX - r.left, pt.clientY - r.top];
  };
  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    const ctx = ref.current.getContext("2d");
    const [x, y] = getXY(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const ctx = ref.current.getContext("2d");
    const [x, y] = getXY(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = T.ink;
    ctx.lineWidth = 2;
    ctx.stroke();
    onHasDrawing(true);
  };
  const stop = () => {
    drawing.current = false;
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <canvas
          ref={ref}
          width={400}
          height={120}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={stop}
          onMouseLeave={stop}
          className="rounded-xl cursor-crosshair"
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={stop}
          style={{
            border: `1px solid ${T.border}`,
            backgroundColor: T.card,
            display: "block",
            maxWidth: "100%",
            width: "100%",
            touchAction: "none",
          }}
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px]" style={{ color: T.muted }}>
          Draw your signature above
        </span>
        <button
          type="button"
          onClick={clear}
          className="text-[11px] font-semibold hover:underline"
          style={{ color: T.subtle }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export function SignNowModal({ open, onClose }) {
  const [sigTab, setSigTab] = useState("draw");
  const [agreed, setAgreed] = useState(false);
  const [typedName, setTypedName] = useState("");
  const [hasDrawing, setHasDrawing] = useState(false);
  const [signed, setSigned] = useState(false);

  const canSign =
    sigTab === "draw" ? hasDrawing : typedName.trim().length > 0 && agreed;
  const sign = () => {
    if (!canSign) return;
    setSigned(true);
    setTimeout(() => {
      toastSuccess("Commitment statement signed — CS-003");
      onClose();
    }, 900);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title="Sign commitment statement — Amara Diallo"
      description="Accounting Technician L4 · WMG Academy · CS-003"
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
            onClick={sign}
            disabled={!canSign || signed}
            className="px-5 py-2 rounded-xl text-sm font-bold hover:opacity-80 transition-all disabled:opacity-40"
            style={{ backgroundColor: T.blue, color: "#fff" }}
          >
            {signed ? "✓ Signed" : "Confirm signature"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div
          className="rounded-xl p-3.5 h-28 overflow-y-auto text-[11px] leading-relaxed whitespace-pre-line"
          style={{
            backgroundColor: T.card,
            border: `1px solid ${T.border}`,
            color: T.subtle,
            fontFamily: "Georgia, serif",
          }}
        >
          {DOC}
        </div>

        {/* Signature tabs */}
        <div>
          <div
            className="flex rounded-xl overflow-hidden mb-3"
            style={{ border: `1px solid ${T.border}` }}
          >
            {[
              ["draw", "Draw signature"],
              ["type", "Type name"],
            ].map(([k, l]) => (
              <button
                key={k}
                type="button"
                onClick={() => setSigTab(k)}
                className="flex-1 py-2 text-xs font-semibold transition-all"
                style={{
                  backgroundColor: sigTab === k ? T.ink : "transparent",
                  color: sigTab === k ? "#fff" : T.subtle,
                }}
              >
                {l}
              </button>
            ))}
          </div>
          {sigTab === "draw" ? (
            <DrawCanvas onHasDrawing={setHasDrawing} />
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Type your full name"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm border focus:outline-none"
                style={{
                  borderColor: T.border,
                  color: T.ink,
                  backgroundColor: T.surface,
                }}
              />
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 shrink-0"
                  style={{ accentColor: T.blue }}
                />
                <span className="text-xs" style={{ color: T.ink }}>
                  I, <strong>Sarah Rahman</strong>, confirm I have read and
                  agree to the terms of this commitment statement on behalf of{" "}
                  <strong>Midlands Engineering Ltd</strong>
                </span>
              </label>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
