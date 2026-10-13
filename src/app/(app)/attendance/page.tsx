import OwnerWorkspaceShell from "@/components/owner-workspace-shell";

const attendance = [
  { initials: "AC", name: "Avery Chen", role: "Product designer", status: "On time", checkIn: "8:57 AM", hours: "6h 42m", tone: "text-emerald-300" },
  { initials: "JL", name: "Jordan Lee", role: "Frontend developer", status: "On time", checkIn: "9:04 AM", hours: "6h 35m", tone: "text-emerald-300" },
  { initials: "SR", name: "Sam Rivera", role: "Content writer · Freelancer", status: "Remote", checkIn: "9:30 AM", hours: "5h 58m", tone: "text-sky-300" },
  { initials: "MP", name: "Morgan Park", role: "Project lead", status: "On time", checkIn: "8:48 AM", hours: "6h 51m", tone: "text-emerald-300" },
  { initials: "TB", name: "Taylor Brooks", role: "Software engineer", status: "Late", checkIn: "10:12 AM", hours: "5h 27m", tone: "text-amber-300" },
  { initials: "CK", name: "Casey Kim", role: "Data analyst · Freelancer", status: "Not scheduled", checkIn: "—", hours: "—", tone: "text-zinc-500" },
];

export default function AttendancePage() {
  return (
    <OwnerWorkspaceShell activeHref="/attendance" title="Team attendance" description="Review today's check-ins, attendance status, and hours worked.">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Scheduled today", value: "14", note: "Employees and freelancers" },
          { label: "Checked in", value: "11", note: "79% of scheduled team" },
          { label: "Late arrivals", value: "1", note: "Average delay 12 minutes" },
          { label: "Absent", value: "2", note: "1 awaiting confirmation" },
        ].map((item) => (
          <article key={item.label} className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5">
            <p className="text-xs text-zinc-500">{item.label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight">{item.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{item.note}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111116]">
        <div className="flex flex-col justify-between gap-3 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-semibold">Today’s attendance</h3>
            <p className="mt-1 text-xs text-zinc-500">Monday, October 19 · Preview data</p>
          </div>
          <label className="flex items-center gap-2 text-xs text-zinc-500">
            <span>View</span>
            <select defaultValue="Everyone" className="h-9 rounded-lg border border-white/[0.08] bg-[#17171e] px-3 text-xs font-medium text-zinc-300 outline-none focus:border-sky-300/40">
              <option>Everyone</option><option>Employees</option><option>Freelancers</option>
            </select>
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-white/[0.02] text-[10px] uppercase tracking-[0.12em] text-zinc-500">
              <tr><th className="px-5 py-3 font-medium">Team member</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium">First check-in</th><th className="px-5 py-3 font-medium">Hours today</th><th className="px-5 py-3 font-medium">Schedule</th></tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {attendance.map((person) => (
                <tr key={person.name} className="text-xs">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-semibold text-zinc-300">{person.initials}</span>
                      <span><span className="block font-medium text-zinc-100">{person.name}</span><span className="mt-1 block text-[10px] text-zinc-500">{person.role}</span></span>
                    </div>
                  </td>
                  <td className={`px-5 py-4 font-medium ${person.tone}`}>{person.status}</td>
                  <td className="px-5 py-4 text-zinc-400">{person.checkIn}</td>
                  <td className="px-5 py-4 text-zinc-300">{person.hours}</td>
                  <td className="px-5 py-4 text-zinc-500">{person.status === "Not scheduled" ? "Day off" : "9:00 AM – 5:00 PM"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </OwnerWorkspaceShell>
  );
}
