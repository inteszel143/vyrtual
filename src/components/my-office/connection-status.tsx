import type { ConnectionState } from "./types";

export default function ConnectionStatus({ state }: { state: ConnectionState }) {
  const styles = {
    connected: "border-emerald-300/15 bg-emerald-300/[0.04] text-emerald-100",
    reconnecting: "border-amber-300/15 bg-amber-300/[0.04] text-amber-100",
    disconnected: "border-white/[0.08] bg-white/[0.025] text-zinc-300",
  } satisfies Record<ConnectionState, string>;
  const label = {
    connected: "Connected to office preview",
    reconnecting: "Reconnecting to office…",
    disconnected: "Disconnected from office",
  } satisfies Record<ConnectionState, string>;
  const detail = {
    connected: "Your office presence is active. Coworker video and audio are sample content.",
    reconnecting: "Your office presence is temporarily interrupted.",
    disconnected: "Your camera and microphone are off while you’re away.",
  } satisfies Record<ConnectionState, string>;

  return (
    <section role="status" aria-live="polite" className={`flex items-start gap-3 rounded-xl border p-3 ${styles[state]}`}>
      <span className={`mt-1 size-2 shrink-0 rounded-full ${state === "connected" ? "bg-emerald-300" : state === "reconnecting" ? "animate-pulse bg-amber-300" : "bg-zinc-500"}`} />
      <span>
        <span className="block text-xs font-medium">{label[state]}</span>
        <span className="mt-1 block text-[10px] text-zinc-400">{detail[state]}</span>
      </span>
    </section>
  );
}
