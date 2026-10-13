import PersonalWorkspaceShell from "@/components/personal-workspace-shell";

const week = [
  { day: "Monday", date: "Oct 19", title: "Brand design refinements", time: "9:00 AM – 5:00 PM", kind: "Scheduled work", color: "border-sky-300/25 bg-sky-300/[0.06]" },
  { day: "Tuesday", date: "Oct 20", title: "Design sprint", time: "9:00 AM – 5:00 PM", kind: "Scheduled work", color: "border-violet-300/25 bg-violet-300/[0.06]" },
  { day: "Wednesday", date: "Oct 21", title: "Team check-in", time: "10:00 AM – 10:30 AM", kind: "Meeting", color: "border-emerald-300/25 bg-emerald-300/[0.06]" },
  { day: "Wednesday", date: "Oct 21", title: "Landing page review", time: "1:00 PM – 2:00 PM", kind: "Meeting", color: "border-emerald-300/25 bg-emerald-300/[0.06]" },
  { day: "Thursday", date: "Oct 22", title: "Design sprint", time: "9:00 AM – 5:00 PM", kind: "Scheduled work", color: "border-violet-300/25 bg-violet-300/[0.06]" },
  { day: "Friday", date: "Oct 23", title: "Flexible workday", time: "10:00 AM – 4:00 PM", kind: "Scheduled work", color: "border-sky-300/25 bg-sky-300/[0.06]" },
];

export default function MySchedulePage() {
  return (
    <PersonalWorkspaceShell activeHref="/my-schedule" title="My schedule" description="Your upcoming work hours, meetings, and time off.">
      <section className="grid gap-3 sm:grid-cols-3">
        {[["Scheduled hours", "38h", "Across 5 workdays"], ["Meetings", "2", "3h 30m total"], ["Next workday", "Tomorrow", "9:00 AM start"]].map(([label, value, detail]) => <article key={label} className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5"><p className="text-xs text-zinc-500">{label}</p><p className="mt-3 text-2xl font-semibold">{value}</p><p className="mt-1 text-xs text-zinc-500">{detail}</p></article>)}
      </section>
      <section className="mt-6 rounded-2xl border border-white/[0.07] bg-[#111116]">
        <div className="flex flex-col justify-between gap-3 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center"><div><h3 className="text-sm font-semibold">Week of October 19–23</h3><p className="mt-1 text-xs text-zinc-500">Your personal schedule · times in workspace timezone</p></div><span className="w-fit rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[10px] text-zinc-400">This week</span></div>
        <div className="divide-y divide-white/[0.05] px-5">
          {week.map((item, index) => <article key={`${item.day}-${item.title}-${index}`} className="flex gap-4 py-4 sm:gap-6"><div className="w-16 shrink-0 pt-1"><p className="text-xs font-medium text-zinc-200">{item.day.slice(0, 3)}</p><p className="mt-1 text-[10px] text-zinc-500">{item.date}</p></div><div className={`flex-1 rounded-xl border p-3 sm:flex sm:items-center sm:justify-between sm:px-4 ${item.color}`}><div><span className="text-[9px] uppercase tracking-[0.12em] text-zinc-400">{item.kind}</span><p className="mt-1 text-xs font-medium text-zinc-100">{item.title}</p></div><p className="mt-2 text-[10px] text-zinc-300 sm:mt-0">{item.time}</p></div></article>)}
        </div>
      </section>
      <p className="mt-4 text-[10px] text-zinc-600">Preview schedule only · Contact your workspace owner to request a schedule change.</p>
    </PersonalWorkspaceShell>
  );
}
