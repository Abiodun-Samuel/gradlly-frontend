import {
  BarChart3,
  Briefcase,
  CheckSquare,
  ClipboardList,
  CreditCard,
  FileText,
  HelpCircle,
  LayoutDashboard,
  PoundSterling,
  Settings,
  UserCircle,
  UserPlus,
  Users,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Apprenticeships",
    items: [
      { label: "My Apprentices", href: "/apprentices", icon: Users },
      {
        label: "Commitments",
        href: "/commitments",
        icon: ClipboardList,
        badge: 2,
      },
      {
        label: "OTJ Approvals",
        href: "/otj-approvals",
        icon: CheckSquare,
        badge: 12,
      },
    ],
  },
  {
    title: "Levy & Finance",
    items: [
      { label: "Levy Dashboard", href: "/levy-dashboard", icon: PoundSterling },
      { label: "Levy Transfer", href: "/levy-transfer", icon: Briefcase },
      { label: "Reports", href: "/reports", icon: FileText },
    ],
  },
  {
    title: "Recruitment",
    items: [
      {
        label: "Jobs",
        href: "/jobs",
        icon: Briefcase,
        children: [
          { label: "Job Posts", href: "/jobs" },
          { label: "Applications", href: "/applications" },
        ],
      },
      { label: "Onboarding", href: "/onboarding", icon: UserPlus },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Billing", href: "/billing", icon: CreditCard },
      { label: "Profile", href: "/profile", icon: UserCircle },
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Help & Docs", href: "/help", icon: HelpCircle },
    ],
  },
];
