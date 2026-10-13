import Image from "next/image";
import Link from "next/link";
import CompanyName from "@/components/company-name";
import ProfileMenu from "@/components/profile-menu";
import MessageButton from "@/components/message-button";
import OwnerWorkspaceBadge from "@/components/owner-workspace-badge";
import { officePreviewParticipants as people } from "@/lib/office-preview";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: "overview" },
  { label: "Virtual office", href: "/office", icon: "office" },
  { label: "Team", href: "/team", icon: "team" },
  { label: "Schedules", href: "/schedules", icon: "team" },
  { label: "Attendance", href: "/attendance", icon: "time" },
  { label: "Time tracking", href: "/time-tracking", icon: "time" },
  { label: "Reports", href: "/reports", icon: "reports" },
];

const recentActivity = [
  { initials: "MP", name: "Morgan", message: "started a huddle", time: "9:32 AM", color: "bg-emerald-400/20 text-emerald-200" },
  { initials: "JL", name: "Jordan", message: "joined the office", time: "9:18 AM", color: "bg-sky-400/20 text-sky-200" },
];

function Icon({
  name,
  className = "size-5",
}: {
  name: string;
  className?: string;
}) {
  const paths: Record<string, React.ReactNode> = {
    overview: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
    office: <><path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-6h6v6M7 10h.01M12 10h.01M17 10h.01" /></>,
    team: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    time: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    reports: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 6-7" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z" /></>,
    billing: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h3" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    people: <><circle cx="9" cy="8" r="3" /><path d="M3 19v-1a6 6 0 0 1 12 0v1M16 5.5a3 3 0 0 1 0 5.8M18 14a5 5 0 0 1 3 4.5v.5" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    coffee: <><path d="M10 2v2M14 2v2M4 7h16l-1.2 13H5.2L4 7ZM20 10h1a2 2 0 0 1 0 4h-1" /><path d="M8 11v2M12 11v2M16 11v2" /></>,
    mic: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v5M9 22h6" /></>,
  };

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
      {paths[name] ?? paths.office}
    </svg>
  );
}

function Avatar({
  initials,
  color,
  size = "size-8",
}: {
  initials: string;
  color: string;
  size?: string;
}) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ring-2 ring-[#111116] ${size} ${color}`}>
      {initials}
    </span>
  );
}

