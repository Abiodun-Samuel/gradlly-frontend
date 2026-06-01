import {
  BarChart3,
  Briefcase,
  CheckSquare,
  ClipboardList,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Settings,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { label: "Levy Dashboard", href: "/", icon: LayoutDashboard },
      { label: "My apprentices", href: "/apprentices", icon: BarChart3 },
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
    title: "Finance",
    items: [
      { label: "Reports", href: "/reports", icon: GraduationCap },
      {
        label: "Levy transfer",
        href: "/levy-transfer",
        icon: Briefcase,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Help & support", href: "/help", icon: HelpCircle },
    ],
  },
];
