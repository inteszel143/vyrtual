import Image from "next/image";
import Link from "next/link";
import ProfileMenu from "@/components/profile-menu";
import MessageButton from "@/components/message-button";
import CompanyName from "@/components/company-name";
import OwnerWorkspaceBadge from "@/components/owner-workspace-badge";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: "overview" },
  { label: "Virtual office", href: "/office", icon: "office" },
  { label: "Team", href: "/team", icon: "team" },
  { label: "Schedules", href: "/schedules", icon: "team" },
  { label: "Attendance", href: "/attendance", icon: "time" },
  { label: "Time tracking", href: "/time-tracking", icon: "time" },
  { label: "Reports", href: "/reports", icon: "reports" },
];

const metrics = [
  {
    label: "Team members",
    value: "18",
    detail: "2 freelancers",
    icon: "team",
    color: "text-sky-300",
    surface: "bg-sky-400/10",
  },
  {
    label: "Hours this week",
    value: "124.5",
    detail: "Across 14 people",
    icon: "time",
    color: "text-violet-300",
    surface: "bg-violet-400/10",
  },
  {
    label: "Online now",
    value: "6",
    detail: "2 in the virtual office",
    icon: "online",
    color: "text-emerald-300",
    surface: "bg-emerald-400/10",
  },
];

const teamMembers = [
  { initials: "AC", name: "Avery Chen", role: "Product designer", status: "Working", color: "bg-violet-400/20 text-violet-200" },
  { initials: "JL", name: "Jordan Lee", role: "Frontend developer", status: "Online", color: "bg-sky-400/20 text-sky-200" },
  { initials: "SR", name: "Sam Rivera", role: "Freelance writer", status: "Working", color: "bg-rose-400/20 text-rose-200" },
  { initials: "TB", name: "Taylor Brooks", role: "Engineering", status: "Away", color: "bg-amber-400/20 text-amber-200" },
];

const activity = [
  { initials: "AC", name: "Avery Chen", action: "started tracking time", detail: "Product design", time: "9:42 AM", color: "bg-violet-400/20 text-violet-200" },
  { initials: "JL", name: "Jordan Lee", action: "joined the virtual office", detail: "Engineering", time: "9:18 AM", color: "bg-sky-400/20 text-sky-200" },
  { initials: "SR", name: "Sam Rivera", action: "logged 2.5 hours", detail: "Content writing", time: "8:56 AM", color: "bg-rose-400/20 text-rose-200" },
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
    online: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
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
      {paths[name] ?? paths.overview}
    </svg>
  );
}

function SectionHeading({
  title,
  href,
  linkLabel = "View all",
}: {
  title: string;
  href: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <Link
        href={href}
        className="shrink-0 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
      >
        {linkLabel}
      </Link>
    </div>
  );
}

