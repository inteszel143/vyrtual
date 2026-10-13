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
import { useToast } from "@/components/toast-provider";
import { officePreviewParticipants } from "@/lib/office-preview";
import Link from "next/link";

export default function MyOfficePage() {
  const { notify } = useToast();
  const clockedInAt = useSyncExternalStore(
    subscribeToPersonalWorkSession,
    getPersonalWorkSessionSnapshot,
    getPersonalWorkSessionServerSnapshot,
  );
  const joined = clockedInAt > 0;
  const participants: OfficeParticipant[] = officePreviewParticipants;
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

  useEffect(
    () => subscribeToPersonalWorkSession(() => {
      if (getPersonalWorkSessionSnapshot() === 0) releaseMedia();
    }),
    [releaseMedia],
  );

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
      notify({ kind: "info", title: kind === "video" ? "Camera turned off" : "Microphone muted" });
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      const message = "This browser does not support camera and microphone access. Try a modern browser over HTTPS.";
      setMediaError(message);
      notify({ kind: "error", title: "Media device unavailable", message });
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
      notify({ kind: "success", title: kind === "video" ? "Camera turned on" : "Microphone enabled", message: "This device is available for your local preview." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "The browser could not start the requested device.";
      setMediaError(`Could not turn on your ${kind === "video" ? "camera" : "microphone"}: ${message}`);
      notify({ kind: "error", title: `Could not enable ${kind === "video" ? "camera" : "microphone"}`, message });
    } finally {
      setMediaPending(false);
    }
  };

  const leaveOffice = () => {
    setMediaError("");
    try {
      timeOutOfPersonalWorkSession();
      notify({ kind: "info", title: "Office left", message: "You’ve timed out and are no longer listed in the office." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Browser storage is unavailable.";
      setMediaError(`Could not time out: ${message}`);
      notify({ kind: "error", title: "Could not leave office", message });
    }
  };

  const rejoinOffice = () => {
    try {
      timeInToPersonalWorkSession();
      notify({ kind: "success", title: "Welcome back", message: "You’ve timed in and rejoined the office." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Browser storage is unavailable.";
      setMediaError(`Could not time in: ${message}`);
      notify({ kind: "error", title: "Could not join office", message });
    }
  };

  return (
    <PersonalWorkspaceShell activeHref="/my-office" title="My office" description="Join the same Work studio shown in your company’s virtual office.">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-300/10 bg-sky-300/[0.04] px-4 py-3">
          <p className="text-xs leading-5 text-zinc-300">Preview roster matches the company office. Presence, coworker media, and invitations are sample data, not live synced.</p>
          <Link href="/office" className="shrink-0 text-xs font-medium text-sky-200 transition-colors hover:text-sky-100">View company office →</Link>
        </div>
        <OfficeHeader
          roomName="Work studio"
          onlineCount={participants.filter((person) => !person.isLocal || joined).length}
          connection={joined ? "connected" : "disconnected"}
        />

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-4">
            <VideoGrid
              participants={participants}
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
            <p className="px-1 text-[10px] leading-5 text-zinc-600">Time in/out updates your office presence in this browser. Camera and microphone controls access only this device’s local preview; video is not broadcast to other participants.</p>
          </div>

          <aside className="space-y-4">
            <ConnectionStatus state={joined ? "connected" : "disconnected"} />
            <ParticipantList participants={participants} joined={joined} />
          </aside>
        </div>
      </div>
    </PersonalWorkspaceShell>
  );
}
