import type { ReactNode } from "react";

function ControlIcon({ name }: { name: "camera" | "microphone" | "leave" | "join" }) {
  const paths: Record<typeof name, ReactNode> = {
    camera: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></>,
    microphone: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8" /></>,
    leave: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></>,
    join: <><path d="M14 17l5-5-5-5M19 12H7" /><path d="M12 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" /></>,
  };

  return <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default function VideoControls({
  cameraEnabled,
  microphoneEnabled,
  joined,
  disabled,
  onToggleCamera,
  onToggleMicrophone,
  onLeave,
  onJoin,
}: {
  cameraEnabled: boolean;
  microphoneEnabled: boolean;
  joined: boolean;
  disabled: boolean;
  onToggleCamera: () => void;
  onToggleMicrophone: () => void;
  onLeave: () => void;
  onJoin: () => void;
}) {
  return (
    <section aria-label="Office controls" className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/[0.07] bg-[#111116] p-4">
      {joined ? (
        <>
          <button type="button" disabled={disabled} aria-pressed={cameraEnabled} onClick={onToggleCamera} className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${cameraEnabled ? "border-white/[0.1] bg-white/[0.04] text-zinc-200 hover:bg-white/[0.08]" : "border-rose-300/20 bg-rose-300/[0.08] text-rose-200 hover:bg-rose-300/[0.14]"}`}>
            <ControlIcon name="camera" />{cameraEnabled ? "Turn camera off" : "Turn camera on"}
          </button>
          <button type="button" disabled={disabled} aria-pressed={microphoneEnabled} onClick={onToggleMicrophone} className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${microphoneEnabled ? "border-white/[0.1] bg-white/[0.04] text-zinc-200 hover:bg-white/[0.08]" : "border-rose-300/20 bg-rose-300/[0.08] text-rose-200 hover:bg-rose-300/[0.14]"}`}>
            <ControlIcon name="microphone" />{microphoneEnabled ? "Mute microphone" : "Unmute microphone"}
          </button>
          <button type="button" disabled={disabled} onClick={onLeave} className="inline-flex h-10 items-center gap-2 rounded-xl bg-rose-500 px-3 text-xs font-semibold text-white transition-colors hover:bg-rose-400">
            <ControlIcon name="leave" />Time out &amp; leave
          </button>
        </>
      ) : (
        <button type="button" disabled={disabled} onClick={onJoin} className="inline-flex h-10 items-center gap-2 rounded-xl bg-sky-300 px-4 text-xs font-semibold text-slate-950 transition-colors hover:bg-sky-200">
          <ControlIcon name="join" />Time in &amp; join office
        </button>
      )}
    </section>
  );
}
