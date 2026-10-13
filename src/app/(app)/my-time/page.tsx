"use client";

import { useEffect, useState } from "react";
import PersonalWorkspaceShell from "@/components/personal-workspace-shell";

const initialEntries = [
  { project: "Brand design refinements", date: "Today", started: "9:00 AM", duration: "3h 20m" },
  { project: "Campaign landing page", date: "Yesterday", started: "9:15 AM", duration: "6h 45m" },
  { project: "Client review & revisions", date: "Friday", started: "10:00 AM", duration: "5h 30m" },
];

function formatElapsed(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export default function MyTimePage() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  return (
    <PersonalWorkspaceShell activeHref="/my-time" title="My time" description="Track your work sessions and keep an eye on your weekly hours.">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div><p className="text-xs text-zinc-500">Current session</p><h3 className="mt-2 text-lg font-semibold">{running ? "Timer is running" : "Ready when you are"}</h3><p className="mt-1 text-xs text-zinc-500">{running ? "Brand design refinements · Northstar Studio" : "Start a timer when you begin working."}</p></div>
              <p aria-live="off" className="font-mono text-3xl font-medium tabular-nums tracking-tight text-sky-200">{formatElapsed(elapsed)}</p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => setRunning((value) => !value)} className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-semibold transition-colors ${running ? "border border-rose-300/20 bg-rose-300/[0.08] text-rose-200 hover:bg-rose-300/[0.14]" : "bg-sky-300 text-slate-950 hover:bg-sky-200"}`}>
                <span aria-hidden="true">{running ? "■" : "▶"}</span>{running ? "Pause timer" : elapsed ? "Resume timer" : "Start timer"}
              </button>
              {elapsed > 0 && <button type="button" onClick={() => { setRunning(false); setElapsed(0); }} className="h-10 rounded-xl border border-white/[0.08] px-4 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.05]">Reset</button>}
              <span className="text-[10px] text-zinc-600">Timer preview only · Not saved</span>
            </div>
          </article>
          <article className="mt-5 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111116]">
            <div className="border-b border-white/[0.06] p-5"><h3 className="text-sm font-semibold">Recent sessions</h3><p className="mt-1 text-xs text-zinc-500">Your personal time entries</p></div>
            <div className="divide-y divide-white/[0.05] px-5">
              {initialEntries.map((entry) => <div key={entry.project} className="flex items-center justify-between gap-4 py-4"><div><p className="text-xs font-medium text-zinc-200">{entry.project}</p><p className="mt-1 text-[10px] text-zinc-500">{entry.date} · Started {entry.started}</p></div><span className="shrink-0 text-xs text-zinc-300">{entry.duration}</span></div>)}
            </div>
          </article>
        </div>
        <aside className="h-fit rounded-2xl border border-white/[0.07] bg-[#111116] p-5">
          <h3 className="text-sm font-semibold">This week</h3><p className="mt-1 text-xs text-zinc-500">October 19 – 25</p>
          <div className="mt-5 flex items-end justify-between"><span className="text-3xl font-semibold">28.5<span className="ml-1 text-sm font-normal text-zinc-500">h</span></span><span className="text-xs text-zinc-500">of 40h goal</span></div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full w-[71%] rounded-full bg-sky-300" /></div>
          <div className="mt-5 space-y-3">{[["Mon", "6.5h", 81], ["Tue", "7.0h", 88], ["Wed", "5.5h", 69], ["Thu", "6.0h", 75], ["Fri", "3.5h", 44]].map(([day, hours, width]) => <div key={day as string} className="flex items-center gap-3 text-[10px]"><span className="w-7 text-zinc-500">{day}</span><div className="h-1.5 flex-1 rounded-full bg-white/[0.05]"><div className="h-full rounded-full bg-sky-300/70" style={{ width: `${width}%` }} /></div><span className="w-8 text-right text-zinc-400">{hours}</span></div>)}</div>
        </aside>
      </section>
    </PersonalWorkspaceShell>
  );
}
