import OwnerWorkspaceShell from "@/components/owner-workspace-shell";

const days = [
  { day: "Monday", date: "Oct 19", shifts: [{ name: "Avery Chen", role: "Design", time: "9:00 AM – 5:00 PM", color: "border-violet-300/30 bg-violet-300/[0.08]" }, { name: "Jordan Lee", role: "Engineering", time: "10:00 AM – 6:00 PM", color: "border-sky-300/30 bg-sky-300/[0.08]" }, { name: "Sam Rivera", role: "Content", time: "12:00 PM – 4:00 PM", color: "border-rose-300/30 bg-rose-300/[0.08]" }] },
  { day: "Tuesday", date: "Oct 20", shifts: [{ name: "Morgan Park", role: "Project lead", time: "9:00 AM – 5:00 PM", color: "border-emerald-300/30 bg-emerald-300/[0.08]" }, { name: "Taylor Brooks", role: "Engineering", time: "9:30 AM – 5:30 PM", color: "border-amber-300/30 bg-amber-300/[0.08]" }] },
  { day: "Wednesday", date: "Oct 21", shifts: [{ name: "Avery Chen", role: "Design", time: "9:00 AM – 5:00 PM", color: "border-violet-300/30 bg-violet-300/[0.08]" }, { name: "Casey Kim", role: "Analytics", time: "1:00 PM – 5:00 PM", color: "border-indigo-300/30 bg-indigo-300/[0.08]" }] },
  { day: "Thursday", date: "Oct 22", shifts: [{ name: "Jordan Lee", role: "Engineering", time: "10:00 AM – 6:00 PM", color: "border-sky-300/30 bg-sky-300/[0.08]" }, { name: "Riley Morgan", role: "Research", time: "9:00 AM – 3:00 PM", color: "border-pink-300/30 bg-pink-300/[0.08]" }] },
  { day: "Friday", date: "Oct 23", shifts: [{ name: "Morgan Park", role: "Project lead", time: "9:00 AM – 5:00 PM", color: "border-emerald-300/30 bg-emerald-300/[0.08]" }, { name: "Jamie Patel", role: "Illustration", time: "11:00 AM – 3:00 PM", color: "border-orange-300/30 bg-orange-300/[0.08]" }] },
];

export default function SchedulesPage() {
  return (
    <OwnerWorkspaceShell activeHref="/schedules" title="Team schedules" description="Plan coverage and see who's scheduled across the team.">
      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Scheduled this week", value: "34 shifts", note: "Across 18 team members" },
          { label: "Hours planned", value: "612h", note: "24h more than last week" },
          { label: "Coverage", value: "96%", note: "2 shifts need confirmation" },
        ].map((item) => (
          <article key={item.label} className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5">
            <p className="text-xs text-zinc-500">{item.label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight">{item.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{item.note}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-white/[0.07] bg-[#111116]">
        <div className="flex flex-col justify-between gap-3 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-semibold">Week of October 19–23</h3>
            <p className="mt-1 text-xs text-zinc-500">Example schedule · times shown in your workspace timezone</p>
          </div>
          <div className="flex gap-2">
            <button type="button" className="rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-zinc-300 transition-colors hover:bg-white/[0.05]">Previous week</button>
            <button type="button" className="rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-zinc-300 transition-colors hover:bg-white/[0.05]">Next week</button>
          </div>
        </div>
        <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-5">
          {days.map((day) => (
            <article key={day.day} className="min-h-52 rounded-xl border border-white/[0.06] bg-[#0d0d12] p-3">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-xs font-semibold">{day.day}</h4>
                <span className="text-[10px] text-zinc-500">{day.date}</span>
              </div>
              <div className="space-y-2">
                {day.shifts.map((shift) => (
                  <div key={`${day.day}-${shift.name}`} className={`rounded-lg border p-2.5 ${shift.color}`}>
                    <p className="text-xs font-medium text-zinc-100">{shift.name}</p>
                    <p className="mt-1 text-[10px] text-zinc-400">{shift.role}</p>
                    <p className="mt-2 text-[10px] text-zinc-300">{shift.time}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </OwnerWorkspaceShell>
  );
}
