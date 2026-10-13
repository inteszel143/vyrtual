"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const SIDEBAR_COLLAPSED_KEY = "vyrtual-sidebar-collapsed";
const SIDEBAR_COLLAPSE_EVENT = "vyrtual-sidebar-collapse-change";

function subscribeToSidebarCollapse(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(SIDEBAR_COLLAPSE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SIDEBAR_COLLAPSE_EVENT, callback);
  };
}

function getSidebarCollapsedSnapshot() {
  return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
}

function getSidebarCollapsedServerSnapshot() {
  return false;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const sidebarCollapsed = useSyncExternalStore(
    subscribeToSidebarCollapse,
    getSidebarCollapsedSnapshot,
    getSidebarCollapsedServerSnapshot,
  );

  return (
    <div id="workspace-shell" className="min-h-screen bg-zinc-50 text-zinc-900">
      <input
        id="sidebar-collapsed"
        type="checkbox"
        aria-label="Use icon-only sidebar"
        className="peer sr-only"
        checked={sidebarCollapsed}
        onChange={(event) => {
          const collapsed = event.currentTarget.checked;
          window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
          document.documentElement.dataset.sidebarCollapsed = String(collapsed);
          document.getElementById("workspace-shell")?.classList.toggle("sidebar-is-collapsed", collapsed);
          window.dispatchEvent(new Event(SIDEBAR_COLLAPSE_EVENT));
        }}
      />
      {children}
      <Link
        href="/contact"
        className="fixed bottom-4 right-4 z-30 inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-[#15151c] px-4 text-xs font-medium text-zinc-100 shadow-xl shadow-black/30 transition-colors hover:border-sky-300/30 hover:bg-[#20202a] sm:bottom-6 sm:right-6"
      >
        <svg
          aria-hidden="true"
          className="size-4 text-sky-200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
        </svg>
        Help &amp; feedback
      </Link>
    </div>
  );
}
