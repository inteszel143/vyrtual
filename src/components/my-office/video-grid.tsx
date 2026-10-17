"use client";

import { useEffect, useRef } from "react";
import type { OfficeParticipant } from "./types";
import AvatarImage from "@/components/avatar-image";
import ProfileAvatar from "@/components/profile-avatar";
import Link from "next/link";

function VideoTile({
  participant,
  localStream,
  cameraEnabled,
  microphoneEnabled,
  messageHrefBase,
}: {
  participant: OfficeParticipant;
  localStream?: MediaStream | null;
  cameraEnabled?: boolean;
  microphoneEnabled?: boolean;
  messageHrefBase: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isLocal = participant.isLocal === true;
  const presenceEmoji = {
    Working: "💻",
    Offline: "⚫",
    Away: "🌙",
    Break: "☕",
    "Meal Break": "🍽️",
    Meeting: "👥",
    Snoozed: "😴",
    "Do not disturb": "🔕",
  }[participant.presence];

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
          {isLocal ? (
            <ProfileAvatar initials={participant.initials} className="size-16 border-white/20 bg-black/20 text-lg text-white shadow-xl" />
          ) : (
            <span className="relative flex size-16 overflow-hidden items-center justify-center rounded-full border border-white/20 bg-black/20 text-lg font-semibold text-white shadow-xl">
              <AvatarImage src={participant.avatarUrl ?? ""} initials={participant.initials} />
            </span>
          )}
        </div>
      )}
      {isLocal && !cameraEnabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#17171e]/80">
          <ProfileAvatar initials={participant.initials} className={`size-16 border-transparent bg-gradient-to-br ${participant.gradient} text-lg text-white`} />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-3 pb-3 pt-8">
        <span className="flex min-w-0 items-center gap-1.5 truncate text-xs font-medium text-white">
          {participant.presence === "Working" ? (
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" />
          ) : (
            <span aria-hidden="true">{presenceEmoji}</span>
          )}
          <span className="truncate">{participant.name}{isLocal ? " (You)" : ""}</span>
        </span>
        <span className={`shrink-0 rounded-md px-2 py-1 text-[9px] ${isLocal && !microphoneEnabled ? "bg-rose-400/20 text-rose-100" : "bg-black/35 text-zinc-200"}`}>
          {isLocal ? (microphoneEnabled ? "Mic on" : "Muted") : participant.state}
        </span>
      </div>
      {!isLocal && (
        <div className="absolute right-3 top-3 flex items-center gap-2">
          <span className="rounded-md border border-white/[0.08] bg-black/35 px-2 py-1 text-[9px] text-zinc-300">{participant.live ? "Profile · no live video" : "Sample tile"}</span>
          <Link
            href={`${messageHrefBase}?to=${encodeURIComponent(participant.id)}`}
            aria-label={`Message ${participant.name}`}
            title={`Message ${participant.name}`}
            className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-black/40 text-white transition-colors hover:border-sky-300/40 hover:bg-sky-300/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
            </svg>
          </Link>
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
  messageHrefBase,
}: {
  participants: OfficeParticipant[];
  localStream: MediaStream | null;
  cameraEnabled: boolean;
  microphoneEnabled: boolean;
  joined: boolean;
  messageHrefBase: string;
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
            messageHrefBase={messageHrefBase}
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
