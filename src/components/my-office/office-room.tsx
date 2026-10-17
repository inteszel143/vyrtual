"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import ConnectionStatus from "@/components/my-office/connection-status";
import OfficeHeader from "@/components/my-office/office-header";
import ParticipantList from "@/components/my-office/participant-list";
import VideoControls from "@/components/my-office/video-controls";
import VideoGrid from "@/components/my-office/video-grid";
import type { OfficeParticipant } from "@/components/my-office/types";
import { useToast } from "@/components/toast-provider";
import {
  getPersonalWorkSessionServerSnapshot,
  getPersonalWorkSessionSnapshot,
  subscribeToPersonalWorkSession,
  timeInToPersonalWorkSession,
  timeOutOfPersonalWorkSession,
} from "@/lib/personal-work-session";
import {
  getPersonalOfficePresenceServerSnapshot,
  getPersonalOfficePresenceSnapshot,
  isPersonalOfficeStatus,
  personalOfficeStatuses,
  setPersonalOfficePresence,
  subscribeToPersonalOfficePresence,
} from "@/lib/office-presence";
import { officePreviewParticipants } from "@/lib/office-preview";

export default function OfficeRoom({ ownerView = false }: { ownerView?: boolean }) {
  const { notify } = useToast();
  const clockedInAt = useSyncExternalStore(
    subscribeToPersonalWorkSession,
    getPersonalWorkSessionSnapshot,
    getPersonalWorkSessionServerSnapshot,
  );
  const joined = clockedInAt > 0;
  const personalPresence = useSyncExternalStore(
    subscribeToPersonalOfficePresence,
    getPersonalOfficePresenceSnapshot,
    getPersonalOfficePresenceServerSnapshot,
  );
  const participants: OfficeParticipant[] = officePreviewParticipants
    .filter((person) => {
      if (person.isLocal) return ownerView || person.presence !== "Offline";
      return person.presence !== "Offline";
    })
    .map((person) => {
      if (ownerView) return { ...person, isLocal: false };
      if (!person.isLocal) return person;
      return { ...person, presence: personalPresence, state: personalPresence };
    });
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
      updateStream(new MediaStream([...(existingStream?.getTracks() ?? []), ...acquiredStream.getTracks()]));
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

  const leaveOffice = async () => {
    setMediaError("");
    try {
      await timeOutOfPersonalWorkSession();
      notify({ kind: "info", title: "Office left", message: "You’ve timed out and are no longer listed in the office." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Browser storage is unavailable.";
      setMediaError(`Could not time out: ${message}`);
      notify({ kind: "error", title: "Could not leave office", message });
    }
  };

  const rejoinOffice = async () => {
    try {
      await timeInToPersonalWorkSession();
      notify({ kind: "success", title: "Welcome back", message: "You’ve timed in and rejoined the office." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Browser storage is unavailable.";
      setMediaError(`Could not time in: ${message}`);
      notify({ kind: "error", title: "Could not join office", message });
    }
  };

  const onlineCount = participants.filter((person) => !person.isLocal || joined).length;

  return (
    <div className="space-y-5">
      <OfficeHeader
        roomName="Work studio"
        onlineCount={onlineCount}
        connection={ownerView || joined ? "connected" : "disconnected"}
      />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <VideoGrid
            participants={participants}
            localStream={localStream}
            cameraEnabled={cameraEnabled}
            microphoneEnabled={microphoneEnabled}
            joined={ownerView || joined}
            messageHrefBase={ownerView ? "/messages" : "/my-messages"}
          />
          {!ownerView && mediaError && <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/[0.06] px-4 py-3 text-xs leading-5 text-rose-200">{mediaError}</p>}
          {!ownerView && (
            <>
              <section aria-label="Your office status" className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#111116] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <label htmlFor="personal-office-status" className="text-xs font-medium text-white">Your status</label>
                  <p className="mt-1 text-[10px] leading-4 text-zinc-500">Choose what your teammates see in the office.</p>
                </div>
                <select
                  id="personal-office-status"
                  value={personalPresence}
                  onChange={(event) => {
                    const status = event.target.value;
                    if (!isPersonalOfficeStatus(status)) return;

                    try {
                      setPersonalOfficePresence(status);
                    } catch (error) {
                      const message = error instanceof Error ? error.message : "Browser storage is unavailable.";
                      notify({ kind: "error", title: "Status couldn’t be updated", message });
                    }
                  }}
                  className="h-10 min-w-48 rounded-xl border border-white/[0.08] bg-[#0d0d12] px-3 text-xs text-zinc-200 outline-none focus:border-sky-300/40"
                >
                  {personalOfficeStatuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </section>
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
            </>
          )}
          {ownerView && (
            <p className="px-1 text-[10px] leading-5 text-zinc-600">Team presence, video, and tracked-time values are sample data. Live employee monitoring requires connected team accounts and a shared service.</p>
          )}
        </div>

        <aside className="space-y-4">
          {ownerView ? (
            <section className="rounded-xl border border-emerald-300/15 bg-emerald-300/[0.04] p-3" role="status">
              <p className="text-xs font-medium text-emerald-200">Team tracking preview</p>
              <p className="mt-1 text-[10px] leading-4 text-zinc-400">Review team presence, camera tiles, and today’s tracked-time summaries.</p>
            </section>
          ) : (
            <ConnectionStatus state={joined ? "connected" : "disconnected"} />
          )}
          <ParticipantList
            participants={participants}
            joined={ownerView || joined}
            showTrackedTime={ownerView}
          />
        </aside>
      </div>
    </div>
  );
}
