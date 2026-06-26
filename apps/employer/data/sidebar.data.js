import {
  BarChart3,
  Bell,
  Building2,
  GraduationCap,
  LayoutDashboard,
  Settings,
  UserCircle,
  UserPlus,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    title: "Apprenticeships",
    items: [
      { label: "Apprentices", href: "/apprentices", icon: GraduationCap },
      { label: "Onboarding", href: "/onboarding", icon: UserPlus },
      {
        label: "Analytics",
        href: "/analytics",
        icon: BarChart3,
        children: [
          { label: "Levy utilisation", href: "/analytics" },
          { label: "Levy ROI", href: "/analytics/cost" },
        ],
      },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: UserCircle },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        children: [
          {
            label: "Organisation",
            href: "/settings/organisation",
            icon: Building2,
            requiresRole: "owner",
          },
          {
            label: "Invitations",
            href: "/settings/invitations",
            icon: UserPlus,
          },
          {
            label: "Notifications",
            href: "/settings/notifications",
            icon: Bell,
          },
        ],
      },
      // { label: "Billing", href: "/billing", icon: CreditCard },
    ],
  },
];
