"use client";

import Image from "next/image";
import Link from "next/link";
import ProfileMenu from "@/components/profile-menu";
import MessageButton from "@/components/message-button";
import OwnerWorkspaceBadge from "@/components/owner-workspace-badge";
import { useState, type FormEvent } from "react";
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
    profile: <><circle cx="12" cy="8" r="4" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></>,
    building: <><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5M9 9h.01M15 9h.01M9 12h.01M15 12h.01" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
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
      {paths[name] ?? paths.settings}
    </svg>
  );
}

function SettingField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 sm:grid-cols-[minmax(130px,.65fr)_minmax(0,1.35fr)] sm:items-center sm:gap-5">
      <span>
        <span className="block text-xs font-medium text-zinc-300">{label}</span>
        {hint && <span className="mt-1 block text-[10px] leading-4 text-zinc-600">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function PreferenceToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div>
        <p className="text-xs font-medium text-zinc-200">{title}</p>
        <p className="mt-1 text-[11px] leading-5 text-zinc-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 ${
          checked ? "bg-sky-300" : "bg-zinc-700"
        }`}
      >
        <span className={`absolute top-1 size-4 rounded-full bg-white transition-transform ${
          checked ? "left-6" : "left-1"
        }`} />
      </button>
    </div>
  );
}

const inputClassName =
  "h-10 w-full rounded-lg border border-white/[0.08] bg-[#0d0d12] px-3 text-xs text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-sky-300/40";

export default function SettingsPage() {
  const { notify } = useToast();
  const [workspaceName, setWorkspaceName] = useState("Northstar Studio");
  const [workspaceUrl, setWorkspaceUrl] = useState("northstar-studio");
  const [fullName, setFullName] = useState("Alex Morgan");
  const [email, setEmail] = useState("alex@northstar.example");
  const [timezone, setTimezone] = useState("Asia/Singapore");
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [teamActivity, setTeamActivity] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavedMessage("Preview updated for this page. Settings aren’t connected to an account yet.");
    notify({ kind: "success", title: "Settings updated", message: "Preview updated for this page. Changes aren’t saved to an account." });
  }

  function updatePreference(update: () => void) {
    update();
    setSavedMessage("");
    notify({ kind: "info", title: "Preference updated", message: "Your selection changed in this preview." });
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
              <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white">
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
            <Link href="/settings" aria-current="page" className="flex items-center gap-3 rounded-xl bg-sky-400/10 px-3 py-2.5 text-sm font-medium text-sky-200">
              <Icon name="settings" className="size-[18px]" />
              Settings
            </Link>
          </nav>
          <div className="mt-auto rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-300 to-indigo-400 text-xs font-semibold text-slate-950">NL</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">Northstar Studio</p>
                <p className="text-xs text-zinc-500">Workspace preview</p>
              </div>
            </div>
            <Link href="/billing" className="mt-4 flex items-center justify-between rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.04]">
              Billing details
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
                <Link key={href} href={href} className="rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:text-white">{label}</Link>
              ))}
            </nav>
            <div className="hidden text-sm text-zinc-500 lg:block">
              Workspace <span className="mx-2 text-zinc-700">/</span>{" "}
              <span className="text-zinc-200">Settings</span>
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
              <Link key={href} href={href} className="shrink-0 rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:text-white">{label}</Link>
            ))}
          </nav>

          <div className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-sky-300">Northstar Studio · Preferences</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-[34px]">Settings</h1>
                <p className="mt-2 text-sm text-zinc-400">Manage your workspace and personal preferences.</p>
              </div>
              <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-amber-300/10 bg-amber-300/[0.06] px-3 py-1.5 text-[10px] font-medium text-amber-200 sm:self-auto">
                Preview settings
              </span>
            </section>

            <div className="mt-8 grid items-start gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
              <nav aria-label="Settings sections" className="sticky top-[88px] hidden rounded-2xl border border-white/[0.07] bg-[#111116] p-2 lg:block">
                {[
                  ["workspace", "Workspace", "building"],
                  ["profile", "Your profile", "profile"],
                  ["notifications", "Notifications", "bell"],
                  ["security", "Security", "shield"],
                ].map(([id, label, icon]) => (
                  <a key={id} href={`#${id}`} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white">
                    <Icon name={icon} className="size-4" />
                    {label}
                  </a>
                ))}
              </nav>

              <form onSubmit={saveSettings} className="min-w-0 space-y-5">
                <section id="workspace" className="scroll-mt-24 rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
                  <div className="flex items-start gap-3 border-b border-white/[0.06] pb-5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-300/10 text-sky-200">
                      <Icon name="building" className="size-[18px]" />
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold text-white">Workspace details</h2>
                      <p className="mt-1 text-[11px] text-zinc-500">How your company appears across Vyrtual.</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-5">
                    <SettingField label="Workspace name" hint="Shown to everyone in your virtual office.">
                      <input className={inputClassName} value={workspaceName} onChange={(event) => { setWorkspaceName(event.target.value); setSavedMessage(""); }} maxLength={80} required />
                    </SettingField>
                    <SettingField label="Workspace URL" hint="Your team’s unique workspace address.">
                      <div className="flex min-w-0 items-center rounded-lg border border-white/[0.08] bg-[#0d0d12] focus-within:border-sky-300/40">
                        <span className="hidden shrink-0 pl-3 text-[10px] text-zinc-600 sm:block">vyrtual.app/</span>
                        <input className="h-10 min-w-0 flex-1 bg-transparent px-3 text-xs text-zinc-100 outline-none placeholder:text-zinc-600 sm:pl-0" value={workspaceUrl} onChange={(event) => { setWorkspaceUrl(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")); setSavedMessage(""); }} maxLength={48} required aria-label="Workspace URL slug" />
                      </div>
                    </SettingField>
                    <SettingField label="Workspace type">
                      <select className={inputClassName} defaultValue="Creative studio">
                        <option>Creative studio</option>
                        <option>Technology company</option>
                        <option>Consulting</option>
                        <option>Other</option>
                      </select>
                    </SettingField>
                  </div>
                </section>

                <section id="profile" className="scroll-mt-24 rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
                  <div className="flex items-start gap-3 border-b border-white/[0.06] pb-5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-300/10 text-violet-200">
                      <Icon name="profile" className="size-[18px]" />
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold text-white">Your profile</h2>
                      <p className="mt-1 text-[11px] text-zinc-500">Personal details and working preferences.</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <SettingField label="Full name">
                        <input className={inputClassName} value={fullName} onChange={(event) => { setFullName(event.target.value); setSavedMessage(""); }} maxLength={80} required />
                      </SettingField>
                      <SettingField label="Email address">
                        <input className={inputClassName} type="email" value={email} onChange={(event) => { setEmail(event.target.value); setSavedMessage(""); }} required />
                      </SettingField>
                    </div>
                    <SettingField label="Time zone" hint="Used to display your team's local work hours.">
                      <select className={inputClassName} value={timezone} onChange={(event) => { setTimezone(event.target.value); setSavedMessage(""); }}>
                        <option value="Asia/Singapore">Singapore (UTC+08:00)</option>
                        <option value="Asia/Tokyo">Tokyo (UTC+09:00)</option>
                        <option value="Australia/Sydney">Sydney</option>
                        <option value="Europe/London">London</option>
                        <option value="America/New_York">New York</option>
                        <option value="America/Los_Angeles">Los Angeles</option>
                      </select>
                    </SettingField>
                  </div>
                </section>

                <section id="notifications" className="scroll-mt-24 rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
                  <div className="flex items-start gap-3 border-b border-white/[0.06] pb-5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-300/10 text-amber-200">
                      <Icon name="bell" className="size-[18px]" />
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold text-white">Notifications</h2>
                      <p className="mt-1 text-[11px] text-zinc-500">Choose which updates you’d like to receive.</p>
                    </div>
                  </div>
                  <div className="mt-5 divide-y divide-white/[0.06]">
                    <PreferenceToggle title="Weekly team summary" description="A weekly email with your team's hours and highlights." checked={weeklySummary} onChange={() => updatePreference(() => setWeeklySummary((value) => !value))} />
                    <PreferenceToggle title="Team activity" description="Updates when teammates join the office or start a huddle." checked={teamActivity} onChange={() => updatePreference(() => setTeamActivity((value) => !value))} />
                    <PreferenceToggle title="Product updates" description="Occasional news about improvements to Vyrtual." checked={productUpdates} onChange={() => updatePreference(() => setProductUpdates((value) => !value))} />
                  </div>
                </section>

                <section id="security" className="scroll-mt-24 rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-200">
                      <Icon name="shield" className="size-[18px]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-semibold text-white">Security</h2>
                      <p className="mt-1 text-[11px] text-zinc-500">Account security controls.</p>
                      <div className="mt-4 flex flex-col justify-between gap-3 rounded-xl border border-white/[0.06] bg-black/10 p-4 sm:flex-row sm:items-center">
                        <div>
                          <p className="text-xs font-medium text-zinc-200">Password</p>
                          <p className="mt-1 text-[11px] text-zinc-600">Password management is handled by your sign-in provider.</p>
                        </div>
                        <Link href="/forgot-password" className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] px-3 text-[11px] font-medium text-zinc-300 transition-colors hover:bg-white/[0.04]">
                          Reset password
                        </Link>
                      </div>
                      <p className="mt-3 text-[10px] leading-5 text-zinc-600">Two-factor authentication and active-session controls will be available when account security is connected.</p>
                    </div>
                  </div>
                </section>

                <div className="sticky bottom-3 z-[2] flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[#111116]/95 p-3 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-4">
                  <p aria-live="polite" className="min-h-4 text-[10px] leading-4 text-zinc-500">
                    {savedMessage || "Settings are a local preview and are not saved to an account."}
                  </p>
                  <button type="submit" className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-300 px-4 text-xs font-semibold text-slate-950 transition-colors hover:bg-sky-200">
                    <Icon name="check" className="size-4" />
                    Save preview
                  </button>
                </div>
              </form>
            </div>

            <footer className="mt-8 flex flex-col gap-3 border-t border-white/[0.06] pt-5 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
              <span>Northstar Studio workspace · Settings preview</span>
              <Link href="/billing" className="transition-colors hover:text-zinc-300">Manage billing</Link>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
