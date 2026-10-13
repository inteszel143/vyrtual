"use client";

import { useRef, useState } from "react";
import { removeProfileImage, optimizeProfileImage, saveProfileImage } from "@/lib/profile-image";

export default function ProfilePhotoControl({ compact = false }: { compact?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const updatePhoto = async (file?: File) => {
    if (!file) return;
    setError("");
    setMessage("");

    try {
      const image = await optimizeProfileImage(file);
      saveProfileImage(image);
      setMessage("Profile photo updated.");
    } catch (cause) {
      const detail = cause instanceof Error ? cause.message : "Could not update your profile photo.";
      setError(detail);
    }
  };

  const removePhoto = () => {
    setError("");
    setMessage("");
    try {
      removeProfileImage();
      setMessage("Profile photo removed.");
    } catch (cause) {
      const detail = cause instanceof Error ? cause.message : "Could not remove your profile photo.";
      setError(detail);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        aria-label="Choose a profile photo"
        className="sr-only"
        onChange={(event) => {
          void updatePhoto(event.currentTarget.files?.[0]);
          event.currentTarget.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`rounded-lg border border-white/[0.1] bg-white/[0.04] font-medium text-zinc-200 transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
          compact ? "px-3 py-2 text-[11px]" : "px-3 py-2.5 text-xs"
        }`}
      >
        Update photo
      </button>
      <button
        type="button"
        onClick={removePhoto}
        className={`rounded-lg text-zinc-500 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${
          compact ? "px-2 py-2 text-[11px]" : "px-2 py-2.5 text-xs"
        }`}
      >
        Remove
      </button>
      {(error || message) && (
        <span role={error ? "alert" : "status"} className={`basis-full text-[10px] ${error ? "text-rose-300" : "text-emerald-300"}`}>
          {error || message}
        </span>
      )}
    </div>
  );
}
