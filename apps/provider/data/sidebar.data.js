import {
  Bell,
  Building2,
  LayoutDashboard,
  Settings,
  UserCircle,
  UserPlus,
  // ── Icons for not-yet-built sections (kept for when they are re-enabled) ──
  // AlertTriangle,
  // Archive,
  // BarChart3,
  // BookOpen,
  // Building2,
  // ClipboardList,
  // FileText,
  // MessageSquare,
  // Shield,
  // Users,
  // Users2,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  // ── Compliance section: pages not yet built. Re-enable when ready. ──
  // {
  //   title: "Compliance",
  //   items: [
  //     { label: "Ofsted Hub", href: "/ofsted-hub", icon: Shield },
  //     { label: "QIP", href: "/qip", icon: ClipboardList },
  //     { label: "ILR & DAS", href: "/ilr-das", icon: FileText },
  //     { label: "Evidence Vault", href: "/evidence-vault", icon: Archive },
  //   ],
  // },
  // ── Delivery section: pages not yet built. Re-enable when ready. ──
  // {
  //   title: "Delivery",
  //   items: [
  //     { label: "Reviews", href: "/reviews", icon: MessageSquare },
  //     { label: "Tutors", href: "/tutors", icon: Users },
  //     {
  //       label: "Employers",
  //       href: "/employers",
  //       icon: Building2,
  //       children: [
  //         { label: "All Employers", href: "/employers" },
  //         { label: "Commitment Statements", href: "/commitment-statements" },
  //       ],
  //     },
  //   ],
  // },
  // ── Insights section: pages not yet built. Re-enable when ready. ──
  // {
  //   title: "Insights",
  //   items: [
  //     { label: "Reports", href: "/reports", icon: BarChart3 },
  //     { label: "KSB Coverage", href: "/ksb-coverage", icon: BookOpen },
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
    ],
  },
];
