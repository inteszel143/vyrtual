"use client";

import Image from "next/image";
import Link from "next/link";
import ProfileMenu from "@/components/profile-menu";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: "overview" },
  { label: "Virtual office", href: "/office", icon: "office" },
  { label: "Team", href: "/team", icon: "team" },
  { label: "Schedules", href: "/schedules", icon: "team" },
  { label: "Attendance", href: "/attendance", icon: "time" },
  { label: "Time tracking", href: "/time-tracking", icon: "time" },
  { label: "Reports", href: "/reports", icon: "reports" },
];

const invoices = [
  { number: "VYR-2026-010", date: "Oct 1, 2026", period: "October 2026", amount: 342, status: "Paid" },
  { number: "VYR-2026-009", date: "Sep 1, 2026", period: "September 2026", amount: 342, status: "Paid" },
  { number: "VYR-2026-008", date: "Aug 1, 2026", period: "August 2026", amount: 323, status: "Paid" },
  { number: "VYR-2026-007", date: "Jul 1, 2026", period: "July 2026", amount: 323, status: "Paid" },
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
    card: <><rect x="2.5" y="4" width="19" height="16" rx="2" /><path d="M2.5 9h19M7 15h3" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.6 9a2.5 2.5 0 1 1 4.8 1c-.5 1.2-2.4 1.5-2.4 3M12 17h.01" /></>,
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
      {paths[name] ?? paths.billing}
    </svg>
  );
}

