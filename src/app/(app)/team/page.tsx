"use client";

import Image from "next/image";
import Link from "next/link";
import ProfileMenu from "@/components/profile-menu";
import { useMemo, useState, type FormEvent } from "react";
import { useToast } from "@/components/toast-provider";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: "overview" },
  { label: "Virtual office", href: "/office", icon: "office" },
  { label: "Team", href: "/team", icon: "team" },
  { label: "Schedules", href: "/schedules", icon: "team" },
  { label: "Attendance", href: "/attendance", icon: "time" },
  { label: "Time tracking", href: "/time-tracking", icon: "time" },
  { label: "Reports", href: "/reports", icon: "reports" },
];

type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  type: "Employee" | "Freelancer";
  status: string;
  location: string;
  initials: string;
  color: string;
  hours: string;
};

const initialMembers: Member[] = [
  { id: "avery-chen", name: "Avery Chen", email: "avery.chen@northstar.example", role: "Product designer", type: "Employee", status: "Working", location: "Work studio", initials: "AC", color: "bg-violet-400/20 text-violet-200", hours: "32.5h" },
  { id: "jordan-lee", name: "Jordan Lee", email: "jordan.lee@northstar.example", role: "Frontend developer", type: "Employee", status: "Online", location: "Work studio", initials: "JL", color: "bg-sky-400/20 text-sky-200", hours: "28h" },
  { id: "sam-rivera", name: "Sam Rivera", email: "sam.rivera@northstar.example", role: "Content writer", type: "Freelancer", status: "Working", location: "Meeting room", initials: "SR", color: "bg-rose-400/20 text-rose-200", hours: "18.5h" },
  { id: "morgan-park", name: "Morgan Park", email: "morgan.park@northstar.example", role: "Project lead", type: "Employee", status: "Online", location: "Meeting room", initials: "MP", color: "bg-emerald-400/20 text-emerald-200", hours: "34h" },
  { id: "taylor-brooks", name: "Taylor Brooks", email: "taylor.brooks@northstar.example", role: "Software engineer", type: "Employee", status: "Away", location: "Focus room", initials: "TB", color: "bg-amber-400/20 text-amber-200", hours: "30h" },
  { id: "casey-kim", name: "Casey Kim", email: "casey.kim@northstar.example", role: "Data analyst", type: "Freelancer", status: "Offline", location: "—", initials: "CK", color: "bg-indigo-400/20 text-indigo-200", hours: "16h" },
  { id: "riley-morgan", name: "Riley Morgan", email: "riley.morgan@northstar.example", role: "UX researcher", type: "Employee", status: "Working", location: "Work studio", initials: "RM", color: "bg-pink-400/20 text-pink-200", hours: "26h" },
  { id: "jamie-patel", name: "Jamie Patel", email: "jamie.patel@northstar.example", role: "Illustrator", type: "Freelancer", status: "Offline", location: "—", initials: "JP", color: "bg-orange-400/20 text-orange-200", hours: "12.5h" },
];

const statusFilters = ["Everyone", "Working", "Online", "Away", "Offline", "Invited"] as const;
type StatusFilter = (typeof statusFilters)[number];
type MemberTypeFilter = "Everyone" | "Employees" | "Freelancers";

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
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    officeDoor: <><path d="M4 21h16M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" /><path d="M13 12h.01" /></>,
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
      {paths[name] ?? paths.team}
    </svg>
  );
}

