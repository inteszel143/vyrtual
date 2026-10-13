import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import ProfileMenu from "@/components/profile-menu";
import MessageButton from "@/components/message-button";
import NotificationButton from "@/components/notification-button";
import OwnerWorkspaceBadge from "@/components/owner-workspace-badge";
import {
  OwnerNavigationIcon,
  ownerManageNavigation,
  ownerWorkspaceNavigation,
} from "@/components/owner-navigation";

function NavigationLink({
  item,
  activeHref,
}: {
  item: (typeof ownerWorkspaceNavigation)[number] | (typeof ownerManageNavigation)[number];
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
      <OwnerNavigationIcon name={item.icon} />
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
  const allNavigation = [...ownerWorkspaceNavigation, ...ownerManageNavigation];

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
            {ownerWorkspaceNavigation.map((item) => <NavigationLink key={item.href} item={item} activeHref={activeHref} />)}
          </nav>
          <div className="sidebar-section-heading mb-3 mt-9 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">Manage</div>
          <nav aria-label="Workspace settings" className="space-y-1">
            {ownerManageNavigation.map((item) => <NavigationLink key={item.href} item={item} activeHref={activeHref} />)}
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
              <p className="text-xs text-zinc-500">Owner workspace</p>
            </div>
            <div className="flex items-center gap-3">
              <OwnerWorkspaceBadge />
              <NotificationButton />
              <MessageButton />
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
