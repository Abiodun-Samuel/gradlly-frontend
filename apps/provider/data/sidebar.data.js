import {
  Activity,
  Banknote,
  Bell,
  BookMarked,
  Building2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  FileSignature,
  FileSpreadsheet,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  PenTool,
  Settings,
  ShieldCheck,
  UserCircle,
  UserPlus,
  Users,
  UsersRound,
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
      { label: "Apprentices", href: "/apprentices", icon: Users },
      { label: "Caseload", href: "/learners", icon: UsersRound },
    ],
  },
  {
    title: "Delivery",
    items: [
      { label: "Enrolments", href: "/enrolments", icon: ClipboardList },
      {
        label: "Commitment Statements",
        href: "/commitment-statements",
        icon: FileSignature,
      },
      { label: "OTJ Log Entries", href: "/otj-log-entries", icon: Clock },
      { label: "Reviews", href: "/reviews", icon: ClipboardCheck },
    ],
  },
  {
    title: "Portfolio",
    items: [
      {
        label: "Evidence Review",
        href: "/portfolio/evidence",
        icon: FolderOpen,
      },
    ],
  },
  {
    title: "Compliance",
    items: [
      { label: "Ofsted Hub", href: "/ofsted-hub", icon: ShieldCheck },
      { label: "ILR / ESFA", href: "/ilr", icon: FileSpreadsheet },
    ],
  },
  {
    title: "Funding",
    items: [
      { label: "Funding (DAS)", href: "/funding", icon: Banknote },
      { label: "DAS Health", href: "/das-health", icon: Activity },
    ],
  },
  {
    title: "Reporting",
    items: [{ label: "Employers", href: "/employers", icon: Building2 }],
  },
  {
    title: "Tools",
    items: [{ label: "E-Signature", href: "/esignature", icon: PenTool }],
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
