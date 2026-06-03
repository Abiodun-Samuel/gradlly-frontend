import {
  Bell,
  LayoutDashboard,
  Settings,
  UserCircle,
  UsersRound,
  // ── Icons for not-yet-built sections (kept for when they are re-enabled) ──
  // Activity,
  // BarChart3,
  // GitBranch,
  // Link2,
  // Wand2,
  // Zap,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    title: "Workspace",
    items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  // ── Integrations section: pages not yet built. Re-enable when ready. ──
  // {
  //   title: "Integrations",
  //   items: [
  //     { label: "My Flows", href: "/flows", icon: GitBranch },
  //     { label: "Flow Builder", href: "/builder", icon: Wand2 },
  //     { label: "Connections", href: "/connections", icon: Link2 },
  //     {
  //       label: "Automation",
  //       href: "/webhooks",
  //       icon: Zap,
  //       children: [
  //         { label: "Webhooks", href: "/webhooks" },
  //         { label: "Activity Logs", href: "/logs" },
  //       ],
  //     },
  //   ],
  // },
  // ── Analytics section: pages not yet built. Re-enable when ready. ──
  // {
  //   title: "Analytics",
  //   items: [
  //     { label: "Reports", href: "/reports", icon: BarChart3 },
  //     { label: "Activity", href: "/logs", icon: Activity },
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
    ],
  },
];
