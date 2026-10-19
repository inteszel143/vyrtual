import type { ReactNode } from "react";

export type OwnerNavigationIconName =
  | "overview"
  | "office"
  | "team"
  | "schedule"
  | "attendance"
  | "time"
  | "reports"
  | "billing"
  | "company"
  | "profile";

export const ownerWorkspaceNavigation = [
  { label: "Overview", href: "/dashboard", icon: "overview" },
  { label: "Virtual office", href: "/office", icon: "office" },
  { label: "Team", href: "/team", icon: "team" },
  { label: "Schedules", href: "/schedules", icon: "schedule" },
  { label: "Attendance", href: "/attendance", icon: "attendance" },
  { label: "Time tracking", href: "/time-tracking", icon: "time" },
  { label: "Reports", href: "/reports", icon: "reports" },
] as const satisfies readonly {
  label: string;
  href: string;
  icon: OwnerNavigationIconName;
}[];

export const ownerManageNavigation = [
  { label: "Billing", href: "/billing", icon: "billing" },
  { label: "Company settings", href: "/company-settings", icon: "company" },
  { label: "Profile settings", href: "/settings", icon: "profile" },
] as const satisfies readonly {
  label: string;
  href: string;
  icon: OwnerNavigationIconName;
}[];

const iconPaths: Record<OwnerNavigationIconName, ReactNode> = {
  overview: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
  office: <><path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-6h6v6M7 10h.01M12 10h.01M17 10h.01" /></>,
  team: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  schedule: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" /></>,
  attendance: <><path d="M9 11 12 14 21 5" /><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" /></>,
  time: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  reports: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 6-7" /></>,
  billing: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h3" /></>,
  company: <><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10" /><path d="M8 7h2M8 11h2M8 15h2M12 7h1M12 11h1M12 15h1M18 13h.01M18 17h.01" /></>,
  profile: <><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
};

export function OwnerNavigationIcon({
  name,
  className = "size-[18px]",
}: {
  name: OwnerNavigationIconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconPaths[name]}
    </svg>
  );
}
