"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import PersonalWorkspaceShell from "@/components/personal-workspace-shell";
import ConnectionStatus from "@/components/my-office/connection-status";
import OfficeHeader from "@/components/my-office/office-header";
import ParticipantList from "@/components/my-office/participant-list";
import VideoControls from "@/components/my-office/video-controls";
import VideoGrid from "@/components/my-office/video-grid";
import {
  getPersonalWorkSessionServerSnapshot,
  getPersonalWorkSessionSnapshot,
  subscribeToPersonalWorkSession,
  timeInToPersonalWorkSession,
  timeOutOfPersonalWorkSession,
} from "@/lib/personal-work-session";
import type { OfficeParticipant } from "@/components/my-office/types";

const baseParticipants: OfficeParticipant[] = [
  { id: "alex", name: "Alex Morgan", role: "Freelance product designer", initials: "AM", color: "bg-rose-300/15 text-rose-200", gradient: "from-rose-300 to-orange-300", state: "You", isLocal: true },
  { id: "morgan", name: "Morgan Park", role: "Project lead", initials: "MP", color: "bg-emerald-300/15 text-emerald-200", gradient: "from-emerald-400/30 to-slate-700", state: "In a focus session" },
  { id: "avery", name: "Avery Chen", role: "Product designer", initials: "AC", color: "bg-violet-300/15 text-violet-200", gradient: "from-violet-400/30 to-slate-700", state: "In the office" },
  { id: "jordan", name: "Jordan Lee", role: "Frontend developer", initials: "JL", color: "bg-sky-300/15 text-sky-200", gradient: "from-sky-400/30 to-slate-700", state: "In a meeting" },
];

export default function MyOfficePage() {
  const clockedInAt = useSyncExternalStore(
    subscribeToPersonalWorkSession,
    getPersonalWorkSessionSnapshot,
    getPersonalWorkSessionServerSnapshot,
  );
  const joined = clockedInAt > 0;
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [mediaError, setMediaError] = useState("");
  const [mediaPending, setMediaPending] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const updateStream = useCallback((stream: MediaStream | null) => {
    streamRef.current = stream;
    setLocalStream(stream);
  }, []);

  const releaseMedia = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    updateStream(null);
    setCameraEnabled(false);
    setMicrophoneEnabled(false);
  }, [updateStream]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  useEffect(() => {
    if (!joined) releaseMedia();
  }, [joined, releaseMedia]);

  const toggleMedia = async (kind: "audio" | "video") => {
    const enabled = kind === "video" ? cameraEnabled : microphoneEnabled;
    setMediaError("");

    if (enabled) {
      const stream = streamRef.current;
      stream?.getTracks().filter((track) => track.kind === kind).forEach((track) => {
        track.stop();
        stream.removeTrack(track);
      });
      updateStream(stream && stream.getTracks().length > 0 ? new MediaStream(stream.getTracks()) : null);
      if (kind === "video") setCameraEnabled(false);
      else setMicrophoneEnabled(false);
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setMediaError("This browser does not support camera and microphone access. Try a modern browser over HTTPS.");
      return;
    }

    setMediaPending(true);
    try {
      const acquiredStream = await navigator.mediaDevices.getUserMedia({
        audio: kind === "audio",
        video: kind === "video" ? { facingMode: "user" } : false,
      });
      const existingStream = streamRef.current;
      const tracks = [...(existingStream?.getTracks() ?? []), ...acquiredStream.getTracks()];
      updateStream(new MediaStream(tracks));
      if (kind === "video") setCameraEnabled(true);
      else setMicrophoneEnabled(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "The browser could not start the requested device.";
      setMediaError(`Could not turn on your ${kind === "video" ? "camera" : "microphone"}: ${message}`);
    } finally {
      setMediaPending(false);
    }
  };

  const leaveOffice = () => {
    setMediaError("");
    try {
      timeOutOfPersonalWorkSession();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Browser storage is unavailable.";
      setMediaError(`Could not time out: ${message}`);
    }
  };

  const rejoinOffice = () => {
    try {
      timeInToPersonalWorkSession();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Browser storage is unavailable.";
      setMediaError(`Could not time in: ${message}`);
    }
  };

  return (
    <PersonalWorkspaceShell activeHref="/my-office" title="My office" description="Join your team’s virtual office and manage your local camera and microphone.">
      <div className="space-y-5">
        <OfficeHeader
          roomName="Work studio"
          onlineCount={baseParticipants.filter((person) => !person.isLocal || joined).length}
          connection={joined ? "connected" : "disconnected"}
        />

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-4">
            <VideoGrid
              participants={baseParticipants}
              localStream={localStream}
              cameraEnabled={cameraEnabled}
              microphoneEnabled={microphoneEnabled}
              joined={joined}
            />
            {mediaError && <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/[0.06] px-4 py-3 text-xs leading-5 text-rose-200">{mediaError}</p>}
            <VideoControls
              cameraEnabled={cameraEnabled}
              microphoneEnabled={microphoneEnabled}
              joined={joined}
              disabled={mediaPending}
              onToggleCamera={() => void toggleMedia("video")}
              onToggleMicrophone={() => void toggleMedia("audio")}
              onLeave={leaveOffice}
              onJoin={rejoinOffice}
            />
            <p className="px-1 text-[10px] leading-5 text-zinc-600">Time in/out controls your office presence. Camera and microphone controls access only this device’s local preview; video is not broadcast to other participants.</p>
          </div>

          <aside className="space-y-4">
            <ConnectionStatus state={connection} />
            <ParticipantList participants={baseParticipants} joined={joined} />
          </aside>
        </div>
      </div>
    </PersonalWorkspaceShell>
  );
}
