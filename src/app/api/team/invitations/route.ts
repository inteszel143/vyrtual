import { createClient as createEmailClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Please sign in again." }, { status: 401 });
  const { data, error } = await supabase.from("team_invitations")
    .select("id,full_name,email,job_title,member_type,accepted_at,expires_at")
    .order("last_sent_at", { ascending: false });
  if (error) return Response.json({ error: "Could not load your team. Check that the team invitation migration has been applied." }, { status: 503 });
  return Response.json({ invitations: data }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Please sign in again." }, { status: 401 });
  let body;
  try { body = await request.json(); } catch {
    return Response.json({ error: "Invalid invitation." }, { status: 400 });
  }
  const { name, email, role, type, companyName } = body ?? {};
  if (typeof name !== "string" || !name.trim() || name.length > 100 ||
      typeof role !== "string" || !role.trim() || role.length > 80 ||
      typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      !["Employee", "Freelancer"].includes(type) || typeof companyName !== "string" || !companyName.trim() || companyName.length > 100) {
    return Response.json({ error: "Enter a name, valid email, job title, and member type." }, { status: 400 });
  }
  const { data: invitation, error } = await supabase.rpc("prepare_team_invitation", {
    company_name: companyName, invite_email: email, invite_name: name, invite_role: role, invite_type: type,
  });
  if (error) return Response.json({ error: error.code === "P0001" ? error.message : "Could not save the invitation. Check that the team invitation migration has been applied." }, { status: 400 });
  // Independent implicit-flow client: the recipient opens the email on their
  // own device, so it must not depend on the inviter's PKCE verifier/cookies.
  const emailClient = createEmailClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { flowType: "implicit", persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { error: sendError } = await emailClient.auth.signInWithOtp({
    email: invitation.email,
    options: { shouldCreateUser: true, emailRedirectTo: new URL(`/invite/${invitation.token}`, request.url).toString() },
  });
  if (sendError) return Response.json({ error: sendError.status === 429
    ? "Invitation saved, but email is rate limited. Wait a minute, then resend."
    : "Invitation saved, but the email could not be sent. Check Supabase email settings, then resend." }, { status: 502 });
  return Response.json({ success: true });
}
