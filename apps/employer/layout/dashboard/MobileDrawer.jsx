"use client";
import { useEffect, useRef } from "react";

import { cn } from "@/utils/helper";
import { acquireScrollLock, releaseScrollLock } from "@/utils/scroll-lock";

function getFocusableNodes(root) {
  return Array.from(
    root.querySelectorAll(
      "a[href], button:not([disabled]), input:not([disabled]), " +
        "select:not([disabled]), textarea:not([disabled]), " +
        "[tabindex]:not([tabindex='-1'])",
    ),
  );
}

export function MobileDrawer({ open, onClose, children }) {
  const drawerRef = useRef(null);

  // Shared ref-counted scroll lock — coordinates with Modal so they never
  // fight over document.body.style.overflow.
  useEffect(() => {
    if (!open) return;
    acquireScrollLock();
    return releaseScrollLock;
  }, [open]);

  // Focus trap + Escape handler + auto-focus first element on open.
  useEffect(() => {
    if (!open) return;

    const id = setTimeout(() => {
      if (!drawerRef.current) return;
      const nodes = getFocusableNodes(drawerRef.current);
      nodes[0]?.focus();
    }, 60);

    const handleKey = (e) => {
      if (e.key === "Escape") {
        onClose?.();
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current) return;
      const nodes = getFocusableNodes(drawerRef.current);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const atBoundary = e.shiftKey
        ? document.activeElement === first
        : document.activeElement === last;
      if (atBoundary) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      clearTimeout(id);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-300 bg-neutral-950/60 backdrop-blur-[2px] lg:hidden",
          "transition-opacity duration-220 ease-out",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation drawer"
        aria-hidden={!open}
        className={cn(
          "fixed inset-y-0 left-0 z-400 lg:hidden",
          "transition-transform duration-220 ease-[cubic-bezier(0.4,0,0.2,1)]",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {children}
      </div>
    </>
  );
}
