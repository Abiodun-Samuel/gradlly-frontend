"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

import { SessionErrorScreen } from "@/components/error/SessionErrorScreen";
import { DashboardSkeleton } from "@/components/skeleton";
import { AUTH_REDIRECTS } from "@/features/auth/constants";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { Header } from "@/layout/dashboard/Header";
import { MobileDrawer } from "@/layout/dashboard/MobileDrawer";
import { Sidebar } from "@/layout/dashboard/Sidebar";

export function DashboardLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, isLoading, isError } = useAuthUser();

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <SessionErrorScreen />;
  if (!user) redirect(AUTH_REDIRECTS.LOGIN_PAGE);

  return (
    <div className="flex h-dvh overflow-hidden bg-neutral-50">
      <div className="hidden lg:flex lg:shrink-0 lg:flex-col">
        <Sidebar />
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Sidebar onClose={() => setDrawerOpen(false)} />
      </MobileDrawer>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          onMenuOpen={() => setDrawerOpen(true)}
          userMenuOpen={userMenuOpen}
          onUserMenuOpenChange={setUserMenuOpen}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto focus-visible:outline-none"
        >
          <div className="mx-auto w-full max-w-360 px-8 py-8 sm:px-6 sm:py-6 max-sm:px-4 max-sm:py-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