export default function DashboardPage() {
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
            {navigation.map(({ label, href, icon }, index) => (
              <Link
                key={href}
                href={href}
                aria-current={index === 0 ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  index === 0
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
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-300 to-indigo-400 text-xs font-semibold text-slate-950">
                NL
              </div>
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
              {navigation.map(({ label, href }, index) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={index === 0 ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-xs font-medium ${
                    index === 0 ? "bg-sky-400/10 text-sky-200" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="hidden text-sm text-zinc-500 lg:block">
              Workspace <span className="mx-2 text-zinc-700">/</span>{" "}
              <span className="text-zinc-200">Overview</span>
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
            {navigation.map(({ label, href }, index) => (
              <Link
                key={href}
                href={href}
                aria-current={index === 0 ? "page" : undefined}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium ${
                  index === 0 ? "bg-sky-400/10 text-sky-200" : "text-zinc-400 hover:text-white"
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
                  Tuesday, October 13
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-[34px]">
                  Welcome back
                </h1>
                <p className="mt-2 text-sm text-zinc-400">
                  Here&apos;s what&apos;s happening with your team today.
                </p>
              </div>
              <Link
                href="/team"
                className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-sky-300 px-4 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-200 sm:self-auto"
              >
                <Icon name="team" className="size-4" />
                View team
              </Link>
            </section>

            <section aria-label="Workspace metrics" className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {metrics.map(({ label, value, detail, icon, color, surface }) => (
                <article key={label} className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-zinc-400">{label}</p>
                    <span className={`flex size-9 items-center justify-center rounded-xl ${surface} ${color}`}>
                      <Icon name={icon} className="size-[18px]" />
                    </span>
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <p className="text-3xl font-semibold tracking-tight text-white">{value}</p>
                    <p className="pb-1 text-xs text-zinc-500">{detail}</p>
                  </div>
                </article>
              ))}
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
              <article className="min-w-0 rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-white">Hours tracked</h2>
                    <p className="mt-1 text-sm text-zinc-500">Your team&apos;s activity this week</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-medium text-zinc-300">
                    This week
                    <svg aria-hidden="true" className="size-3.5 text-zinc-500" viewBox="0 0 16 16" fill="none">
                      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold tracking-tight">124.5</span>
                  <span className="text-sm text-zinc-500">hours logged</span>
                  <span className="ml-auto rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                    +12.8%
                  </span>
                </div>
                <div className="mt-5 h-[190px] w-full">
                  <svg
                    aria-label="Bar chart showing hours tracked from Monday through Sunday"
                    role="img"
                    viewBox="0 0 620 190"
                    className="size-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="hours-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7dd3fc" stopOpacity=".95" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity=".55" />
                      </linearGradient>
                    </defs>
                    {[30, 70, 110, 150].map((y) => (
                      <line key={y} x1="0" x2="620" y1={y} y2={y} stroke="white" strokeOpacity=".07" strokeDasharray="4 6" />
                    ))}
                    {[76, 112, 99, 144, 126, 157, 92].map((height, index) => {
                      const x = 30 + index * 86;
                      const y = 160 - height;
                      return (
                        <g key={index}>
                          <rect x={x} y={y} width="38" height={height} rx="8" fill="url(#hours-gradient)" opacity={index === 4 ? 1 : 0.6} />
                          <text x={x + 19} y="181" textAnchor="middle" fill="#71717a" fontSize="11">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </article>

              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
                <SectionHeading title="Team availability" href="/team" />
                <div className="mt-5 divide-y divide-white/[0.06]">
                  {teamMembers.map(({ initials, name, role, status, color }) => (
                    <div key={name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <div className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${color}`}>
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-zinc-100">{name}</p>
                        <p className="truncate text-xs text-zinc-500">{role}</p>
                      </div>
                      <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                        <span className={`size-1.5 rounded-full ${status === "Away" ? "bg-amber-300" : "bg-emerald-300"}`} />
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
                <SectionHeading title="Recent activity" href="/office" />
                <div className="mt-5 divide-y divide-white/[0.06]">
                  {activity.map(({ initials, name, action, detail, time, color }) => (
                    <div key={`${name}-${time}`} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
                      <div className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${color}`}>
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-zinc-200">
                          <span className="font-medium text-white">{name}</span> {action}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">{detail}</p>
                      </div>
                      <time className="shrink-0 text-xs text-zinc-500">{time}</time>
                    </div>
                  ))}
                </div>
              </article>

              <article className="relative overflow-hidden rounded-2xl border border-sky-300/15 bg-[linear-gradient(145deg,rgba(56,189,248,0.11),rgba(17,17,22,0.95)_55%)] p-5 sm:p-6">
                <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 size-48 rounded-full bg-sky-300/10 blur-3xl" />
                <div className="relative">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-sky-300/10 text-sky-200">
                    <Icon name="clock" className="size-[19px]" />
                  </span>
                  <h2 className="mt-5 text-lg font-semibold text-white">Make time visible</h2>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-400">
                    Keep everyone aligned with a clear view of hours and activity across your remote team.
                  </p>
                  <Link href="/time-tracking" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-200 transition-colors hover:text-white">
                    Go to time tracking
                    <Icon name="arrow" className="size-4" />
                  </Link>
                </div>
              </article>
            </section>

            <footer className="mt-8 flex flex-col gap-3 border-t border-white/[0.06] pt-5 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
              <span><CompanyName /> workspace</span>
              <Link href="/settings" className="transition-colors hover:text-zinc-300">
                Manage workspace
              </Link>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
