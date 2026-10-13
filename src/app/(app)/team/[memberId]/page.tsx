import Link from "next/link";
import { notFound } from "next/navigation";
import OwnerWorkspaceShell from "@/components/owner-workspace-shell";

const members = {
  "avery-chen": { name: "Avery Chen", role: "Product designer", type: "Employee", email: "avery.chen@northstar.example", initials: "AC", status: "Working", location: "Work studio", hours: "32.5h", color: "from-violet-300 to-fuchsia-300" },
  "jordan-lee": { name: "Jordan Lee", role: "Frontend developer", type: "Employee", email: "jordan.lee@northstar.example", initials: "JL", status: "Online", location: "Work studio", hours: "28h", color: "from-sky-300 to-blue-400" },
  "sam-rivera": { name: "Sam Rivera", role: "Content writer", type: "Freelancer", email: "sam.rivera@northstar.example", initials: "SR", status: "Working", location: "Meeting room", hours: "18.5h", color: "from-rose-300 to-orange-300" },
  "morgan-park": { name: "Morgan Park", role: "Project lead", type: "Employee", email: "morgan.park@northstar.example", initials: "MP", status: "Online", location: "Meeting room", hours: "34h", color: "from-emerald-300 to-teal-400" },
  "taylor-brooks": { name: "Taylor Brooks", role: "Software engineer", type: "Employee", email: "taylor.brooks@northstar.example", initials: "TB", status: "Away", location: "Focus room", hours: "30h", color: "from-amber-300 to-orange-400" },
  "casey-kim": { name: "Casey Kim", role: "Data analyst", type: "Freelancer", email: "casey.kim@northstar.example", initials: "CK", status: "Offline", location: "—", hours: "16h", color: "from-indigo-300 to-violet-400" },
  "riley-morgan": { name: "Riley Morgan", role: "UX researcher", type: "Employee", email: "riley.morgan@northstar.example", initials: "RM", status: "Working", location: "Work studio", hours: "26h", color: "from-pink-300 to-rose-400" },
  "jamie-patel": { name: "Jamie Patel", role: "Illustrator", type: "Freelancer", email: "jamie.patel@northstar.example", initials: "JP", status: "Offline", location: "—", hours: "12.5h", color: "from-orange-300 to-amber-400" },
};

export default async function TeamMemberPage({ params }: { params: Promise<{ memberId: string }> }) {
  const { memberId } = await params;
  const member = Object.entries(members).find(([id]) => id === memberId)?.[1];

  if (!member) notFound();

  return (
    <OwnerWorkspaceShell activeHref="/team" title="Team member" description="Review this person's role, activity, and recent work sessions.">
      <Link href="/team" className="mb-5 inline-flex items-center gap-2 text-xs font-medium text-zinc-400 transition-colors hover:text-white">
        <span aria-hidden="true">←</span> Back to team
      </Link>
      <section className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className={`flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${member.color} text-xl font-semibold text-slate-950`}>{member.initials}</div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-semibold tracking-tight">{member.name}</h3>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] text-zinc-300">{member.type}</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300"><span className="size-1.5 rounded-full bg-emerald-300" />{member.status}</span>
            </div>
            <p className="mt-1 text-sm text-zinc-400">{member.role}</p>
            <p className="mt-2 text-xs text-zinc-500">{member.email}</p>
          </div>
          <Link href="/office" className="inline-flex h-10 items-center justify-center rounded-xl border border-white/[0.09] px-4 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/[0.05]">View in office</Link>
        </div>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-3">
        {[{ label: "Hours this week", value: member.hours }, { label: "Current location", value: member.location }, { label: "Account type", value: member.type }].map((item) => (
          <article key={item.label} className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5">
            <p className="text-xs text-zinc-500">{item.label}</p>
            <p className="mt-3 text-base font-semibold text-zinc-100">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-5 rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div><h3 className="text-sm font-semibold">Recent work sessions</h3><p className="mt-1 text-xs text-zinc-500">A sample of this member’s latest activity.</p></div>
          <Link href="/time-tracking" className="text-xs font-medium text-sky-200 hover:text-white">View time tracking</Link>
        </div>
        <div className="mt-4 divide-y divide-white/[0.05]">
          {[["Today", "9:02 AM – 12:14 PM", "3h 12m"], ["Yesterday", "8:54 AM – 4:37 PM", "7h 43m"], ["Friday", "9:10 AM – 3:58 PM", "6h 48m"]].map(([day, span, duration]) => (
            <div key={day} className="flex items-center justify-between gap-3 py-3 text-xs">
              <span className="font-medium text-zinc-200">{day}<span className="ml-3 font-normal text-zinc-500">{span}</span></span>
              <span className="shrink-0 text-zinc-400">{duration}</span>
            </div>
          ))}
        </div>
      </section>
    </OwnerWorkspaceShell>
  );
}
