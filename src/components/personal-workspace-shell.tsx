import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import ProfileMenu from "@/components/profile-menu";
import WorkClockControl from "@/components/work-clock-control";

const navigation = [
  { label: "My workspace", href: "/my-workspace", icon: "overview" },
  { label: "My office", href: "/my-office", icon: "office" },
  { label: "My time", href: "/my-time", icon: "time" },
  { label: "My schedule", href: "/my-schedule", icon: "schedule" },
  { label: "My reports", href: "/my-reports", icon: "reports" },
  { label: "My profile", href: "/my-profile", icon: "profile" },
];

function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    overview: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
    office: <><path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-6h6v6M7 10h.01M12 10h.01M17 10h.01" /></>,
    time: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    schedule: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" /></>,
    reports: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 6-7" /></>,
    profile: <><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
  };

  return (
    <svg aria-hidden="true" className="size-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

export default function PersonalWorkspaceShell({
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
  return (
    <main className="min-h-screen bg-[#09090d] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col overflow-y-auto overscroll-contain border-r border-white/[0.07] bg-[#0d0d12] px-5 py-6 lg:flex">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/my-workspace" className="flex items-center gap-3 px-2">
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

          <p className="sidebar-section-heading mb-3 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">Personal workspace</p>
          <nav aria-label="Personal workspace navigation" className="space-y-1">
            {navigation.map((item) => {
              const active = item.href === activeHref;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active ? "bg-sky-400/10 text-sky-200" : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <Icon name={item.icon} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-white/[0.06] pt-5">
            <div className="flex items-center gap-3 rounded-xl px-2 py-2">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-300 to-orange-300 text-xs font-semibold text-slate-950">AM</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">Alex Morgan</p>
                <p className="text-xs text-zinc-500">Freelancer</p>
              </div>
            </div>
            <Link href="/dashboard" className="mt-3 flex items-center gap-2 rounded-lg px-2 py-2 text-xs text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-zinc-200">
              <span aria-hidden="true">↗</span>
              Company workspace
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-white/[0.07] bg-[#09090d]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
            <div>
              <p className="text-xs text-zinc-500">Northstar Studio <span className="px-1.5 text-zinc-700">/</span> Personal workspace</p>
              <h1 className="mt-1 text-sm font-semibold text-zinc-100">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <WorkClockControl />
              <span className="hidden rounded-full border border-sky-300/15 bg-sky-300/[0.06] px-2.5 py-1 text-[10px] font-medium text-sky-200 sm:inline-flex">Freelancer view</span>
              <ProfileMenu />
            </div>
          </header>
          <nav aria-label="Mobile personal workspace navigation" className="flex gap-1 overflow-x-auto border-b border-white/[0.07] px-4 py-2 lg:hidden">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} aria-current={item.href === activeHref ? "page" : undefined} className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium ${item.href === activeHref ? "bg-sky-400/10 text-sky-200" : "text-zinc-400 hover:text-white"}`}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
            <div className="mb-8">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-sky-300">Personal workspace</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-[34px]">{title}</h2>
              <p className="mt-2 text-sm text-zinc-400">{description}</p>
            </div>
            {children}
            <footer className="mt-10 border-t border-white/[0.06] pt-5 text-xs text-zinc-600">
              Personal workspace preview · Changes are not saved
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
