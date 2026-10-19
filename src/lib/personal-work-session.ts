import { createClient } from "@/lib/supabase/client";

export type PersonalWorkLog = { id: string; startedAt: number; endedAt: number };
type Session = { id: string; started_at: string; ended_at: string | null };
const listeners = new Set<() => void>();
let active: Session | null = null;
let logs = "[]";
let status = "Loading your time logs…";
let error = "";
let userId: string | null = null;
let generation = 0;
let requestNumber = 0;
let busy = false;
let cleanup: (() => void) | null = null;
function emit() { listeners.forEach((callback) => callback()); }
function reset() { generation++; requestNumber++; busy = false; active = null; logs = "[]"; status = "Loading your time logs…"; error = ""; emit(); }

// Clear account-owned memory at the sign-in/out boundary, not only when a
// mounted component happens to receive an Auth subscription event.
export function resetPersonalWorkSession() { userId = null; reset(); }

export async function refreshPersonalWorkSession() {
  let request = ++requestNumber;
  let version = generation;
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (request !== requestNumber || version !== generation) return;
    if (authError || !user) {
      userId = null; active = null; logs = "[]";
      throw new Error("Please sign in again to load your time logs.");
    }
    if (userId !== user.id) {
      userId = user.id; reset();
      request = ++requestNumber; version = generation;
    }
    // Include sessions crossing the start of the visible local seven-day window.
    const cutoff = new Date(); cutoff.setHours(0, 0, 0, 0); cutoff.setDate(cutoff.getDate() - 6);
    const rows: Session[] = [];
    for (let offset = 0; ; offset += 500) {
      const { data, error: queryError } = await supabase.from("personal_time_sessions")
        .select("id,started_at,ended_at").eq("user_id", user.id)
        .or(`ended_at.is.null,ended_at.gte.${cutoff.toISOString()}`)
        .order("started_at", { ascending: true }).order("id").range(offset, offset + 499);
      if (queryError) throw new Error(queryError.code === "PGRST205" || queryError.code === "42P01"
        ? "Time tracking needs database setup. Apply the personal time sessions migration, then retry."
        : "Could not load your time logs. Check your connection and retry.");
      rows.push(...(data ?? []));
      if (!data || data.length < 500) break;
    }
    if (request !== requestNumber || version !== generation) return;
    active = rows.find((row) => !row.ended_at) ?? null;
    logs = JSON.stringify(rows.filter((row) => row.ended_at).map((row) => ({ id: row.id, startedAt: Date.parse(row.started_at), endedAt: Date.parse(row.ended_at!) })));
    status = ""; error = ""; emit();
  } catch (cause) {
    if (request !== requestNumber || version !== generation) return;
    status = "";
    error = cause instanceof Error ? cause.message : "Could not load your time logs.";
    emit();
  }
}

export function subscribeToPersonalWorkSession(callback: () => void) {
  listeners.add(callback);
  if (!cleanup) {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const nextUser = session?.user.id ?? null;
      if (event === "SIGNED_OUT" || nextUser !== userId) {
        userId = nextUser; reset();
        // Auth callbacks must not await other Supabase calls.
        window.setTimeout(() => { if (listeners.size) void refreshPersonalWorkSession(); }, 0);
      }
    });
    const refresh = () => { if (!busy) void refreshPersonalWorkSession(); };
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener("focus", refresh);
    void refreshPersonalWorkSession();
    cleanup = () => { subscription.unsubscribe(); window.clearInterval(timer); window.removeEventListener("focus", refresh); };
  }
  return () => {
    listeners.delete(callback);
    if (!listeners.size) { cleanup?.(); cleanup = null; userId = null; reset(); }
  };
}
export function getPersonalWorkSessionSnapshot() { return active ? Date.parse(active.started_at) : 0; }
export function getPersonalWorkSessionServerSnapshot() { return 0; }
export function getPersonalWorkLogsSnapshot() { return logs; }
export function getPersonalWorkLogsServerSnapshot() { return "[]"; }
export function getPersonalWorkStatusSnapshot() { return status || error; }
export function getPersonalWorkStatusServerSnapshot() { return "Loading your time logs…"; }
export function getPersonalWorkBusySnapshot() { return busy; }
export function getPersonalWorkBusyServerSnapshot() { return false; }

async function changeSession(start: boolean) {
  if (busy) throw new Error("Your time clock is already updating. Please wait.");
  if (status || error) throw new Error(status || error);
  if (!start && !active) return;
  const version = generation;
  const expectedUser = userId;
  const sessionId = active?.id;
  busy = true; requestNumber++; emit();
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (version !== generation) throw new Error("Your account changed. Refresh your time logs before trying again.");
    if (authError || !user || user.id !== expectedUser) {
      resetPersonalWorkSession();
      throw new Error("Your account changed. Refresh your time logs before trying again.");
    }
    const { error: rpcError } = start
      ? await createClient().rpc("start_personal_time_session")
      : await createClient().rpc("stop_personal_time_session", { session_id: sessionId });
    if (rpcError) throw new Error(rpcError.code === "P0001" ? rpcError.message : "Could not save your time session. Check your connection and try again.");
  } finally {
    // Reconcile ambiguous network failures before another action can be taken.
    if (version === generation) {
      await refreshPersonalWorkSession();
      if (version === generation) { busy = false; emit(); }
    }
  }
}
export function timeInToPersonalWorkSession() { return changeSession(true); }
export function timeOutOfPersonalWorkSession() { return changeSession(false); }
