"use client";
import { useEffect } from "react";

import { cn } from "@/utils/helper";

export function MobileDrawer({ open, onClose, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-300 bg-neutral-950/60 backdrop-blur-[2px] lg:hidden",
          "transition-opacity duration-[220ms] ease-out",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation drawer"
        aria-hidden={!open}
        className={cn(
          "fixed inset-y-0 left-0 z-400 lg:hidden",
          "transition-transform duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {children}
      </div>
    </>
  );
}