function escapeCsv(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function downloadInvoiceHistory() {
  const rows = [
    ["Invoice", "Date", "Billing period", "Amount (USD)", "Status"],
    ...invoices.map((invoice) => [
      invoice.number,
      invoice.date,
      invoice.period,
      invoice.amount.toFixed(2),
      invoice.status,
    ]),
  ];
  const blob = new Blob(
    [rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n")],
    { type: "text/csv;charset=utf-8" },
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "vyrtual-invoice-history-preview.csv";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function BillingPage() {
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
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <Icon name={icon} className="size-[18px]" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="sidebar-section-heading mb-3 mt-9 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">Manage</div>
          <nav aria-label="Workspace settings" className="space-y-1">
            <Link href="/billing" aria-current="page" className="flex items-center gap-3 rounded-xl bg-sky-400/10 px-3 py-2.5 text-sm font-medium text-sky-200">
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
                <p className="text-xs text-zinc-500">Team plan · Preview</p>
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
                <Link key={href} href={href} className="rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:text-white">
                  {label}
                </Link>
              ))}
            </nav>
            <div className="hidden text-sm text-zinc-500 lg:block">
              Workspace <span className="mx-2 text-zinc-700">/</span>{" "}
              <span className="text-zinc-200">Billing</span>
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
              <Link key={href} href={href} className="shrink-0 rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:text-white">
                {label}
              </Link>
            ))}
          </nav>

          <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-sky-300">Northstar Studio · Workspace</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-[34px]">Billing</h1>
                <p className="mt-2 text-sm text-zinc-400">Your plan, usage, and invoice history in one place.</p>
              </div>
              <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-amber-300/10 bg-amber-300/[0.06] px-3 py-1.5 text-[10px] font-medium text-amber-200 sm:self-auto">
                Preview billing
              </span>
            </section>

            <section aria-label="Billing summary" className="mt-8 grid gap-3 sm:grid-cols-3">
              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-4 sm:p-5">
                <p className="text-xs text-zinc-500">Current plan</p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <span className="text-2xl font-semibold tracking-tight">Team</span>
                  <span className="rounded-full bg-sky-300/10 px-2.5 py-1 text-[10px] font-medium text-sky-200">Monthly</span>
                </div>
                <p className="mt-2 text-xs text-zinc-500">$19 per member / month</p>
              </article>
              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-4 sm:p-5">
                <p className="text-xs text-zinc-500">Estimated monthly total</p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <span className="text-2xl font-semibold tracking-tight">$342<span className="ml-1 text-sm font-normal text-zinc-500">USD</span></span>
                  <span className="text-xs text-zinc-500">18 members</span>
                </div>
                <p className="mt-2 text-xs text-zinc-500">Preview estimate · before applicable taxes</p>
              </article>
              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-4 sm:p-5">
                <p className="text-xs text-zinc-500">Next renewal</p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <span className="text-2xl font-semibold tracking-tight">Nov 1</span>
                  <span className="text-xs text-zinc-500">2026</span>
                </div>
                <p className="mt-2 text-xs text-zinc-500">Illustrative date · billing not connected</p>
              </article>
            </section>

            <section className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
              <article className="overflow-hidden rounded-2xl border border-sky-300/15 bg-[linear-gradient(135deg,rgba(56,189,248,0.08),rgba(17,17,22,0.96)_48%)]">
                <div className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-start sm:p-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/10 bg-sky-300/[0.07] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-sky-200">
                      <Icon name="check" className="size-3" />
                      Current plan
                    </span>
                    <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">Team</h2>
                    <p className="mt-1 max-w-md text-sm leading-6 text-zinc-400">The essentials to keep a growing remote team in sync.</p>
                    <p className="mt-4 text-sm text-zinc-300">
                      <span className="text-2xl font-semibold text-white">$19</span>
                      <span className="text-zinc-500"> / member / month</span>
                    </p>
                  </div>
                  <Link href="/pricing" className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-3.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.08]">
                    Compare plans
                    <Icon name="arrow" className="size-3.5" />
                  </Link>
                </div>
                <div className="border-t border-white/[0.06] px-5 py-4 sm:px-6">
                  <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">Included in your plan</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {["Team and freelancer directory", "Working-hours tracking", "Time and team reports", "Flexible team management"].map((feature) => (
                      <p key={feature} className="flex items-center gap-2 text-xs text-zinc-300">
                        <Icon name="check" className="size-3.5 shrink-0 text-sky-300" />
                        {feature}
                      </p>
                    ))}
                  </div>
                  <p className="mt-4 text-[10px] text-zinc-600">Plan details from Vyrtual pricing. No subscription is currently connected.</p>
                </div>
              </article>

              <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-white">Member usage</h2>
                    <p className="mt-1 text-xs text-zinc-500">Current workspace directory</p>
                  </div>
                  <span className="rounded-md border border-white/[0.07] bg-white/[0.025] px-2 py-1 text-[9px] font-medium text-zinc-500">PREVIEW</span>
                </div>
                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <span className="text-3xl font-semibold tracking-tight">18</span>
                    <span className="ml-2 text-xs text-zinc-500">members</span>
                  </div>
                  <Link href="/team" className="text-xs font-medium text-sky-200 transition-colors hover:text-white">View team</Link>
                </div>
                <div className="mt-4 flex -space-x-2">
                  {[
                    ["AC", "bg-violet-400/20 text-violet-200"],
                    ["JL", "bg-sky-400/20 text-sky-200"],
                    ["SR", "bg-rose-400/20 text-rose-200"],
                    ["MP", "bg-emerald-400/20 text-emerald-200"],
                    ["TB", "bg-amber-400/20 text-amber-200"],
                  ].map(([initials, color]) => (
                    <span key={initials} className={`flex size-8 items-center justify-center rounded-full text-[9px] font-semibold ring-2 ring-[#111116] ${color}`}>{initials}</span>
                  ))}
                  <span className="flex size-8 items-center justify-center rounded-full bg-white/[0.06] text-[9px] font-medium text-zinc-400 ring-2 ring-[#111116]">+13</span>
                </div>
                <p className="mt-4 text-[11px] leading-5 text-zinc-500">Preview seat count only. Seat limits and usage billing are not connected.</p>
              </article>
            </section>

            <section className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
              <article className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111116]">
                <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6">
                  <div>
                    <h2 className="text-base font-semibold text-white">Invoice history</h2>
                    <p className="mt-1 text-xs text-zinc-500">Recent billing activity · sample records</p>
                  </div>
                  <button type="button" onClick={downloadInvoiceHistory} className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-lg border border-white/[0.08] px-3 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.04] sm:self-auto">
                    <Icon name="download" className="size-3.5" />
                    Export CSV
                  </button>
                </div>
                <div className="hidden grid-cols-[minmax(125px,.8fr)_minmax(120px,.8fr)_minmax(130px,1fr)_minmax(85px,.6fr)_minmax(70px,.5fr)] gap-3 border-y border-white/[0.06] px-5 py-3 font-mono text-[9px] font-medium uppercase tracking-[0.13em] text-zinc-600 sm:grid sm:px-6">
                  <span>Invoice</span>
                  <span>Date</span>
                  <span>Billing period</span>
                  <span>Amount</span>
                  <span className="text-right">Status</span>
                </div>
                <div className="divide-y divide-white/[0.06]">
                  {invoices.map((invoice) => (
                    <div key={invoice.number} className="grid gap-2 px-5 py-3.5 sm:grid-cols-[minmax(125px,.8fr)_minmax(120px,.8fr)_minmax(130px,1fr)_minmax(85px,.6fr)_minmax(70px,.5fr)] sm:items-center sm:gap-3 sm:px-6">
                      <span className="text-xs font-medium text-zinc-200">{invoice.number}</span>
                      <span className="text-[11px] text-zinc-500">{invoice.date}</span>
                      <span className="text-[11px] text-zinc-500">{invoice.period}</span>
                      <span className="text-xs text-zinc-300">${invoice.amount.toFixed(2)}</span>
                      <span className="flex items-center gap-1.5 text-[10px] text-emerald-300 sm:justify-end"><span className="size-1.5 rounded-full bg-emerald-300" />{invoice.status}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/[0.06] px-5 py-3 text-[10px] text-zinc-600 sm:px-6">
                  Example invoices for layout preview only. These are not payment records.
                </div>
              </article>

              <div className="grid gap-5">
                <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-white/[0.04] text-zinc-300">
                      <Icon name="card" className="size-[18px]" />
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold text-white">Payment method</h2>
                      <p className="mt-0.5 text-[10px] text-zinc-500">Not connected</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl border border-dashed border-white/[0.1] bg-black/10 p-4">
                    <p className="text-xs font-medium text-zinc-300">No payment method on file</p>
                    <p className="mt-1 text-[11px] leading-5 text-zinc-600">Payment processing will be available once billing is connected.</p>
                  </div>
                  <button type="button" disabled className="mt-3 h-9 w-full cursor-not-allowed rounded-lg border border-white/[0.06] text-xs font-medium text-zinc-600" title="Payment processing is not connected">
                    Add payment method
                  </button>
                </article>

                <article className="rounded-2xl border border-sky-300/10 bg-sky-300/[0.035] p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-300/10 text-sky-200">
                      <Icon name="help" className="size-4" />
                    </span>
                    <div>
                      <h2 className="text-xs font-semibold text-zinc-100">Questions about billing?</h2>
                      <p className="mt-1 text-[11px] leading-5 text-zinc-500">Our team can help you find the right plan for your remote workspace.</p>
                      <Link href="/contact" className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-sky-200 transition-colors hover:text-white">
                        Contact us
                        <Icon name="arrow" className="size-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            <footer className="mt-8 flex flex-col gap-3 border-t border-white/[0.06] pt-5 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
              <span>Northstar Studio workspace · Billing preview</span>
              <Link href="/pricing" className="transition-colors hover:text-zinc-300">View all plans</Link>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
