"use client";

import { useSyncExternalStore } from "react";
import {
  getCompanyNameServerSnapshot,
  getCompanyNameSnapshot,
  subscribeToCompanyName,
} from "@/lib/company-workspace";

export default function CompanyName({ fallback = "Northstar Studio" }: { fallback?: string }) {
  const companyName = useSyncExternalStore(
    subscribeToCompanyName,
    getCompanyNameSnapshot,
    getCompanyNameServerSnapshot,
  );

  return <>{companyName || fallback}</>;
}
