"use client";

import Image from "next/image";
import Link from "next/link";
import ProfileMenu from "@/components/profile-menu";
import MessageButton from "@/components/message-button";
import OwnerWorkspaceBadge from "@/components/owner-workspace-badge";
import {
  OwnerNavigationIcon,
  ownerManageNavigation,
  ownerWorkspaceNavigation as navigation,
} from "@/components/owner-navigation";
import { useState } from "react";
import { useToast } from "@/components/toast-provider";

const periods = ["This week", "This month", "This quarter"] as const;
type Period = (typeof periods)[number];

const reportData = {
  "This week": {
    range: "Oct 12 – Oct 18, 2026",
    totalHours: 124.5,
    previousHours: 110.2,
    billableHours: 102.5,
    activePeople: 14,
    chartTitle: "Hours by day",
    chartCaption: "Daily team hours",
    chartLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    chartValues: [21.5, 24, 18.5, 26.5, 22, 5, 7],
    projects: [
      { name: "Website redesign", code: "WEB", hours: 54.5, color: "#7dd3fc" },
      { name: "Content & launch", code: "MKT", hours: 38.5, color: "#a78bfa" },
      { name: "Team operations", code: "OPS", hours: 31.5, color: "#34d399" },
    ],
    members: [
      { name: "Avery Chen", initials: "AC", role: "Product design", hours: 32.5, color: "bg-violet-400/20 text-violet-200" },
      { name: "Jordan Lee", initials: "JL", role: "Engineering", hours: 28, color: "bg-sky-400/20 text-sky-200" },
      { name: "Morgan Park", initials: "MP", role: "Project lead", hours: 25.5, color: "bg-emerald-400/20 text-emerald-200" },
      { name: "Sam Rivera", initials: "SR", role: "Content writing", hours: 21, color: "bg-rose-400/20 text-rose-200" },
      { name: "Taylor Brooks", initials: "TB", role: "Engineering", hours: 17.5, color: "bg-amber-400/20 text-amber-200" },
    ],
  },
  "This month": {
    range: "Oct 1 – Oct 31, 2026",
    totalHours: 486.5,
    previousHours: 452,
    billableHours: 404.5,
    activePeople: 16,
    chartTitle: "Hours by week",
    chartCaption: "Weekly team hours",
    chartLabels: ["Oct 1–4", "Oct 5–11", "Oct 12–18", "Oct 19–25", "Oct 26–31"],
    chartValues: [112, 126.5, 118, 75, 55],
    projects: [
      { name: "Website redesign", code: "WEB", hours: 210, color: "#7dd3fc" },
      { name: "Content & launch", code: "MKT", hours: 158.5, color: "#a78bfa" },
      { name: "Team operations", code: "OPS", hours: 118, color: "#34d399" },
    ],
    members: [
      { name: "Avery Chen", initials: "AC", role: "Product design", hours: 142, color: "bg-violet-400/20 text-violet-200" },
      { name: "Jordan Lee", initials: "JL", role: "Engineering", hours: 108, color: "bg-sky-400/20 text-sky-200" },
      { name: "Morgan Park", initials: "MP", role: "Project lead", hours: 86.5, color: "bg-emerald-400/20 text-emerald-200" },
      { name: "Sam Rivera", initials: "SR", role: "Content writing", hours: 82, color: "bg-rose-400/20 text-rose-200" },
      { name: "Taylor Brooks", initials: "TB", role: "Engineering", hours: 68, color: "bg-amber-400/20 text-amber-200" },
    ],
  },
  "This quarter": {
    range: "Aug 1 – Oct 31, 2026",
    totalHours: 1378.5,
    previousHours: 1294,
    billableHours: 1120,
    activePeople: 18,
    chartTitle: "Hours by month",
    chartCaption: "Monthly team hours",
    chartLabels: ["Aug", "Sep", "Oct"],
    chartValues: [448.5, 450, 480],
    projects: [
      { name: "Website redesign", code: "WEB", hours: 590, color: "#7dd3fc" },
      { name: "Content & launch", code: "MKT", hours: 452.5, color: "#a78bfa" },
      { name: "Team operations", code: "OPS", hours: 336, color: "#34d399" },
    ],
    members: [
      { name: "Avery Chen", initials: "AC", role: "Product design", hours: 365, color: "bg-violet-400/20 text-violet-200" },
      { name: "Jordan Lee", initials: "JL", role: "Engineering", hours: 310, color: "bg-sky-400/20 text-sky-200" },
      { name: "Morgan Park", initials: "MP", role: "Project lead", hours: 252.5, color: "bg-emerald-400/20 text-emerald-200" },
      { name: "Sam Rivera", initials: "SR", role: "Content writing", hours: 236, color: "bg-rose-400/20 text-rose-200" },
      { name: "Taylor Brooks", initials: "TB", role: "Engineering", hours: 215, color: "bg-amber-400/20 text-amber-200" },
    ],
  },
} satisfies Record<
  Period,
  {
    range: string;
    totalHours: number;
    previousHours: number;
    billableHours: number;
    activePeople: number;
    chartTitle: string;
    chartCaption: string;
    chartLabels: string[];
    chartValues: number[];
    projects: { name: string; code: string; hours: number; color: string }[];
    members: { name: string; initials: string; role: string; hours: number; color: string }[];
  }
