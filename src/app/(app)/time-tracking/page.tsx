"use client";

import Image from "next/image";
import Link from "next/link";
import ProfileMenu from "@/components/profile-menu";
import { useEffect, useMemo, useState } from "react";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: "overview" },
  { label: "Virtual office", href: "/office", icon: "office" },
  { label: "Team", href: "/team", icon: "team" },
  { label: "Schedules", href: "/schedules", icon: "team" },
  { label: "Attendance", href: "/attendance", icon: "time" },
  { label: "Time tracking", href: "/time-tracking", icon: "time" },
  { label: "Reports", href: "/reports", icon: "reports" },
];

type TimeEntry = {
  id: string;
  person: string;
  initials: string;
  color: string;
  description: string;
  project: string;
  day: string;
  startedAt: string;
  durationSeconds: number;
};

const sampleEntries: TimeEntry[] = [
  { id: "1", person: "Avery Chen", initials: "AC", color: "bg-violet-400/20 text-violet-200", description: "Homepage wireframes", project: "Website redesign", day: "Today", startedAt: "9:15 AM", durationSeconds: 2 * 3600 + 45 * 60 },
  { id: "2", person: "Jordan Lee", initials: "JL", color: "bg-sky-400/20 text-sky-200", description: "Navigation component", project: "Website redesign", day: "Today", startedAt: "8:30 AM", durationSeconds: 3 * 3600 + 20 * 60 },
  { id: "3", person: "Sam Rivera", initials: "SR", color: "bg-rose-400/20 text-rose-200", description: "Product launch draft", project: "Content & launch", day: "Today", startedAt: "8:00 AM", durationSeconds: 2 * 3600 + 15 * 60 },
  { id: "4", person: "Morgan Park", initials: "MP", color: "bg-emerald-400/20 text-emerald-200", description: "Sprint planning", project: "Team operations", day: "Yesterday", startedAt: "1:00 PM", durationSeconds: 1 * 3600 + 30 * 60 },
  { id: "5", person: "Taylor Brooks", initials: "TB", color: "bg-amber-400/20 text-amber-200", description: "API integration", project: "Website redesign", day: "Yesterday", startedAt: "9:30 AM", durationSeconds: 3 * 3600 + 45 * 60 },
];

const dailyHours = [
  { day: "Mon", hours: 21.5, height: 68 },
  { day: "Tue", hours: 24.0, height: 78 },
  { day: "Wed", hours: 18.5, height: 60 },
  { day: "Thu", hours: 26.5, height: 86 },
  { day: "Fri", hours: 22.0, height: 71 },
  { day: "Sat", hours: 5.0, height: 22 },
  { day: "Sun", hours: 7.0, height: 28 },
];

const sampleTeamWeekSeconds = dailyHours.reduce(
  (total, { hours }) => total + hours * 3600,
  0,
);
const sampleTeamTodaySeconds = (dailyHours.find(({ day }) => day === "Tue")?.hours ?? 0) * 3600;
const sampleTeamCapacitySeconds = 18 * 40 * 3600;

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
    play: <><path d="m8 5 12 7-12 7V5Z" /></>,
    stop: <><rect x="6" y="6" width="12" height="12" rx="2" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>,
    more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
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
      {paths[name] ?? paths.time}
    </svg>
  );
}

