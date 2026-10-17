"use client";

import { useEffect, useSyncExternalStore, useState } from "react";
import { useToast } from "@/components/toast-provider";
import {
  getPersonalWorkStatusSnapshot,
  getPersonalWorkStatusServerSnapshot,
  getPersonalWorkBusySnapshot,
  getPersonalWorkBusyServerSnapshot,
  refreshPersonalWorkSession,
  getPersonalWorkSessionServerSnapshot,
  getPersonalWorkSessionSnapshot,
  subscribeToPersonalWorkSession,
  timeInToPersonalWorkSession,
  timeOutOfPersonalWorkSession,
} from "@/lib/personal-work-session";

function formatElapsed(startedAt: number, now: number) {
  const elapsedSeconds = Math.max(0, Math.floor((now - startedAt) / 1000));
  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function WorkClockControl() {
  const { notify } = useToast();
  const startedAt = useSyncExternalStore(
    subscribeToPersonalWorkSession,
    getPersonalWorkSessionSnapshot,
    getPersonalWorkSessionServerSnapshot,
  );
  const syncStatus = useSyncExternalStore(subscribeToPersonalWorkSession, getPersonalWorkStatusSnapshot, getPersonalWorkStatusServerSnapshot);
  const busy = useSyncExternalStore(subscribeToPersonalWorkSession, getPersonalWorkBusySnapshot, getPersonalWorkBusyServerSnapshot);
  const [now, setNow] = useState(0);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const clockedIn = startedAt > 0;

  const toggleClock = async () => {
    setStorageError("");
    try {
      if (clockedIn) await timeOutOfPersonalWorkSession();
      else await timeInToPersonalWorkSession();
      notify(clockedIn
        ? { kind: "info", title: "Timed out", message: "Your office presence has ended." }
        : { kind: "success", title: "Timed in", message: "You’re now listed in your virtual office." });
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Could not reach the time tracking service.";
      setStorageError(`Could not update your time clock: ${detail}`);
      notify({ kind: "error", title: "Time clock couldn’t be updated", message: detail });
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        {clockedIn && (
          <span aria-label={`Time elapsed ${formatElapsed(startedAt, now)}`} className="hidden font-mono text-[11px] tabular-nums text-emerald-200 sm:inline">
            {formatElapsed(startedAt, now)}
          </span>
        )}
        <button
          type="button"
          onClick={toggleClock}
          disabled={busy || !!syncStatus}
          aria-busy={busy}
          aria-pressed={clockedIn}
          className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-colors ${
            clockedIn
              ? "border-rose-300/20 bg-rose-300/[0.07] text-rose-200 hover:bg-rose-300/[0.13]"
              : "border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-200 hover:bg-emerald-300/[0.14]"
          }`}
        >
          <span className={`size-1.5 rounded-full ${clockedIn ? "bg-rose-300" : "bg-emerald-300"}`} />
          {busy ? "Saving…" : clockedIn ? "Time out" : "Time in"}
        </button>
      </div>
      {syncStatus && <span role="status" className="max-w-64 text-right text-[10px] text-zinc-400">{syncStatus} <button type="button" onClick={() => { void refreshPersonalWorkSession(); }} className="text-sky-200 underline">Refresh</button></span>}
      {storageError && <span role="alert" className="max-w-56 text-right text-[10px] leading-4 text-rose-300">{storageError}</span>}
    </div>
  );
}
