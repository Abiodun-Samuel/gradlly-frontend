import {
  LayoutDashboard,
  Settings,
  UserCircle,
  // ── Icons for not-yet-built sections (kept for when they are re-enabled) ──
  // BarChart3,
  // BookMarked,
  // BookOpen,
  // ClipboardCheck,
  // TrendingUp,
  // Users,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    title: "My Learning",
    items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  // ── Learning sections: pages not yet built. Re-enable when ready. ──
  // {
  //   title: "My Learning",
  //   items: [
  //     { label: "My Courses", href: "/courses", icon: BookOpen },
  //     { label: "Assessments", href: "/assessments", icon: ClipboardCheck },
  //     { label: "Progress", href: "/progress", icon: TrendingUp },
  //   ],
  // },
  // {
  //   title: "Curriculum",
  //   items: [
  //     { label: "Curriculum", href: "/curriculum", icon: BookMarked },
  //     { label: "Analytics", href: "/analytics", icon: BarChart3 },
  //   ],
  // },
  // {
  //   title: "Reporting",
  //   items: [
  //     { label: "Reports", href: "/reports", icon: BarChart3 },
  //     { label: "Learners", href: "/learners", icon: Users },
  //   ],
  // },
  {
    title: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: UserCircle },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];
