"use client";

import { useRef, useState } from "react";

import Button from "@/components/ui/Button";

/**
 * Minimal canvas signature capture for POST /esignature flows.
 */
export function SignaturePad({ onCapture, disabled = false }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (event) => {
    if (disabled) return;
    event.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPoint(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const draw = (event) => {
    if (!drawing || disabled) return;
    event.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#111827";
    const { x, y } = getPoint(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const save = () => {
    const dataUrl = canvasRef.current.toDataURL("image/png");
    onCapture?.(dataUrl);
  };

  return (
    <div className="space-y-3">
      <canvas
        ref={canvasRef}
        width={400}
        height={160}
        className="w-full rounded-lg border border-neutral-200 bg-white touch-none"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={clear}
          disabled={disabled}
        >
          Clear
        </Button>
        <Button type="button" size="sm" onClick={save} disabled={disabled}>
          Use signature
        </Button>
      </div>
    </div>
  );
}
