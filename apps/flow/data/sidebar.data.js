import {
  ArrowRightLeft,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  Coins,
  FileText,
  Handshake,
  LayoutDashboard,
  Link2,
  Settings,
  Sparkles,
  UserCircle,
  UserPlus,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    title: "Workspace",
    items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    title: "Levy Exchange",
    items: [
      { label: "AI Programmes", href: "/courses", icon: Sparkles },
      { label: "Levy Surplus", href: "/levy", icon: Coins },
      { label: "Donor Matches", href: "/matches", icon: Handshake },
      { label: "Transfers", href: "/transfers", icon: ArrowRightLeft },
      { label: "Donor Links", href: "/donor-links", icon: Link2 },
      { label: "Eligibility", href: "/eligibility", icon: CheckCircle2 },
    ],
  },
  {
    title: "Reporting",
    items: [{ label: "SME Reports", href: "/reports", icon: BarChart3 }],
  },
  {
    title: "Onboarding",
    items: [{ label: "ESFA Registration", href: "/register", icon: FileText }],
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
    ],
  },
];
