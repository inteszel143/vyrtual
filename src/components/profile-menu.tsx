"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ProfileAvatar from "@/components/profile-avatar";
import ProfilePhotoControl from "@/components/profile-photo-control";
import LoadingScreen from "@/components/loading-screen";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/toast-provider";
import { createPortal } from "react-dom";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const logoutInFlight = useRef(false);
  const { notify } = useToast();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  async function handleLogout() {
    if (logoutInFlight.current) return;
    logoutInFlight.current = true;
    setLoggingOut(true);
    setOpen(false);
    try {
      const { error } = await createClient().auth.signOut({ scope: "local" });
      if (error) throw error;
      // A full navigation clears the in-memory workspace router cache.
      window.location.replace("/login");
    } catch {
      logoutInFlight.current = false;
      setLoggingOut(false);
      notify({
        kind: "error",
        title: "Could not log out",
        message: "Check your connection and try again.",
      });
    }
  }

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      {loggingOut && createPortal(<LoadingScreen />, document.body)}
      <button
        ref={triggerRef}
        type="button"
        disabled={loggingOut}
        aria-label="Open profile menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((isOpen) => !isOpen)}
        className="flex items-center gap-1.5 rounded-full p-0.5 text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
      >
        <ProfileAvatar className="size-9" />
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="m5.5 7.5 4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Profile menu"
          className="absolute right-0 top-full z-50 mt-2 min-w-60 overflow-hidden rounded-xl border border-white/10 bg-[#15151c] p-1.5 shadow-xl shadow-black/40"
        >
          <div className="flex items-center gap-3 border-b border-white/[0.08] px-3 py-3">
            <ProfileAvatar className="size-10" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-white">Alex Morgan</span>
              <span className="block truncate text-xs text-zinc-500">alex@northstar.example</span>
            </span>
          </div>
          <div className="border-b border-white/[0.08] px-3 py-2">
            <ProfilePhotoControl compact />
          </div>
          <Link
            href="/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-sm text-zinc-200 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:bg-white/[0.06] focus-visible:outline-none"
          >
            Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={loggingOut}
            className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-zinc-200 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:bg-white/[0.06] focus-visible:outline-none disabled:opacity-60"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
