import { AccessDeniedScreen } from "@/components/error/AccessDeniedScreen";
// import { AccountPendingScreen } from "@/components/error/AccountPendingScreen";
import { requireAuth } from "@/features/auth/guards/require-auth";
import { DashboardLayout } from "@/layout/dashboard/DashboardLayout";

export default async function DashboardGroupLayout({ children }) {
  const { user, status } = await requireAuth();
  // if (status === 'pending') return <AccountPendingScreen user={user} />;
  if (status === "forbidden") return <AccessDeniedScreen user={user} />;
  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
