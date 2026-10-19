import MemberWelcome from "@/components/member-welcome";
import MemberGreeting from "@/components/member-greeting";
import CompanyName from "@/components/company-name";
import Link from "next/link";
import PersonalWorkspaceShell from "@/components/personal-workspace-shell";

const metrics = [
  { label: "Hours this week", value: "28.5h", detail: "71% of your 40h goal", bar: "w-[71%]" },
  { label: "Sessions completed", value: "12", detail: "Across 4 workdays", bar: "w-[80%]" },
  { label: "Next shift", value: "Tomorrow", detail: "9:00 AM – 5:00 PM", bar: "w-[48%]" },
];

export default function MyWorkspacePage() {
  return (
    <PersonalWorkspaceShell activeHref="/my-workspace" title="My workspace" description="Your personal view of work, time, and what’s coming up.">
      <MemberWelcome />
      <section className="rounded-2xl border border-sky-300/15 bg-gradient-to-br from-sky-300/[0.08] to-indigo-400/[0.03] p-5 sm:p-7">
        <MemberGreeting />
        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">You’re making steady progress this week. Review your schedule or start tracking your next work session.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/my-time" className="inline-flex h-10 items-center rounded-xl bg-sky-300 px-4 text-xs font-semibold text-slate-950 transition-colors hover:bg-sky-200">Track my time</Link>
          <Link href="/my-schedule" className="inline-flex h-10 items-center rounded-xl border border-white/[0.1] px-4 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.05]">View my schedule</Link>
        </div>
      </section>

      <section aria-label="Personal work summary" className="mt-5 grid gap-3 md:grid-cols-3">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5">
            <p className="text-xs text-zinc-500">{metric.label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight">{metric.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{metric.detail}</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className={`h-full rounded-full bg-sky-300 ${metric.bar}`} /></div>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
        <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div><h3 className="text-sm font-semibold">Recent sessions</h3><p className="mt-1 text-xs text-zinc-500">Your latest tracked work</p></div>
            <Link href="/my-time" className="text-xs font-medium text-sky-200 hover:text-white">View all</Link>
          </div>
          <div className="mt-4 divide-y divide-white/[0.05]">
            {[["Today", "Brand design refinements", "3h 20m"], ["Yesterday", "Campaign landing page", "6h 45m"], ["Friday", "Client review & revisions", "5h 30m"]].map(([day, project, duration]) => (
              <div key={day} className="flex items-center justify-between gap-3 py-3">
                <div><p className="text-xs font-medium text-zinc-200">{project}</p><p className="mt-1 text-[10px] text-zinc-500">{day} · <CompanyName /></p></div>
                <span className="shrink-0 text-xs text-zinc-400">{duration}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold">Coming up</h3><p className="mt-1 text-xs text-zinc-500">Your next scheduled work</p></div><Link href="/my-schedule" className="text-xs font-medium text-sky-200 hover:text-white">Schedule</Link></div>
          <div className="mt-5 rounded-xl border border-violet-300/20 bg-violet-300/[0.06] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-violet-200">Tomorrow · 9:00 AM</p>
            <p className="mt-2 text-sm font-medium">Design sprint</p>
            <p className="mt-1 text-xs text-zinc-400">Work studio · 8 hours</p>
          </div>
          <Link href="/my-office" className="mt-4 inline-flex text-xs font-medium text-zinc-400 transition-colors hover:text-white">Go to my office <span className="ml-1" aria-hidden="true">→</span></Link>
        </article>
      </section>
    </PersonalWorkspaceShell>
  );
}
