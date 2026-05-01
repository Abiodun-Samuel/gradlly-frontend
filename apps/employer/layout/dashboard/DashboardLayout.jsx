"use client";

import { useState } from "react";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-surface-1">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-screen-2xl animate-[page-enter_250ms_ease-out_forwards] p-5 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
