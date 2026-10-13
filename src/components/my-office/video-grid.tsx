"use client";

import { useEffect, useRef } from "react";
import type { OfficeParticipant } from "./types";

function VideoTile({
  participant,
  localStream,
  cameraEnabled,
  microphoneEnabled,
}: {
  participant: OfficeParticipant;
  localStream?: MediaStream | null;
  cameraEnabled?: boolean;
  microphoneEnabled?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isLocal = participant.isLocal === true;

  useEffect(() => {
    const video = videoRef.current;
    if (video && localStream) video.srcObject = localStream;
    if (video && !localStream) video.srcObject = null;
  }, [localStream]);

  return (
    <article className="relative aspect-video min-h-40 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#15151c]">
      {isLocal && cameraEnabled && localStream ? (
        <video ref={videoRef} autoPlay muted playsInline aria-label="Your local camera preview" className="absolute inset-0 size-full object-cover" />
      ) : (
        <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${participant.gradient} opacity-80`}>
          <span className="flex size-16 items-center justify-center rounded-full border border-white/20 bg-black/20 text-lg font-semibold text-white shadow-xl">
            {participant.initials}
          </span>
        </div>
      )}
      {isLocal && !cameraEnabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#17171e]/80">
          <span className={`flex size-16 items-center justify-center rounded-full bg-gradient-to-br ${participant.gradient} text-lg font-semibold text-white`}>
            {participant.initials}
          </span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-3 pb-3 pt-8">
        <span className="min-w-0 truncate text-xs font-medium text-white">{participant.name}{isLocal ? " (You)" : ""}</span>
        <span className={`shrink-0 rounded-md px-2 py-1 text-[9px] ${isLocal && !microphoneEnabled ? "bg-rose-400/20 text-rose-100" : "bg-black/35 text-zinc-200"}`}>
          {isLocal ? (microphoneEnabled ? "Mic on" : "Muted") : participant.state}
        </span>
      </div>
      {!isLocal && (
        <div className="absolute right-3 top-3 rounded-md border border-white/[0.08] bg-black/35 px-2 py-1 text-[9px] text-zinc-300">
          Sample tile
        </div>
      )}
    </article>
  );
}

export default function VideoGrid({
  participants,
  localStream,
  cameraEnabled,
  microphoneEnabled,
  joined,
}: {
  participants: OfficeParticipant[];
  localStream: MediaStream | null;
  cameraEnabled: boolean;
  microphoneEnabled: boolean;
  joined: boolean;
}) {
  return (
    <section aria-label="Office video grid" className="grid gap-3 sm:grid-cols-2">
      {participants.map((participant) => {
        if (participant.isLocal && !joined) return null;
        return (
          <VideoTile
            key={participant.id}
            participant={participant}
            localStream={participant.isLocal ? localStream : null}
            cameraEnabled={participant.isLocal ? cameraEnabled : undefined}
            microphoneEnabled={participant.isLocal ? microphoneEnabled : undefined}
          />
        );
      })}
      {!joined && (
        <div className="col-span-full flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-[#111116] p-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-white/[0.05] text-xl text-zinc-400" aria-hidden="true">↗</span>
          <p className="mt-4 text-sm font-medium text-zinc-200">You’ve left the office</p>
          <p className="mt-1 text-xs text-zinc-500">Rejoin whenever you’re ready to work with the team.</p>
        </div>
      )}
    </section>
  );
}
