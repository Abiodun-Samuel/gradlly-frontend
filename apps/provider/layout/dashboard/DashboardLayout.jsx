"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import { DashboardSkeleton } from "@/components/skeleton";
import { Modal } from "@/components/ui/Modal";
import { AUTH_REDIRECTS } from "@/features/auth/constants";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { CreateOrganisationContent } from "@/features/organization/components/CreateOrganisationContent";
import { Header } from "@/layout/dashboard/Header";
import { MobileDrawer } from "@/layout/dashboard/MobileDrawer";
import { Sidebar } from "@/layout/dashboard/Sidebar";

const MODAL_DELAY_MS = 2000;

export function DashboardLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [orgModalOpen, setOrgModalOpen] = useState(false);

  const { user, isLoading } = useAuthUser();

  const needsOrg = Boolean(user && !user.activeOrganisation);

  useEffect(() => {
    if (!needsOrg) return;
    const timer = setTimeout(() => setOrgModalOpen(true), MODAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [needsOrg]);

  if (isLoading) return <DashboardSkeleton />;
  if (!user) redirect(AUTH_REDIRECTS.LOGIN_PAGE);

  return (
    <>
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

      <Modal
        open={orgModalOpen}
        closable={false}
        size="4xl"
        className="flex-col lg:flex-row"
      >
        <CreateOrganisationContent />
      </Modal>
    </>
  );
}
