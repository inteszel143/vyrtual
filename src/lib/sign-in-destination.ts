import type { SupabaseClient } from "@supabase/supabase-js";

export async function getSignInDestination(supabase: SupabaseClient) {
  // Accounts owning a workspace keep their company landing page.
  const { data: owned, error: ownerError } = await supabase.from("workspaces").select("id").limit(1);
  if (ownerError) throw new Error("Could not load your workspace. Please try signing in again.");
  if (owned?.length) return "/dashboard";
  const { data: memberships, error } = await supabase.rpc("my_workspace_memberships");
  if (error) throw new Error("Could not load your workspace. Please try signing in again.");
  return memberships?.length ? "/my-workspace" : "/dashboard";
}
