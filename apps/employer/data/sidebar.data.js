import {
  Bell,
  LayoutDashboard,
  Settings,
  UserCircle,
  UsersRound,
  // ── Icons for not-yet-built sections (kept for when they are re-enabled) ──
  // BarChart3,
  // Briefcase,
  // ClipboardList,
  // CreditCard,
  // GraduationCap,
  // UserPlus,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  // ── Talent section: pages not yet built. Re-enable when ready. ──
  // {
  //   title: "Talent",
  //   items: [
  //     { label: "Apprentices", href: "/apprentices", icon: GraduationCap },
  //     {
  //       label: "Recruitment",
  //       href: "/jobs",
  //       icon: Briefcase,
  //       children: [
  //         { label: "Job Posts", href: "/jobs" },
  //         { label: "Applications", href: "/applications" },
  //       ],
  //     },
  //     { label: "Onboarding", href: "/onboarding", icon: UserPlus },
  //     { label: "Assessments", href: "/assessments", icon: ClipboardList },
  //   ],
  // },
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
            label: "Team & Invitations",
            href: "/settings/team",
            icon: UsersRound,
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
