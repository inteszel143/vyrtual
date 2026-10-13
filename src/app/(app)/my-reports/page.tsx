import PersonalWorkspaceShell from "@/components/personal-workspace-shell";

const dayHours = [
  { day: "Mon", hours: "6.5h", height: "h-[68%]" },
  { day: "Tue", hours: "7.0h", height: "h-[74%]" },
  { day: "Wed", hours: "5.5h", height: "h-[58%]" },
  { day: "Thu", hours: "6.0h", height: "h-[63%]" },
  { day: "Fri", hours: "3.5h", height: "h-[37%]" },
  { day: "Sat", hours: "0h", height: "h-[4%]" },
  { day: "Sun", hours: "0h", height: "h-[4%]" },
];

export default function MyReportsPage() {
  return (
    <PersonalWorkspaceShell activeHref="/my-reports" title="My reports" description="A personal summary of your tracked time and work activity.">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[["Hours this week", "28.5h", "71% of weekly goal"], ["Hours this month", "112h", "Across 17 workdays"], ["Average per day", "6.6h", "This month"], ["Sessions", "48", "This month"]].map(([label, value, note]) => <article key={label} className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5"><p className="text-xs text-zinc-500">{label}</p><p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs text-zinc-500">{note}</p></article>)}
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]">
        <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h3 className="text-sm font-semibold">Hours by day</h3><p className="mt-1 text-xs text-zinc-500">Week of October 19–25 · Personal tracked time</p></div><span className="text-xs text-zinc-400">28.5h total</span></div>
          <div className="mt-7 flex h-52 items-end gap-2 border-b border-white/[0.06] px-1 sm:gap-4">
            {dayHours.map((item) => <div key={item.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[9px] text-zinc-500">{item.hours}</span><div className={`w-full max-w-12 rounded-t-md bg-gradient-to-t from-sky-400/40 to-sky-300 ${item.height}`} /><span className="mb-2 text-[10px] text-zinc-500">{item.day}</span></div>)}
          </div>
        </article>
        <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-6">
          <h3 className="text-sm font-semibold">Time by project</h3><p className="mt-1 text-xs text-zinc-500">This month</p>
          <div className="mt-5 space-y-5">{[["Brand design", "46h", "w-[42%]", "bg-sky-300"], ["Campaign launch", "38h", "w-[34%]", "bg-violet-300"], ["Website refresh", "28h", "w-[25%]", "bg-emerald-300"]].map(([project, hours, width, color]) => <div key={project}><div className="flex justify-between text-xs"><span className="text-zinc-300">{project}</span><span className="text-zinc-400">{hours}</span></div><div className="mt-2 h-1.5 rounded-full bg-white/[0.05]"><div className={`h-full rounded-full ${width} ${color}`} /></div></div>)}</div>
          <p className="mt-6 border-t border-white/[0.06] pt-4 text-[10px] leading-5 text-zinc-600">Personal report preview. This page does not include company-wide analytics or billing data.</p>
        </article>
      </section>
    </PersonalWorkspaceShell>
  );
}
