"use client";
import { useMemberProfile } from "@/components/member-profile-provider";
export default function MemberGreeting() {
  const profile = useMemberProfile();
  return <>
    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sky-200">{profile?.membership?.company_name ?? "Your personal workspace"}</p>
    <h3 className="mt-3 text-2xl font-semibold tracking-tight">{profile?.loading ? "Welcome" : `Welcome back, ${profile?.name.split(/\s+/)[0] ?? "teammate"}`}</h3>
  </>;
}
