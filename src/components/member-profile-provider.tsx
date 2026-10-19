"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type Membership = { workspace_id: string; company_name: string; full_name: string; job_title: string; member_type: string };
type MemberProfile = { user: User | null; memberships: Membership[]; membership: Membership | null; name: string; photo: string; loading: boolean; error: string; refresh: () => Promise<void>; selectWorkspace: (id: string) => void };
const Context = createContext<MemberProfile | null>(null);
export function useMemberProfile() { return useContext(Context); }

export default function MemberProfileProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function refresh() {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Please sign in again to load your profile.");
    const { data, error } = await supabase.rpc("my_workspace_memberships");
    if (error) throw new Error("Could not load your membership. Apply the member welcome migration in Supabase, then retry.");
    setUser(user); setMemberships(data ?? []); setError("");
  }
  useEffect(() => {
    let active = true;
    const supabase = createClient();
    async function load() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("Please sign in again to load your profile.");
        const { data, error } = await supabase.rpc("my_workspace_memberships");
        if (!active) return;
        setUser(user);
        if (error) throw new Error("Could not load your membership. Apply the member welcome migration in Supabase, then retry.");
        setMemberships(data ?? []); setError("");
      } catch (error) {
        if (active) setError(error instanceof Error ? error.message : "Could not load your profile.");
      } finally { if (active) setLoading(false); }
    }
    void load();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") { setUser(null); setMemberships([]); }
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  const membership = memberships.find((item) => item.workspace_id === selected) ?? memberships[0] ?? null;
  const name = user?.user_metadata.full_name || membership?.full_name || user?.user_metadata.name || "Teammate";
  const photo = user?.user_metadata.avatar_url || user?.user_metadata.picture || "";
  return <Context.Provider value={{ user, memberships, membership, name, photo, loading, error, refresh, selectWorkspace: setSelected }}>{children}</Context.Provider>;
}
