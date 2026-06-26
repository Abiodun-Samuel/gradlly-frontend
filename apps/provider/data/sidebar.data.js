import {
  Archive,
  BarChart3,
  Bell,
  BookMarked,
  BookOpen,
  Building2,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Shield,
  UserCircle,
  UserPlus,
  Users,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    title: "Curriculum",
    items: [
      { label: "Programmes", href: "/programmes", icon: GraduationCap },
      { label: "Standards", href: "/standards", icon: BookMarked },
    ],
  },
  {
    title: "Learners",
    items: [
      { label: "Cohort", href: "/cohort", icon: Users },
      { label: "Apprentices", href: "/apprentices", icon: Users },
    ],
  },
  {
    title: "Delivery",
    items: [
      { label: "Enrolments", href: "/enrolments", icon: ClipboardList },
      { label: "Reviews", href: "/reviews", icon: MessageSquare },
      {
        label: "Employers",
        href: "/employers",
        icon: Building2,
        children: [
          { label: "All Employers", href: "/employers" },
          { label: "Commitment Statements", href: "/commitment-statements" },
        ],
      },
    ],
  },
  {
    title: "Compliance",
    items: [
      { label: "Ofsted Hub", href: "/ofsted-hub", icon: Shield },
      { label: "ILR & DAS", href: "/ilr-das", icon: FileText },
      { label: "Evidence Vault", href: "/evidence-vault", icon: Archive },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "Reports", href: "/reports", icon: BarChart3 },
      { label: "KSB Coverage", href: "/ksb-coverage", icon: BookOpen },
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
    ],
  },
];