>;

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
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></>,
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
      {paths[name] ?? paths.reports}
    </svg>
  );
}

function formatHours(hours: number) {
  return Number.isInteger(hours) ? `${hours}` : hours.toFixed(1);
}

function formatChange(current: number, previous: number) {
  return `${(((current - previous) / previous) * 100).toFixed(1)}%`;
}

function escapeCsv(value: string | number) {
  const text = String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export default function ReportsPage() {
  const { notify } = useToast();
  const [period, setPeriod] = useState<Period>("This week");
  const data = reportData[period];
  const billablePercentage = Math.round((data.billableHours / data.totalHours) * 100);
  const change = formatChange(data.totalHours, data.previousHours);
  const maxChartValue = Math.max(...data.chartValues);
  const projectRows = data.projects.map((project) => ({
    ...project,
    share: (project.hours / data.totalHours) * 100,
  }));

  function exportCsv() {
    const rows = [
      ["Report", `Time summary — ${period}`],
      ["Date range", data.range],
      ["Data note", "Sample workspace data"],
      [],
      ["Project", "Project code", "Hours", "Share"],
      ...projectRows.map((project) => [
        project.name,
        project.code,
        project.hours.toFixed(1),
        `${project.share.toFixed(1)}%`,
      ]),
      [],
      ["Team member", "Role", "Hours"],
      ...data.members.map((member) => [
        member.name,
        member.role,
        member.hours.toFixed(1),
      ]),
    ];
    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `vyrtual-report-${period.toLowerCase().replaceAll(" ", "-")}.csv`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify({ kind: "success", title: "Report exported", message: `Your ${period.toLowerCase()} report has been downloaded as a CSV.` });
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
                aria-current={href === "/reports" ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  href === "/reports"
                    ? "bg-sky-400/10 text-sky-200"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <OwnerNavigationIcon name={icon} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="sidebar-section-heading mb-3 mt-9 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">Manage</div>
          <nav aria-label="Workspace settings" className="space-y-1">
            {ownerManageNavigation.map(({ label, href, icon }) => (
              <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white">
                <OwnerNavigationIcon name={icon} />
                {label}
              </Link>
            ))}
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
                  aria-current={href === "/reports" ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-xs font-medium ${
                    href === "/reports" ? "bg-sky-400/10 text-sky-200" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="hidden text-sm text-zinc-500 lg:block">
              Workspace <span className="mx-2 text-zinc-700">/</span>{" "}
              <span className="text-zinc-200">Reports</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <OwnerWorkspaceBadge />
              <button type="button" aria-label="Notifications" className="relative flex size-10 items-center justify-center rounded-xl border border-white/[0.08] text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white">
                <Icon name="bell" className="size-[18px]" />
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-sky-300" />
              </button>
              <MessageButton />
              <ProfileMenu />
            </div>
          </header>

          <nav aria-label="Mobile workspace navigation" className="flex gap-1 overflow-x-auto border-b border-white/[0.07] px-4 py-2 sm:hidden">
            {navigation.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                aria-current={href === "/reports" ? "page" : undefined}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium ${
                  href === "/reports" ? "bg-sky-400/10 text-sky-200" : "text-zinc-400 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-sky-300">Northstar Studio · Analytics</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-[34px]">Reports</h1>
                <p className="mt-2 text-sm text-zinc-400">Understand where your team&apos;s time goes.</p>
              </div>
              <button
                type="button"
                onClick={exportCsv}
                className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-sky-300 px-4 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-200 sm:self-auto"
              >
                <Icon name="download" className="size-4" />
                Export CSV
              </button>
            </section>

            <section className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-white/[0.07] bg-[#111116] p-4 sm:flex-row sm:items-center sm:px-5">
              <div>
                <p className="text-xs font-medium text-zinc-300">Report period</p>
                <p className="mt-1 text-[11px] text-zinc-500">{data.range} <span className="mx-1.5 text-zinc-700">·</span> Sample workspace data</p>
              </div>
              <div className="flex w-fit gap-1 rounded-xl border border-white/[0.06] bg-black/20 p-1">
                {periods.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={period === option}
                    onClick={() => setPeriod(option)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      period === option ? "bg-white/[0.09] text-white" : "text-zinc-500 hover:text-zinc-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </section>

            <section aria-label={`${period} report summary`} className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-4 sm:p-5">
                <p className="text-xs text-zinc-500">Total hours</p>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <span className="text-2xl font-semibold tracking-tight">{formatHours(data.totalHours)}h</span>
                  <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-medium text-emerald-300">+{change}</span>
                </div>
                <p className="mt-2 text-[10px] text-zinc-600">vs. previous period</p>
              </article>
              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-4 sm:p-5">
                <p className="text-xs text-zinc-500">Billable hours</p>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <span className="text-2xl font-semibold tracking-tight">{formatHours(data.billableHours)}h</span>
                  <span className="text-xs text-zinc-500">{billablePercentage}% of total</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-violet-300" style={{ width: `${billablePercentage}%` }} />
                </div>
              </article>
              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-4 sm:p-5">
                <p className="text-xs text-zinc-500">Active teammates</p>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <span className="text-2xl font-semibold tracking-tight">{data.activePeople}</span>
                  <span className="text-xs text-zinc-500">people tracked time</span>
                </div>
                <p className="mt-3 text-[10px] text-zinc-600">In this report period</p>
              </article>
              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-4 sm:p-5">
                <p className="text-xs text-zinc-500">Average per person</p>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <span className="text-2xl font-semibold tracking-tight">{formatHours(data.totalHours / data.activePeople)}h</span>
                  <span className="text-xs text-zinc-500">per period</span>
                </div>
                <p className="mt-3 text-[10px] text-zinc-600">Across active teammates</p>
              </article>
            </section>

            <section className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.85fr)]">
              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-white">{data.chartTitle}</h2>
                    <p className="mt-1 text-xs text-zinc-500">{data.chartCaption} · {period.toLowerCase()}</p>
                  </div>
                  <span className="rounded-md border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-[10px] font-medium text-zinc-400">SAMPLE DATA</span>
                </div>
                <div className="mt-6 flex h-[218px] items-end gap-2 sm:gap-3">
                  {data.chartValues.map((hours, index) => {
                    const label = data.chartLabels[index];
                    const height = Math.max(9, (hours / maxChartValue) * 100);
                    const isPeak = hours === maxChartValue;

                    return (
                      <div key={label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                        <span className={`text-[9px] tabular-nums sm:text-[10px] ${isPeak ? "text-sky-200" : "text-zinc-600"}`}>{formatHours(hours)}</span>
                        <div className="flex h-[158px] w-full items-end justify-center rounded-t-md">
                          <div
                            className={`w-full max-w-12 rounded-t-md transition-colors ${
                              isPeak ? "bg-sky-300" : "bg-sky-300/30 hover:bg-sky-300/60"
                            }`}
                            style={{ height: `${height}%` }}
                            title={`${label}: ${formatHours(hours)} hours`}
                          />
                        </div>
                        <span className={`max-w-full truncate text-[9px] sm:text-[10px] ${isPeak ? "font-medium text-sky-200" : "text-zinc-500"}`}>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </article>

              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
                <div>
                  <h2 className="text-base font-semibold text-white">Billable breakdown</h2>
                  <p className="mt-1 text-xs text-zinc-500">Billable time vs. total tracked</p>
                </div>
                <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
                  <div
                    role="img"
                    aria-label={`${billablePercentage}% billable, ${100 - billablePercentage}% non-billable`}
                    className="relative flex size-40 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(#a78bfa 0% ${billablePercentage}%, rgba(255,255,255,.09) ${billablePercentage}% 100%)`,
                    }}
                  >
                    <div className="flex size-[116px] flex-col items-center justify-center rounded-full bg-[#111116]">
                      <span className="text-2xl font-semibold tracking-tight">{billablePercentage}%</span>
                      <span className="mt-1 text-[10px] text-zinc-500">billable</span>
                    </div>
                  </div>
                  <div className="w-full space-y-4 sm:max-w-[170px]">
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-xs text-zinc-400"><span className="size-2 rounded-full bg-violet-300" />Billable</span>
                        <span className="text-xs font-medium text-zinc-200">{formatHours(data.billableHours)}h</span>
                      </div>
                      <p className="ml-4 mt-1 text-[10px] text-zinc-600">{billablePercentage}% of all time</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-xs text-zinc-400"><span className="size-2 rounded-full bg-zinc-600" />Non-billable</span>
                        <span className="text-xs font-medium text-zinc-200">{formatHours(data.totalHours - data.billableHours)}h</span>
                      </div>
                      <p className="ml-4 mt-1 text-[10px] text-zinc-600">{100 - billablePercentage}% of all time</p>
                    </div>
                  </div>
                </div>
              </article>
            </section>

            <section className="mt-5 grid items-start gap-5 xl:grid-cols-2">
              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-white">Hours by project</h2>
                    <p className="mt-1 text-xs text-zinc-500">Where the team spent its time</p>
                  </div>
                  <Link href="/time-tracking" className="text-xs font-medium text-zinc-400 transition-colors hover:text-white">Time entries</Link>
                </div>
                <div className="mt-5 space-y-5">
                  {projectRows.map((project) => (
                    <div key={project.code}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: project.color }} />
                          <span className="truncate text-xs font-medium text-zinc-200">{project.name}</span>
                        </div>
                        <span className="shrink-0 text-xs text-zinc-400">{formatHours(project.hours)}h <span className="text-zinc-600">· {project.share.toFixed(0)}%</span></span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full" style={{ width: `${project.share}%`, backgroundColor: project.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-white">Team hours</h2>
                    <p className="mt-1 text-xs text-zinc-500">Top contributors · {period.toLowerCase()}</p>
                  </div>
                  <Link href="/team" className="text-xs font-medium text-zinc-400 transition-colors hover:text-white">View team</Link>
                </div>
                <div className="mt-4 divide-y divide-white/[0.06]">
                  {data.members.map((member) => {
                    const share = (member.hours / data.totalHours) * 100;

                    return (
                      <div key={member.initials} className="flex items-center gap-3 py-3 first:pt-1 last:pb-1">
                        <span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${member.color}`}>{member.initials}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <span className="truncate text-xs font-medium text-zinc-200">{member.name}</span>
                            <span className="shrink-0 text-xs text-zinc-300">{formatHours(member.hours)}h</span>
                          </div>
                          <div className="mt-1.5 flex items-center gap-2">
                            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                              <div className="h-full rounded-full bg-sky-300/60" style={{ width: `${share}%` }} />
                            </div>
                            <span className="w-7 text-right text-[9px] text-zinc-600">{share.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            </section>

            <footer className="mt-8 flex flex-col gap-3 border-t border-white/[0.06] pt-5 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
              <span>Northstar Studio workspace · Sample report data</span>
              <Link href="/time-tracking" className="inline-flex items-center gap-1.5 transition-colors hover:text-zinc-300">
                Review time entries
                <Icon name="arrow" className="size-3" />
              </Link>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
