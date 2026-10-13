import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import ProfileMenu from "@/components/profile-menu";

const workspaceNavigation = [
  { label: "Overview", href: "/dashboard", icon: "overview" },
  { label: "Virtual office", href: "/office", icon: "office" },
  { label: "Team", href: "/team", icon: "team" },
  { label: "Schedules", href: "/schedules", icon: "schedule" },
  { label: "Attendance", href: "/attendance", icon: "attendance" },
  { label: "Time tracking", href: "/time-tracking", icon: "time" },
  { label: "Reports", href: "/reports", icon: "reports" },
];

const manageNavigation = [
  { label: "Billing", href: "/billing", icon: "billing" },
  { label: "Company settings", href: "/company-settings", icon: "company" },
  { label: "Profile settings", href: "/settings", icon: "profile" },
];

function Icon({ name, className = "size-[18px]" }: { name: string; className?: string }) {
  const paths: Record<string, ReactNode> = {
    overview: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
    office: <><path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-6h6v6M7 10h.01M12 10h.01M17 10h.01" /></>,
    team: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    schedule: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" /></>,
    attendance: <><path d="M9 11 12 14 21 5" /><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" /></>,
    time: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    reports: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 6-7" /></>,
    billing: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h3" /></>,
    company: <><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10" /><path d="M8 7h2M8 11h2M8 15h2M12 7h1M12 11h1M12 15h1M18 13h.01M18 17h.01" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z" /></>,
    profile: <><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
  };

  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function NavigationLink({
  item,
  activeHref,
}: {
  item: (typeof workspaceNavigation)[number] | (typeof manageNavigation)[number];
  activeHref: string;
}) {
  const active = item.href === activeHref;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      title={item.label}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-sky-400/10 text-sky-200"
          : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
      }`}
    >
      <Icon name={item.icon} />
      {item.label}
    </Link>
  );
}

export default function OwnerWorkspaceShell({
  activeHref,
  title,
  description,
  children,
}: {
  activeHref: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const allNavigation = [...workspaceNavigation, ...manageNavigation];

  return (
    <main className="min-h-screen bg-[#09090d] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col overflow-y-auto overscroll-contain border-r border-white/[0.07] bg-[#0d0d12] px-5 py-6 lg:flex">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 px-2">
              <Image src="/vyrtual-icon.svg" alt="" width={34} height={34} />
              <span className="text-lg font-semibold tracking-tight">Vyrtual</span>
            </Link>
            <label htmlFor="sidebar-collapsed" title="Collapse or expand sidebar" className="sidebar-logo-toggle flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/[0.08] bg-[#15151c] text-zinc-400 transition-colors hover:bg-[#20202a] hover:text-white focus-within:ring-2 focus-within:ring-sky-300">
              <svg aria-hidden="true" className="size-4 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M9 4v16m4-8h5m-3-3 3 3-3 3" />
              </svg>
            </label>
          </div>

          <div className="sidebar-section-heading mb-3 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">Workspace</div>
          <nav aria-label="Workspace navigation" className="space-y-1">
            {workspaceNavigation.map((item) => <NavigationLink key={item.href} item={item} activeHref={activeHref} />)}
          </nav>
          <div className="sidebar-section-heading mb-3 mt-9 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">Manage</div>
          <nav aria-label="Workspace settings" className="space-y-1">
            {manageNavigation.map((item) => <NavigationLink key={item.href} item={item} activeHref={activeHref} />)}
          </nav>

          <div className="mt-auto border-t border-white/[0.06] pt-5">
            <div className="flex items-center gap-3 rounded-xl px-2 py-2">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-300 to-indigo-400 text-xs font-semibold text-slate-950">NL</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">Northstar Studio</p>
                <p className="text-xs text-zinc-500">Owner workspace</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-white/[0.07] bg-[#09090d]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
            <div>
              <p className="text-xs text-zinc-500">Northstar Studio <span className="px-1.5 text-zinc-700">/</span> Owner workspace</p>
              <h1 className="mt-1 text-sm font-semibold text-zinc-100">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-2.5 py-1 text-[10px] font-medium text-emerald-200 sm:inline-flex">Preview workspace</span>
              <ProfileMenu />
            </div>
          </header>
          <nav aria-label="Mobile workspace navigation" className="flex gap-1 overflow-x-auto border-b border-white/[0.07] px-4 py-2 lg:hidden">
            {allNavigation.map((item) => (
              <Link key={item.href} href={item.href} aria-current={item.href === activeHref ? "page" : undefined} className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium ${item.href === activeHref ? "bg-sky-400/10 text-sky-200" : "text-zinc-400 hover:text-white"}`}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
            <div className="mb-8">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-sky-300">Owner workspace</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-[34px]">{title}</h2>
              <p className="mt-2 text-sm text-zinc-400">{description}</p>
            </div>
            {children}
            <footer className="mt-10 border-t border-white/[0.06] pt-5 text-xs text-zinc-600">
              Preview data only · Changes are not saved
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
