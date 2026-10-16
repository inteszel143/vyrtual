"use client";

import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { saveCompanyName } from "@/lib/company-workspace";

export default function InviteTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [company, setCompany] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    async function signIn() {
      try {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const access_token = hash.get("access_token");
        const refresh_token = hash.get("refresh_token");
        const linkError = hash.has("error") || new URLSearchParams(window.location.search).has("error");
        window.history.replaceState(null, "", window.location.pathname);
        if (linkError) throw new Error("This sign-in link has expired or is invalid. Ask the workspace owner to resend the invitation.");
        const supabase = createClient();
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) throw new Error("Could not verify this email link. Ask the owner to resend your invitation.");
        }
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) throw new Error("Open the sign-in link in your invitation email to continue. If it has expired, ask the owner to resend it.");
        setReady(true);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Could not verify your invitation. Please try again.");
      }
    }
    void signIn();
  }, []);

  async function accept() {
    if (pending) return;
    setPending(true); setError("");
    try {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) throw new Error("This invitation is invalid.");
      const { data, error } = await createClient().rpc("accept_team_invitation", { invite_token: token });
      if (error) throw new Error(error.code === "P0001" ? error.message : "Could not accept the invitation. Please try again.");
      setCompany(data);
      try { saveCompanyName(data); } catch { /* Membership is already saved on the server. */ }
    } catch (error) { setError(error instanceof Error ? error.message : "Could not join the workspace."); }
    finally { setPending(false); }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090d] px-6 py-16 text-white">
      <section className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111116] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Vyrtual · Team invitation</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">{company ? `Welcome to ${company}` : "Join your teammates"}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{company ? "Your invitation is accepted and your membership is saved." : "Accept this invitation to join the workspace using your verified email address."}</p>
        {!ready && !error && <p role="status" className="mt-5 text-sm text-zinc-400">Verifying your email link…</p>}
        {error && <p role="alert" className="mt-5 text-sm text-rose-300">{error}</p>}
        {company ? <Link href="/my-workspace" className="mt-6 inline-flex rounded-xl bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950">Open workspace</Link> : ready && <button type="button" onClick={accept} disabled={pending} className="mt-6 rounded-xl bg-sky-300 px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">{pending ? "Joining…" : "Accept invitation"}</button>}
      </section>
    </main>
  );
}