function RoomLabel({
  title,
  subtitle,
  className = "",
  children,
}: {
  title: string;
  subtitle: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`relative flex min-h-[142px] flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#17171e] p-4 ${className}`}>
      <div className="relative z-[1] flex items-start justify-between gap-2">
        <div>
          <h3 className="text-xs font-semibold text-zinc-200">{title}</h3>
          <p className="mt-1 text-[10px] text-zinc-500">{subtitle}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

export default function OfficePage() {
  return (
    <main className="min-h-screen bg-[#09090d] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col overflow-y-auto overscroll-contain border-r border-white/[0.07] bg-[#0d0d12] px-5 py-6 lg:flex">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 px-2">
              <Image src="/vyrtual-icon.svg" alt="" width={34} height={34} />
              <span className="text-lg font-semibold tracking-tight">Vyrtual</span>
            </Link>
            <label htmlFor="sidebar-collapsed" title="Collapse or expand sidebar" className="sidebar-logo-toggle flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/[0.08] bg-[#15151c] text-zinc-400 transition-colors hover:bg-[#20202a] hover:text-white focus-within:ring-2 focus-within:ring-sky-300">
              <svg aria-hidden="true" className="size-4 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M9 4v16m4-8h5m-3-3 3 3-3 3" />
              </svg>
              <span className="sr-only">Toggle sidebar width</span>
            </label>
          </div>
          <div className="sidebar-section-heading mb-3 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">
            Workspace
          </div>
          <nav aria-label="Workspace navigation" className="space-y-1">
            {navigation.map(({ label, href, icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={href === "/office" ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  href === "/office"
                    ? "bg-sky-400/10 text-sky-200"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon name={icon} className="size-[18px]" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="sidebar-section-heading mb-3 mt-9 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">
            Manage
          </div>
          <nav aria-label="Workspace settings" className="space-y-1">
            <Link href="/billing" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white">
              <Icon name="billing" className="size-[18px]" />
              Billing
            </Link>
            <Link href="/company-settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white">
              <Icon name="settings" className="size-[18px]" />
              Company settings
            </Link>
            <Link href="/settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white">
              <Icon name="settings" className="size-[18px]" />
              Settings
            </Link>
          </nav>
          <div className="mt-auto rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-300 to-indigo-400 text-xs font-semibold text-slate-950">NL</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white"><CompanyName /></p>
                <p className="text-xs text-zinc-500">Free workspace</p>
              </div>
            </div>
            <Link href="/settings" className="mt-4 flex items-center justify-between rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.04]">
              Workspace settings
              <Icon name="arrow" className="size-3.5" />
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-white/[0.07] bg-[#09090d]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
            <div className="flex items-center gap-3 lg:hidden">
              <Image src="/vyrtual-icon.svg" alt="" width={30} height={30} />
              <span className="font-semibold tracking-tight">Vyrtual</span>
            </div>
            <nav aria-label="Workspace navigation" className="hidden items-center gap-1 sm:flex lg:hidden">
              {navigation.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={href === "/office" ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-xs font-medium ${
                    href === "/office" ? "bg-sky-400/10 text-sky-200" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="hidden text-sm text-zinc-500 lg:block">
              Workspace <span className="mx-2 text-zinc-700">/</span>{" "}
              <span className="text-zinc-200">Virtual office</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <OwnerWorkspaceBadge />
              <button
                type="button"
                aria-label="Notifications"
                className="relative flex size-10 items-center justify-center rounded-xl border border-white/[0.08] text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <Icon name="bell" className="size-[18px]" />
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-sky-300" />
              </button>
              <MessageButton />
              <ProfileMenu />
            </div>
          </header>

          <nav
            aria-label="Mobile workspace navigation"
            className="flex gap-1 overflow-x-auto border-b border-white/[0.07] px-4 py-2 sm:hidden"
          >
            {navigation.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                aria-current={href === "/office" ? "page" : undefined}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium ${
                  href === "/office" ? "bg-sky-400/10 text-sky-200" : "text-zinc-400 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-sky-300">
                  <CompanyName /> · Floor 1
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-[34px]">
                  Virtual office
                </h1>
                <p className="mt-2 text-sm text-zinc-400">
                  Explore a sample workspace built for focused work and team huddles.
                </p>
              </div>
              <Link
                href="/team"
                className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/[0.07] sm:self-auto"
              >
                <Icon name="people" className="size-4" />
                View team
              </Link>
            </section>

            <section className="mt-8 grid items-start gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
              <article className="min-w-0 rounded-2xl border border-white/[0.07] bg-[#111116] p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-white">Office floor plan</h2>
                      <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-[10px] text-zinc-400">DEMO</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">A sample of where your team can work together</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-emerald-300/10 bg-emerald-300/[0.06] px-3 py-1.5 text-xs font-medium text-emerald-200">
                    <span className="size-1.5 rounded-full bg-emerald-300" />
                    {people.length} shown
                  </div>
                </div>

                <div className="mt-5 overflow-x-auto rounded-xl border border-white/[0.06] bg-[#0d0d12] p-3 sm:p-4">
                  <div className="grid min-w-[560px] grid-cols-12 grid-rows-[150px_38px_174px] gap-2.5">
                    <RoomLabel title="Meeting room" subtitle="Team huddle · 2 people" className="col-span-7">
                      <span className="flex items-center gap-1.5 rounded-full bg-violet-400/10 px-2 py-1 text-[9px] font-medium text-violet-200">
                        <Icon name="mic" className="size-3" />
                        Huddle
                      </span>
                      <div className="absolute inset-x-8 bottom-5 top-[52px] flex items-center justify-center rounded-[28px] border border-white/[0.07] bg-[#20202a]">
                        <div className="flex h-9 w-28 items-center justify-center rounded-full border border-white/[0.07] bg-[#292934]">
                          <span className="size-1 rounded-full bg-zinc-600" />
                        </div>
                        <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 gap-2">
                          {people.slice(2, 4).map((person) => (
                            <Avatar key={person.initials} initials={person.initials} color={person.color} />
                          ))}
                        </div>
                      </div>
                    </RoomLabel>

                    <RoomLabel title="Focus room" subtitle="Quiet space · 1 seat" className="col-span-5">
                      <span className="size-2 rounded-full bg-amber-300" />
                      <div className="absolute bottom-5 left-5 right-5 top-[58px] flex items-center justify-center rounded-lg border border-white/[0.06] bg-[#20202a]">
                        <div className="flex size-14 items-center justify-center rounded-xl border border-white/[0.07] bg-[#2a2a35] shadow-xl">
                          <Avatar initials="TB" color="bg-amber-400/20 text-amber-200" size="size-9" />
                        </div>
                      </div>
                    </RoomLabel>

                    <div className="col-span-12 flex items-center justify-between rounded-lg border border-dashed border-white/[0.06] bg-white/[0.015] px-4">
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-600">Main walkway</span>
                      <span className="flex items-center gap-2 text-[10px] text-zinc-600">
                        <span className="h-px w-8 bg-zinc-700" />
                        Floor 1
                        <span className="h-px w-8 bg-zinc-700" />
                      </span>
                    </div>

                    <RoomLabel title="Work studio" subtitle="Open desks · 8 seats" className="col-span-7">
                      <span className="size-2 rounded-full bg-emerald-300" />
                      <div className="absolute inset-x-5 bottom-4 top-[58px] grid grid-cols-4 gap-2">
                        {[
                          ["AC", "bg-violet-400/20 text-violet-200"],
                          ["JL", "bg-sky-400/20 text-sky-200"],
                          ["", ""],
                          ["", ""],
                          ["", ""],
                          ["", ""],
                          ["", ""],
                          ["", ""],
                        ].map(([initials, color], index) => (
                          <div key={index} className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-white/[0.05] bg-[#20202a]">
                            {initials ? (
                              <Avatar initials={initials} color={color} size="size-7" />
                            ) : (
                              <span className="size-6 rounded-full border border-dashed border-zinc-700" />
                            )}
                            <span className="h-1 w-7 rounded-full bg-zinc-700/70" />
                          </div>
                        ))}
                      </div>
                    </RoomLabel>

                    <RoomLabel title="Lounge" subtitle="Take a breather" className="col-span-5">
                      <Icon name="coffee" className="size-4 text-amber-200/70" />
                      <div className="absolute inset-x-4 bottom-4 top-[58px] flex items-center justify-center gap-3 rounded-lg border border-white/[0.05] bg-[#20202a]">
                        <div className="flex h-10 w-20 items-center justify-center rounded-xl border border-white/[0.06] bg-[#30303c]">
                          <Avatar initials="CK" color="bg-indigo-400/20 text-indigo-200" size="size-7" />
                        </div>
                        <div className="flex size-9 items-center justify-center rounded-lg border border-white/[0.06] bg-[#292934]">
                          <Icon name="coffee" className="size-4 text-zinc-500" />
                        </div>
                      </div>
                    </RoomLabel>
                  </div>
                </div>
                <p className="mt-2 text-center text-[10px] text-zinc-600 sm:hidden">
                  Swipe to explore the floor plan
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-zinc-500">
                  <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-300" />Working</span>
                  <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-violet-300" />In a huddle</span>
                  <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-amber-300" />Focusing</span>
                  <span className="ml-auto text-zinc-600">Sample workspace activity</span>
                </div>
              </article>

              <div className="grid gap-5 2xl:grid-cols-1 sm:grid-cols-2 2xl:col-start-2">
                <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-sm font-semibold text-white">In the office</h2>
                    <span className="text-xs text-zinc-500">{people.length} people</span>
                  </div>
                  <div className="mt-4 divide-y divide-white/[0.06]">
                    {people.map(({ initials, name, role, room, color }) => (
                      <div key={initials} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                        <Avatar initials={initials} color={color} size="size-9" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-zinc-100">{name}</p>
                          <p className="truncate text-[10px] text-zinc-500">{role}</p>
                        </div>
                        <span className="max-w-[92px] truncate rounded-md bg-white/[0.04] px-2 py-1 text-[9px] text-zinc-400">{room}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/team" className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-white/[0.07] py-2.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.04]">
                    See the whole team
                    <Icon name="arrow" className="size-3.5" />
                  </Link>
                </article>

                <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5">
                  <h2 className="text-sm font-semibold text-white">Recent activity</h2>
                  <div className="mt-4 space-y-4">
                    {recentActivity.map(({ initials, name, message, time, color }) => (
                      <div key={name} className="flex items-center gap-3">
                        <Avatar initials={initials} color={color} size="size-8" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs text-zinc-300"><span className="font-medium text-white">{name}</span> {message}</p>
                          <p className="mt-1 text-[10px] text-zinc-600">{time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-xl border border-sky-300/10 bg-sky-300/[0.045] p-3.5">
                    <p className="text-xs font-medium text-sky-100">Good work happens together.</p>
                    <p className="mt-1 text-[11px] leading-5 text-zinc-500">Drop into a room to let your team know you&apos;re around.</p>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
