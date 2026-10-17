"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import PersonalWorkspaceShell from "@/components/personal-workspace-shell";
import {
  getPersonalWorkLogsServerSnapshot,
  getPersonalWorkLogsSnapshot,
  getPersonalWorkSessionServerSnapshot,
  getPersonalWorkSessionSnapshot,
  subscribeToPersonalWorkSession,
  type PersonalWorkLog,
} from "@/lib/personal-work-session";

function getStartOfDay(timestamp: number) {
  const date = new Date(timestamp);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function shiftDay(timestamp: number, days: number) {
  const date = new Date(timestamp);
  date.setDate(date.getDate() + days);
  return getStartOfDay(date.getTime());
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDuration(milliseconds: number) {
  const totalMinutes = Math.max(0, Math.floor(milliseconds / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function formatDayLabel(timestamp: number, todayStart: number) {
  const startOfDay = getStartOfDay(timestamp);
  if (startOfDay === todayStart) return "Today";
  if (startOfDay === todayStart - 86_400_000) return "Yesterday";
  return new Date(timestamp).toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export default function MyTimePage() {
  const activeStartedAt = useSyncExternalStore(
    subscribeToPersonalWorkSession,
    getPersonalWorkSessionSnapshot,
    getPersonalWorkSessionServerSnapshot,
  );
  const logsSnapshot = useSyncExternalStore(
    subscribeToPersonalWorkSession,
    getPersonalWorkLogsSnapshot,
    getPersonalWorkLogsServerSnapshot,
  );
  const logs = JSON.parse(logsSnapshot) as PersonalWorkLog[];
  const [now, setNow] = useState(0);
  useEffect(() => {
    const initialize = window.setTimeout(() => setNow(Date.now()), 0);
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearTimeout(initialize);
      window.clearInterval(timer);
    };
  }, []);
  const todayStart = getStartOfDay(now);
  const days = Array.from({ length: 7 }, (_, index) => {
    const dayStart = shiftDay(todayStart, -index);
    const dayEnd = shiftDay(dayStart, 1);
    const sessions: { id: string; startedAt: number; endedAt: number; active: boolean }[] = logs
      .filter((log) => log.startedAt < dayEnd && log.endedAt > dayStart)
      .map((log) => ({
        id: log.id,
        startedAt: Math.max(log.startedAt, dayStart),
        endedAt: Math.min(log.endedAt, dayEnd),
        active: false,
      }));

    if (activeStartedAt > 0 && activeStartedAt < dayEnd && now > dayStart) {
      sessions.push({
        id: `active-${activeStartedAt}`,
        startedAt: Math.max(activeStartedAt, dayStart),
        endedAt: Math.min(now, dayEnd),
        active: true,
      });
    }

    sessions.sort((left, right) => left.startedAt - right.startedAt);
    const totalMilliseconds = sessions.reduce(
      (total, session) => total + session.endedAt - session.startedAt,
      0,
    );

    return { dayStart, sessions, totalMilliseconds };
  });
  const today = days[0];
  const weeklyMilliseconds = days.reduce(
    (total, day) => total + day.totalMilliseconds,
    0,
  );

  return (
    <PersonalWorkspaceShell
      activeHref="/my-time"
      title="Time logs"
      description="Review your daily time in and time out records and track your hours."
    >
      <section className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5">
          <p className="text-xs text-zinc-500">Today</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">{formatDuration(today.totalMilliseconds)}</p>
          <p className="mt-1 text-xs text-zinc-500">{today.sessions.length} {today.sessions.length === 1 ? "session" : "sessions"}</p>
        </article>
        <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5">
          <p className="text-xs text-zinc-500">Last 7 days</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">{formatDuration(weeklyMilliseconds)}</p>
          <p className="mt-1 text-xs text-zinc-500">Your total recorded time</p>
        </article>
        <article className="rounded-2xl border border-white/[0.07] bg-[#111116] p-5">
          <p className="text-xs text-zinc-500">Clock status</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">{activeStartedAt > 0 ? "Timed in" : "Timed out"}</p>
          <p className="mt-1 text-xs text-zinc-500">{activeStartedAt > 0 ? `Since ${formatTime(activeStartedAt)}` : "Use the navbar button to start a session"}</p>
        </article>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111116]">
        <div className="border-b border-white/[0.06] p-5 sm:px-6">
          <h3 className="text-sm font-semibold">Daily time logs</h3>
          <p className="mt-1 text-xs text-zinc-500">Time in/out entries for the last 7 days, shown in your local timezone.</p>
        </div>
        <div className="divide-y divide-white/[0.05] px-5 sm:px-6">
          {days.map((day) => (
            <article key={day.dayStart} className="py-5 first:pt-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="text-xs font-semibold text-zinc-200">{formatDayLabel(day.dayStart, todayStart)}</h4>
                <span className="text-xs font-medium text-zinc-300">{formatDuration(day.totalMilliseconds)}</span>
              </div>
              {day.sessions.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {day.sessions.map((session) => (
                    <div key={session.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl border border-white/[0.05] bg-[#0d0d12] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className={`size-2 rounded-full ${session.active ? "animate-pulse bg-emerald-300" : "bg-zinc-500"}`} />
                        <span className="text-xs text-zinc-300">{formatTime(session.startedAt)} <span className="px-1 text-zinc-600">to</span> {session.active ? "In progress" : formatTime(session.endedAt)}</span>
                      </div>
                      <span className="text-xs text-zinc-400">{formatDuration(session.endedAt - session.startedAt)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs text-zinc-600">No time logs for this day.</p>
              )}
            </article>
          ))}
        </div>
      </section>
      <p className="mt-4 text-[10px] leading-5 text-zinc-600">Logs are saved in this browser preview only. Time out in the navbar to close the current entry.</p>
    </PersonalWorkspaceShell>
  );
}
