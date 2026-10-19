"use client";

import AvatarImage from "@/components/avatar-image";
import { useMemberProfile } from "@/components/member-profile-provider";
import { useSyncExternalStore } from "react";
import {
  getProfileImageServerSnapshot,
  getProfileImageSnapshot,
  subscribeToProfileImage,
} from "@/lib/profile-image";

export default function ProfileAvatar({
  initials = "AM",
  className = "",
}: {
  initials?: string;
  className?: string;
}) {
  const profile = useMemberProfile();
  const localImage = useSyncExternalStore(
    subscribeToProfileImage,
    getProfileImageSnapshot,
    getProfileImageServerSnapshot,
  );

  const image = profile ? profile.photo : localImage;
  const displayInitials = profile ? profile.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("") : initials;
  return (
    <span
      role="img"
      aria-label="Profile photo"
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-indigo-300 to-sky-300 text-xs font-semibold text-slate-950 ${className}`}
    >
      <AvatarImage src={image} initials={displayInitials} />
    </span>
  );
}
