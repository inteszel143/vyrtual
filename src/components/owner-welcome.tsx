"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function OwnerWelcome() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [welcome, setWelcome] = useState<{ name: string; company: string } | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const inFlight = useRef(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("Could not load your account.");
        if (user.user_metadata.owner_welcome_completed === true) return;
        const { data: owned, error: ownerError } = await supabase.from("workspaces").select("name").eq("owner_id", user.id).limit(1);
        if (ownerError) throw ownerError;
        if (!owned?.length) {
          const { data: memberships, error: memberError } = await supabase.rpc("my_workspace_memberships");
          if (memberError) throw memberError;
          // Match dashboard routing: members use their personal welcome, while
          // new company accounts can see this before creating a workspace row.
          if (memberships?.length) return;
        }
        if (active) {
          setLoadError(false);
          setWelcome({ name: user.user_metadata.full_name || user.user_metadata.name || "", company: owned?.[0]?.name || "your workspace" });
        }
      } catch {
        if (active) setLoadError(true);
      }
    }
    void load();
    return () => { active = false; };
  }, [attempt]);

  useEffect(() => {
    if (welcome && !dismissed) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [welcome, dismissed]);

  async function finish(destination?: string) {
    if (inFlight.current) return;
    inFlight.current = true;
    setSaving(true); setError("");
    try {
      const { error } = await createClient().auth.updateUser({ data: { owner_welcome_completed: true } });
      if (error) throw error;
      setDismissed(true);
      if (destination) router.push(destination);
    } catch {
      setError("Could not save your welcome preference. Please try again.");
    } finally { inFlight.current = false; setSaving(false); }
  }

  return <>
    {loadError && <div role="status" className="mx-5 mt-4 rounded-xl border border-white/10 bg-[#111116] px-4 py-3 text-xs text-zinc-400">Could not load your welcome guide. <button type="button" onClick={() => { setLoadError(false); setAttempt((value) => value + 1); }} className="text-sky-200 underline">Retry</button></div>}
    <dialog ref={dialogRef} aria-labelledby="owner-welcome-title" aria-describedby="owner-welcome-description"
      onCancel={(event) => { if (saving) event.preventDefault(); else setDismissed(true); }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto rounded-3xl border border-sky-300/20 bg-[#111116] p-6 text-white shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-2xl bg-sky-300/15 text-2xl text-sky-200">✦</span>
        <button type="button" disabled={saving} onClick={() => setDismissed(true)} aria-label="Close welcome" className="flex size-8 items-center justify-center rounded-lg text-xl text-zinc-400 hover:bg-white/5 hover:text-white disabled:opacity-50">×</button>
      </div>
      <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.2em] text-sky-300">Your team starts here</p>
      <h2 id="owner-welcome-title" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Welcome{welcome?.name ? `, ${welcome.name.split(/\s+/)[0]}` : " to Vyrtual"}!</h2>
      <p id="owner-welcome-description" className="mt-3 text-sm leading-6 text-zinc-400">Bring your people together in {welcome?.company ?? "your workspace"}. Here’s where you can get started.</p>
      <div className="mt-6 space-y-3">
        {[
          ["01", "Invite your team", "Bring employees and freelancers into your company with a secure invitation."],
          ["02", "Make room for great work", "Explore your virtual office and give everyone a place to connect."],
          ["03", "Keep the day organized", "Find your team, schedules, and reports from the dashboard."],
        ].map(([step, title, description]) => <div key={step} className="flex gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
          <span className="pt-0.5 font-mono text-xs text-sky-300">{step}</span>
          <div><h3 className="text-sm font-medium">{title}</h3><p className="mt-1 text-xs leading-5 text-zinc-400">{description}</p></div>
        </div>)}
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-rose-300">{error}</p>}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" disabled={saving} onClick={() => { void finish(); }} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-zinc-200 hover:bg-white/5 disabled:opacity-50">Explore dashboard</button>
        <button type="button" disabled={saving} onClick={() => { void finish("/team"); }} className="rounded-xl bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-200 disabled:opacity-50">{saving ? "Getting ready…" : "Invite your first teammate"}</button>
      </div>
    </dialog>
  </>;
}
