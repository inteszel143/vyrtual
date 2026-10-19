"use client";

import { useMemberProfile } from "@/components/member-profile-provider";
import { useSyncExternalStore } from "react";
import {
  getCompanyNameServerSnapshot,
  getCompanyNameSnapshot,
  subscribeToCompanyName,
} from "@/lib/company-workspace";

export default function CompanyName({ fallback = "Northstar Studio" }: { fallback?: string }) {
  const profile = useMemberProfile();
  const companyName = useSyncExternalStore(
    subscribeToCompanyName,
    getCompanyNameSnapshot,
    getCompanyNameServerSnapshot,
  );

  return <>{profile ? profile.membership?.company_name ?? "Your workspace" : companyName || fallback}</>;
}