function MemberAvatar({
  initials,
  color,
  size = "size-10",
}: {
  initials: string;
  color: string;
  size?: string;
}) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full text-xs font-semibold ring-1 ring-white/[0.06] ${size} ${color}`}>
      {initials}
    </span>
  );
}

export default function TeamPage() {
  const { notify } = useToast();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Everyone");
  const [memberType, setMemberType] = useState<MemberTypeFilter>("Everyone");
  const [teamMembers, setTeamMembers] = useState(initialMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("");
  const [inviteType, setInviteType] = useState<Member["type"]>("Employee");

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return teamMembers.filter((member) => {
      const matchesQuery =
        !normalizedQuery ||
        `${member.name} ${member.email} ${member.role}`.toLowerCase().includes(normalizedQuery);
      const matchesStatus =
        statusFilter === "Everyone" ||
        (statusFilter === "Invited" ? member.status === "Invited" : member.status === statusFilter);
      const matchesType =
        memberType === "Everyone" ||
        (memberType === "Employees" && member.type === "Employee") ||
        (memberType === "Freelancers" && member.type === "Freelancer");

      return matchesQuery && matchesStatus && matchesType;
    });
  }, [memberType, query, statusFilter, teamMembers]);

  function inviteMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = inviteEmail.trim().toLowerCase();
    if (teamMembers.some((member) => member.email.toLowerCase() === normalizedEmail)) {
      notify({ kind: "warning", title: "This email is already on the team", message: normalizedEmail });
      return;
    }

    const fullName = inviteName.trim();
    const initials = fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
    const invitee: Member = {
      id: `invite-${normalizedEmail.replace(/[^a-z0-9]+/g, "-")}`,
      name: fullName,
      email: normalizedEmail,
      role: inviteRole.trim(),
      type: inviteType,
      status: "Invited",
      location: "Invitation pending",
      initials,
      color: "bg-sky-400/20 text-sky-200",
      hours: "—",
    };
    setTeamMembers((current) => [invitee, ...current]);
    setStatusFilter("Everyone");
    setMemberType("Everyone");
    setQuery("");

    const body = [
      `Hi ${fullName},`,
      "",
      `You’ve been invited to join Northstar Studio on Vyrtual as a ${inviteType.toLowerCase()}${inviteRole.trim() ? ` (${inviteRole.trim()})` : ""}.`,
      "",
      "Please reply to this email to coordinate access. This preview does not yet generate an account invitation link.",
    ].join("\n");
    const mailto = `mailto:${encodeURIComponent(normalizedEmail)}?${new URLSearchParams({
      subject: "You’re invited to join Northstar Studio on Vyrtual",
      body,
    }).toString()}`;

    setInviteOpen(false);
    setInviteName("");
    setInviteEmail("");
    setInviteRole("");
    setInviteType("Employee");
    notify({
      kind: "success",
      title: "Invitation prepared",
      message: "The person was added as pending. Send the prepared email to invite them.",
    });
    window.location.href = mailto;
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
                aria-current={href === "/team" ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  href === "/team"
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
                  aria-current={href === "/team" ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-xs font-medium ${
                    href === "/team" ? "bg-sky-400/10 text-sky-200" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="hidden text-sm text-zinc-500 lg:block">
              Workspace <span className="mx-2 text-zinc-700">/</span>{" "}
              <span className="text-zinc-200">Team</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-xs text-zinc-400 sm:inline-flex">
                Northstar Studio
              </span>
              <button
                type="button"
                aria-label="Notifications"
                className="relative flex size-10 items-center justify-center rounded-xl border border-white/[0.08] text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
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
                aria-current={href === "/team" ? "page" : undefined}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium ${
                  href === "/team" ? "bg-sky-400/10 text-sky-200" : "text-zinc-400 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-sky-300">Northstar Studio · People</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-[34px]">Your team</h1>
                <p className="mt-2 text-sm text-zinc-400">Get to know the people behind the work.</p>
              </div>
              <div className="flex flex-wrap gap-2 self-start sm:self-auto">
                <button type="button" onClick={() => setInviteOpen(true)} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-300 px-4 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-200">
                  <span aria-hidden="true" className="text-lg leading-none">+</span>
                  Invite teammate
                </button>
                <Link
                  href="/office"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/[0.07]"
                >
                  <Icon name="officeDoor" className="size-4" />
                  Visit the office
                </Link>
              </div>
            </section>

            <section aria-label="Team summary" className="mt-8 grid gap-3 sm:grid-cols-3">
              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-4 sm:p-5">
                <p className="text-xs text-zinc-500">Team members</p>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-2xl font-semibold tracking-tight">{18 + teamMembers.filter((member) => member.status === "Invited").length}</span>
                  <span className="text-xs text-zinc-500">Including pending invites</span>
                </div>
              </article>
              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-4 sm:p-5">
                <p className="text-xs text-zinc-500">Employees</p>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-2xl font-semibold tracking-tight">12</span>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-300"><span className="size-1.5 rounded-full bg-emerald-300" />5 working now</span>
                </div>
              </article>
              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-4 sm:p-5">
                <p className="text-xs text-zinc-500">Freelancers</p>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-2xl font-semibold tracking-tight">6</span>
                  <span className="text-xs text-zinc-500">Across 3 specialties</span>
                </div>
              </article>
            </section>

            <section className="mt-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-white">All members</h2>
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] text-zinc-400">{filteredMembers.length}</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">Sample team directory · 8 preview profiles</p>
                </div>
                <label className="relative block w-full sm:max-w-[280px]">
                  <span className="sr-only">Search team members</span>
                  <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search people..."
                    className="h-10 w-full rounded-xl border border-white/[0.08] bg-[#111116] pl-9 pr-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-sky-300/40"
                  />
                </label>
              </div>

              <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#111116] p-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                <div className="flex max-w-full gap-1 overflow-x-auto">
                  {statusFilters.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      aria-pressed={statusFilter === filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                        statusFilter === filter
                          ? "bg-white/[0.09] text-white"
                          : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <label className="flex shrink-0 items-center gap-2 text-xs text-zinc-500">
                  <span className="sr-only">Filter by member type</span>
                  <span>Type</span>
                  <select
                    value={memberType}
                    onChange={(event) => {
                      const value = event.target.value;
                      setMemberType(
                        value === "Employees" || value === "Freelancers"
                          ? value
                          : "Everyone",
                      );
                    }}
                    className="h-9 rounded-lg border border-white/[0.08] bg-[#17171e] px-3 text-xs font-medium text-zinc-300 outline-none focus:border-sky-300/40"
                  >
                    <option>Everyone</option>
                    <option>Employees</option>
                    <option>Freelancers</option>
                  </select>
                </label>
              </div>

              {filteredMembers.length > 0 ? (
                <div className="mt-3 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                  {filteredMembers.map((member) => (
                    <article key={member.email} className="rounded-2xl border border-white/[0.07] bg-[#111116] p-4 transition-colors hover:border-white/[0.12] sm:p-5">
                      <div className="flex items-start gap-3">
                        <MemberAvatar initials={member.initials} color={member.color} size="size-11" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <h3 className="truncate text-sm font-semibold text-white">{member.name}</h3>
                            <span className={`inline-flex items-center gap-1.5 text-[10px] ${
                              member.status === "Invited"
                                ? "text-sky-300"
                                : member.status === "Working" || member.status === "Online"
                                ? "text-emerald-300"
                                : member.status === "Away"
                                  ? "text-amber-300"
                                  : "text-zinc-500"
                            }`}>
                              <span className={`size-1.5 rounded-full ${
                                member.status === "Invited"
                                  ? "bg-sky-300"
                                  : member.status === "Working" || member.status === "Online"
                                  ? "bg-emerald-300"
                                  : member.status === "Away"
                                    ? "bg-amber-300"
                                    : "bg-zinc-600"
                              }`} />
                              {member.status}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-xs text-zinc-500">{member.role}</p>
                          <p className="mt-1 truncate text-[11px] text-zinc-600">{member.email}</p>
                        </div>
                        <span className="rounded-md border border-white/[0.07] bg-white/[0.025] px-2 py-1 text-[10px] text-zinc-400">
                          {member.type}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
                        <span className="flex min-w-0 items-center gap-1.5 truncate text-[11px] text-zinc-500">
                          <Icon name="officeDoor" className="size-3.5 shrink-0" />
                          {member.location}
                        </span>
                        <span className="shrink-0 text-[11px] text-zinc-400">{member.hours} this week</span>
                        {member.status === "Invited" ? (
                          <span className="shrink-0 text-[11px] font-medium text-sky-200">Pending invite</span>
                        ) : (
                          <Link href={`/team/${member.id}`} className="shrink-0 text-[11px] font-medium text-sky-200 transition-colors hover:text-white">
                            View profile
                          </Link>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-3 rounded-2xl border border-dashed border-white/[0.1] bg-[#111116] px-5 py-14 text-center">
                  <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-white/[0.04] text-zinc-400">
                    <Icon name="search" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-white">No matching teammates</h3>
                  <p className="mt-1 text-xs text-zinc-500">Try another name or change your filters.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setStatusFilter("Everyone");
                      setMemberType("Everyone");
                    }}
                    className="mt-4 text-xs font-medium text-sky-200 transition-colors hover:text-white"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </section>

            <footer className="mt-8 flex flex-col gap-3 border-t border-white/[0.06] pt-5 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
              <span>Northstar Studio workspace · Sample team data</span>
              <Link href="/office" className="transition-colors hover:text-zinc-300">Open virtual office</Link>
            </footer>
          </div>
        </div>
      </div>
      {inviteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setInviteOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-team-title"
            className="w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#111116] p-5 shadow-2xl shadow-black/50 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sky-300">Northstar Studio</p>
                <h2 id="invite-team-title" className="mt-2 text-lg font-semibold">Invite a teammate</h2>
                <p className="mt-1 text-xs leading-5 text-zinc-400">Add their personal details and prepare an invitation email.</p>
              </div>
              <button type="button" aria-label="Close invitation form" onClick={() => setInviteOpen(false)} className="flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white">×</button>
            </div>
            <form onSubmit={inviteMember} className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-medium text-zinc-300">Full name</span>
                <input autoFocus required maxLength={100} value={inviteName} onChange={(event) => setInviteName(event.target.value)} placeholder="e.g. Jamie Rivera" className="h-11 w-full rounded-xl border border-white/[0.09] bg-[#0d0d12] px-3.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-sky-300/40" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-medium text-zinc-300">Email address</span>
                <input type="email" autoComplete="email" required maxLength={254} value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="teammate@company.com" className="h-11 w-full rounded-xl border border-white/[0.09] bg-[#0d0d12] px-3.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-sky-300/40" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-medium text-zinc-300">Job title / role</span>
                  <input required maxLength={80} value={inviteRole} onChange={(event) => setInviteRole(event.target.value)} placeholder="e.g. Product designer" className="h-11 w-full rounded-xl border border-white/[0.09] bg-[#0d0d12] px-3.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-sky-300/40" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-medium text-zinc-300">Team member type</span>
                  <select value={inviteType} onChange={(event) => setInviteType(event.target.value === "Freelancer" ? "Freelancer" : "Employee")} className="h-11 w-full rounded-xl border border-white/[0.09] bg-[#0d0d12] px-3.5 text-sm text-zinc-100 outline-none focus:border-sky-300/40">
                    <option>Employee</option>
                    <option>Freelancer</option>
                  </select>
                </label>
              </div>
              <p className="rounded-xl border border-amber-300/10 bg-amber-300/[0.04] px-3.5 py-3 text-[11px] leading-5 text-zinc-400">
                This preview adds them as pending and opens a prefilled email draft. Sending account invitations requires a connected email and invite service.
              </p>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setInviteOpen(false)} className="h-10 rounded-xl border border-white/[0.08] px-4 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.05]">Cancel</button>
                <button type="submit" className="h-10 rounded-xl bg-sky-300 px-4 text-xs font-semibold text-slate-950 transition-colors hover:bg-sky-200">Prepare email invite</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
