"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useMemberProfile } from "@/components/member-profile-provider";
import { createClient } from "@/lib/supabase/client";
import { optimizeProfileImage } from "@/lib/profile-image";

export default function MemberWelcome({ edit = false }: { edit?: boolean }) {
  const profile = useMemberProfile();
  if (!profile) return null;
  if (profile.loading) return edit ? <p role="status" className="text-sm text-zinc-400">Loading your profile…</p> : null;
  if (!profile.user || !profile.membership) return edit && !profile.error ? <p className="text-sm text-zinc-400">Accept a workspace invitation to set up your member profile.</p> : null;
  const completed = profile.user.user_metadata.welcomed_workspaces;
  const welcome = !Array.isArray(completed) || !completed.includes(profile.membership.workspace_id);
  return <WelcomeForm key={`${profile.user.id}:${profile.membership.workspace_id}`} welcome={welcome} edit={edit} />;
}

function WelcomeForm({ welcome, edit }: { welcome: boolean; edit: boolean }) {
  const profile = useMemberProfile()!;
  const dialog = useRef<HTMLDialogElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const [name, setName] = useState(profile.name);
  const [photo, setPhoto] = useState(profile.photo);
  const [changedPhoto, setChangedPhoto] = useState(false);
  const [busy, setBusy] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const shouldOpen = welcome && !dismissed && !edit;
  useEffect(() => {
    if (shouldOpen) dialog.current?.showModal(); else dialog.current?.close();
  }, [shouldOpen]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || processing) return;
    if (!name.trim()) { setError("Enter your name."); return; }
    setBusy(true); setError(""); setSaved(false);
    try {
      const supabase = createClient();
      let avatar = photo;
      if (changedPhoto && photo) {
        const blob = await (await fetch(photo)).blob();
        const path = `${profile.user!.id}/${crypto.randomUUID()}.jpg`;
        const { error } = await supabase.storage.from("profile-photos").upload(path, blob, { contentType: "image/jpeg" });
        if (error) throw new Error("Could not upload your photo. Check the profile-photos storage setup and try again.");
        avatar = supabase.storage.from("profile-photos").getPublicUrl(path).data.publicUrl;
        setPhoto(avatar); setChangedPhoto(false);
      }
      const existing = profile.user!.user_metadata.welcomed_workspaces;
      const { error } = await supabase.auth.updateUser({ data: {
        full_name: name.trim(), avatar_url: avatar,
        welcomed_workspaces: [...new Set([...(Array.isArray(existing) ? existing : []), profile.membership!.workspace_id])],
      } });
      if (error) throw new Error("Could not save your profile. Please try again.");
      await profile.refresh();
      setDismissed(true); setSaved(true);
    } catch (error) { setError(error instanceof Error ? error.message : "Could not save your profile."); }
    finally { setBusy(false); }
  }
  const fields = <form onSubmit={save} className="mt-6 space-y-5">
    <fieldset disabled={busy || processing} className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex size-20 items-center justify-center overflow-hidden rounded-2xl bg-sky-300/15 text-xl text-sky-200">
          {/* Uploaded photos and provider photos are external URLs. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {photo ? <img src={photo} alt="Your profile" className="size-full object-cover" referrerPolicy="no-referrer" /> : name.slice(0, 1).toUpperCase()}
        </span>
        <label className="cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-xs text-zinc-200">{processing ? "Processing…" : "Choose profile photo"}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={async (event) => {
            const file = event.target.files?.[0]; event.target.value = "";
            if (!file) return;
            setProcessing(true); setError("");
            try { setPhoto(await optimizeProfileImage(file)); setChangedPhoto(true); }
            catch (error) { setError(error instanceof Error ? error.message : "Could not open this image."); }
            finally { setProcessing(false); }
          }} />
        </label>
      </div>
      <label className="block text-xs text-zinc-400">Full name<input autoFocus required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#09090d] px-3 text-sm text-white" /></label>
      <label className="block text-xs text-zinc-400">Email address<input readOnly value={profile.user?.email ?? ""} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#09090d] px-3 text-sm text-zinc-300" /></label>
      <label className="block text-xs text-zinc-400">Company<input readOnly value={profile.membership?.company_name ?? ""} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#09090d] px-3 text-sm text-zinc-300" /></label>
      <p className="text-xs leading-5 text-zinc-500">{profile.membership?.member_type} · {profile.membership?.job_title}. Your email is verified through your account. Company details are managed by the workspace owner.</p>
      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      {saved && edit && <p role="status" className="text-sm text-emerald-300">Profile saved.</p>}
      <div className="flex justify-end gap-3">
        {!edit && <button type="button" onClick={() => setDismissed(true)} className="px-3 text-sm text-zinc-400">Later</button>}
        <button type="submit" className="rounded-xl bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">{busy ? "Saving…" : edit ? "Save profile" : "Let’s get started"}</button>
      </div>
    </fieldset>
  </form>;
  if (edit) return <section className="rounded-2xl border border-white/10 bg-[#111116] p-6"><h3 className="text-lg font-semibold">Your profile</h3>{fields}</section>;
  return <dialog ref={dialog} onCancel={(event) => { if (busy || processing) event.preventDefault(); else setDismissed(true); }} aria-labelledby="member-welcome-title" className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-3xl border border-sky-300/20 bg-[#111116] p-6 text-white shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm sm:p-8">
    <p className="text-xs uppercase tracking-widest text-sky-300">You’re part of the team</p>
    <h2 id="member-welcome-title" className="mt-3 text-2xl font-semibold">Welcome to {profile.membership?.company_name}!</h2>
    <p className="mt-2 text-sm leading-6 text-zinc-400">Make yourself at home. Confirm your name and add a photo so your teammates can recognize you.</p>
    {fields}
  </dialog>;
}