function formatDuration(totalSeconds: number, includeSeconds = false) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return includeSeconds
    ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : safeSeconds < 60
      ? "<1m"
      : `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

function formatHours(totalSeconds: number) {
  return (totalSeconds / 3600).toFixed(1);
}

export default function TimeTrackingPage() {
  const [entries, setEntries] = useState(sampleEntries);
  const [description, setDescription] = useState("Website updates");
  const [project, setProject] = useState("Website redesign");
  const [startTime, setStartTime] = useState("");
  const [now, setNow] = useState(0);
  const [activeTab, setActiveTab] = useState<"All entries" | "My entries">("All entries");

  useEffect(() => {
    if (!startTime) return;

    const update = () => setNow(Date.now());
    update();
    const interval = window.setInterval(update, 1000);

    return () => window.clearInterval(interval);
  }, [startTime]);

  const runningSeconds = startTime ? Math.max(0, Math.floor((now - Number(startTime)) / 1000)) : 0;
  const filteredEntries = useMemo(
    () => activeTab === "My entries" ? entries.filter((entry) => entry.person === "You") : entries,
    [activeTab, entries],
  );
  const yourSessionSeconds =
    entries
      .filter((entry) => entry.person === "You")
      .reduce((sum, entry) => sum + entry.durationSeconds, 0) + runningSeconds;

  function toggleTimer() {
    if (startTime) {
      const durationSeconds = Math.max(1, Math.floor((Date.now() - Number(startTime)) / 1000));
      const startedAtDate = new Date(Number(startTime));
      const startedAt = startedAtDate.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });

      setEntries((current) => [
        {
          id: `${Date.now()}`,
          person: "You",
          initials: "AM",
          color: "bg-sky-400/20 text-sky-200",
          description: description.trim() || "Work session",
          project,
          day: "Today",
          startedAt,
          durationSeconds,
        },
        ...current,
      ]);
      setStartTime("");
      setNow(0);
      return;
    }

    setStartTime(String(Date.now()));
    setNow(Date.now());
  }

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
          <div className="sidebar-section-heading mb-3 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">Workspace</div>
          <nav aria-label="Workspace navigation" className="space-y-1">
            {navigation.map(({ label, href, icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={href === "/time-tracking" ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  href === "/time-tracking"
                    ? "bg-sky-400/10 text-sky-200"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon name={icon} className="size-[18px]" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="sidebar-section-heading mb-3 mt-9 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">Manage</div>
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
                <p className="truncate text-sm font-medium text-white">Northstar Studio</p>
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
                  aria-current={href === "/time-tracking" ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-xs font-medium ${
                    href === "/time-tracking" ? "bg-sky-400/10 text-sky-200" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="hidden text-sm text-zinc-500 lg:block">
              Workspace <span className="mx-2 text-zinc-700">/</span>{" "}
              <span className="text-zinc-200">Time tracking</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-xs text-zinc-400 sm:inline-flex">Northstar Studio</span>
              <button type="button" aria-label="Notifications" className="relative flex size-10 items-center justify-center rounded-xl border border-white/[0.08] text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white">
                <Icon name="bell" className="size-[18px]" />
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-sky-300" />
              </button>
              <ProfileMenu />
            </div>
          </header>

          <nav aria-label="Mobile workspace navigation" className="flex gap-1 overflow-x-auto border-b border-white/[0.07] px-4 py-2 sm:hidden">
            {navigation.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                aria-current={href === "/time-tracking" ? "page" : undefined}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium ${
                  href === "/time-tracking" ? "bg-sky-400/10 text-sky-200" : "text-zinc-400 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-sky-300">Northstar Studio · Work log</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-[34px]">Time tracking</h1>
                <p className="mt-2 text-sm text-zinc-400">Keep your focus on the work. We&apos;ll keep track of the time.</p>
              </div>
              <span className="flex items-center gap-2 self-start rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-xs text-zinc-400 sm:self-auto">
                <Icon name="calendar" className="size-3.5" />
                This week · Oct 12–18
              </span>
            </section>

            <section aria-label="Time summary" className="mt-8 grid gap-3 sm:grid-cols-3">
              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-4 sm:p-5">
                <p className="text-xs text-zinc-500">Team hours this week</p>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-2xl font-semibold tracking-tight">{formatHours(sampleTeamWeekSeconds)}h</span>
                  <span className="text-xs text-zinc-500">of 720h capacity</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-sky-300" style={{ width: `${Math.min(100, (sampleTeamWeekSeconds / sampleTeamCapacitySeconds) * 100)}%` }} />
                </div>
              </article>
              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-4 sm:p-5">
                <p className="text-xs text-zinc-500">Your time this session</p>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-2xl font-semibold tracking-tight">{formatDuration(yourSessionSeconds)}</span>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-300"><span className={`size-1.5 rounded-full ${startTime ? "animate-pulse bg-emerald-300" : "bg-zinc-600"}`} />{startTime ? "Timer running" : "Timer stopped"}</span>
                </div>
                <p className="mt-3 text-xs text-zinc-600">In this browser session</p>
              </article>
              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-4 sm:p-5">
                <p className="text-xs text-zinc-500">Team hours today</p>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-2xl font-semibold tracking-tight">{formatHours(sampleTeamTodaySeconds)}h</span>
                  <span className="text-xs text-zinc-500">Across the workspace</span>
                </div>
                <p className="mt-3 text-xs text-zinc-600">Based on sample team data</p>
              </article>
            </section>

            <section className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)]">
              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-white">This week</h2>
                    <p className="mt-1 text-xs text-zinc-500">Hours tracked by your team each day</p>
                  </div>
                  <span className="rounded-md border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-[10px] font-medium text-zinc-400">SAMPLE DATA</span>
                </div>
                <div className="mt-6 flex h-[188px] items-end gap-2 sm:gap-4">
                  {dailyHours.map(({ day, hours, height }) => (
                    <div key={day} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                      <span className="text-[9px] text-zinc-500 sm:text-[10px]">{hours}h</span>
                      <div className="flex h-[132px] w-full items-end justify-center rounded-t-lg">
                        <div
                          className={`w-full max-w-10 rounded-t-md transition-colors ${
                            day === "Tue" ? "bg-sky-300" : "bg-sky-300/35 hover:bg-sky-300/60"
                          }`}
                          style={{ height: `${height}%` }}
                          title={`${hours} hours`}
                        />
                      </div>
                      <span className={`text-[10px] ${day === "Tue" ? "font-medium text-sky-200" : "text-zinc-500"}`}>{day}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className={`rounded-2xl border p-5 transition-colors sm:p-6 ${
                startTime
                  ? "border-emerald-300/20 bg-[linear-gradient(145deg,rgba(52,211,153,0.08),rgba(17,17,22,0.95)_55%)]"
                  : "border-sky-300/15 bg-[linear-gradient(145deg,rgba(56,189,248,0.09),rgba(17,17,22,0.95)_55%)]"
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">Your timer</p>
                    <h2 className="mt-2 text-base font-semibold text-white">{startTime ? "You're on the clock" : "Ready when you are"}</h2>
                  </div>
                  <span className={`mt-1 size-2 rounded-full ${startTime ? "animate-pulse bg-emerald-300" : "bg-zinc-600"}`} />
                </div>
                <div className={`mt-5 font-mono text-4xl font-medium tracking-[-0.04em] tabular-nums sm:text-[42px] ${startTime ? "text-emerald-200" : "text-white"}`}>
                  {formatDuration(runningSeconds, true)}
                </div>
                <label className="mt-5 block">
                  <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">What are you working on?</span>
                  <input
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    disabled={Boolean(startTime)}
                    maxLength={120}
                    placeholder="Describe your task..."
                    className="h-10 w-full rounded-lg border border-white/[0.08] bg-black/20 px-3 text-xs text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-sky-300/40 disabled:opacity-60"
                  />
                </label>
                <label className="mt-3 block">
                  <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">Project</span>
                  <select
                    value={project}
                    onChange={(event) => setProject(event.target.value)}
                    disabled={Boolean(startTime)}
                    className="h-10 w-full rounded-lg border border-white/[0.08] bg-[#17171e] px-3 text-xs text-zinc-200 outline-none focus:border-sky-300/40 disabled:opacity-60"
                  >
                    <option>Website redesign</option>
                    <option>Content &amp; launch</option>
                    <option>Team operations</option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={toggleTimer}
                  className={`mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors ${
                    startTime
                      ? "bg-rose-400/10 text-rose-200 hover:bg-rose-400/15"
                      : "bg-sky-300 text-slate-950 hover:bg-sky-200"
                  }`}
                >
                  <Icon name={startTime ? "stop" : "play"} className="size-4" />
                  {startTime ? "Stop timer" : "Start timer"}
                </button>
                <p className="mt-3 text-center text-[10px] leading-4 text-zinc-600">
                  Timer runs in this browser session. Entries aren&apos;t saved to an account.
                </p>
              </article>
            </section>

            <section className="mt-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-white">Time entries</h2>
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] text-zinc-400">{filteredEntries.length}</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">A breakdown of recent tracked work</p>
                </div>
                <div className="flex w-fit gap-1 rounded-xl border border-white/[0.07] bg-[#111116] p-1">
                  {(["All entries", "My entries"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      aria-pressed={activeTab === tab}
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                        activeTab === tab ? "bg-white/[0.08] text-white" : "text-zinc-500 hover:text-zinc-200"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111116]">
                <div className="hidden grid-cols-[minmax(180px,1.2fr)_minmax(150px,1fr)_minmax(100px,.7fr)_minmax(85px,.6fr)_minmax(90px,.6fr)] gap-4 border-b border-white/[0.06] px-5 py-3 font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-600 md:grid">
                  <span>Team member</span>
                  <span>Project</span>
                  <span>Day / start</span>
                  <span>Duration</span>
                  <span className="text-right">Details</span>
                </div>
                {filteredEntries.length > 0 ? (
                  <div className="divide-y divide-white/[0.06]">
                    {filteredEntries.map((entry) => (
                      <article key={entry.id} className="grid gap-3 px-4 py-4 sm:px-5 md:grid-cols-[minmax(180px,1.2fr)_minmax(150px,1fr)_minmax(100px,.7fr)_minmax(85px,.6fr)_minmax(90px,.6fr)] md:items-center md:gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${entry.color}`}>{entry.initials}</span>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-zinc-100">{entry.person}</p>
                            <p className="mt-1 truncate text-[10px] text-zinc-500">{entry.description}</p>
                          </div>
                        </div>
                        <div className="flex min-w-0 items-center justify-between gap-2 md:block">
                          <span className="text-[9px] font-medium uppercase tracking-wider text-zinc-600 md:hidden">Project</span>
                          <span className="truncate rounded-md bg-white/[0.04] px-2 py-1 text-[10px] text-zinc-400">{entry.project}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 md:block">
                          <span className="text-[9px] font-medium uppercase tracking-wider text-zinc-600 md:hidden">Day / start</span>
                          <span className="text-[11px] text-zinc-400">{entry.day} <span className="text-zinc-600">· {entry.startedAt}</span></span>
                        </div>
                        <div className="flex items-center justify-between gap-2 md:block">
                          <span className="text-[9px] font-medium uppercase tracking-wider text-zinc-600 md:hidden">Duration</span>
                          <span className="font-mono text-xs font-medium tabular-nums text-zinc-200">{formatDuration(entry.durationSeconds)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 md:justify-end">
                          <span className="text-[9px] font-medium uppercase tracking-wider text-zinc-600 md:hidden">Entry</span>
                          <span className="rounded-md border border-white/[0.06] px-2 py-1 text-[9px] text-zinc-500">Preview</span>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-10 text-center">
                    <p className="text-sm font-medium text-zinc-200">No time entries yet</p>
                    <p className="mt-1 text-xs text-zinc-500">Start a timer to add your first entry in this session.</p>
                  </div>
                )}
                <div className="flex flex-col gap-2 border-t border-white/[0.06] px-4 py-3 text-[10px] text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <span>Sample entries for workspace preview</span>
                  <Link href="/reports" className="inline-flex items-center gap-1.5 text-zinc-400 transition-colors hover:text-white">
                    View reports
                    <Icon name="arrow" className="size-3" />
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
