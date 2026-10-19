"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMemberProfile } from "@/components/member-profile-provider";
import { createClient } from "@/lib/supabase/client";
import { subscribeToPersonalWorkSession } from "@/lib/personal-work-session";
import type { OfficeParticipant, OfficePresence } from "./types";
import { OfficeRoomContent } from "./office-room-content";

export default function MemberOffice() {
  const profile = useMemberProfile();
  if (!profile || profile.loading) return <p role="status" className="text-sm text-zinc-400">Loading your office…</p>;
  if (!profile.user || !profile.membership) return <p className="text-sm text-zinc-400">Accept a company invitation to enter its office.</p>;
  return <ConnectedOffice key={`${profile.user.id}:${profile.membership.workspace_id}`} userId={profile.user.id} workspaceId={profile.membership.workspace_id} />;
}
function ConnectedOffice({userId,workspaceId}:{userId:string;workspaceId:string}) {
  const [people,setPeople] = useState<OfficeParticipant[]>([]);
  const [status,setStatus] = useState<OfficePresence>('Working');
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [saving,setSaving] = useState(false);
  const request = useRef(0);
  const writing = useRef(false);
  const invalidate = useCallback(()=>{request.current++;},[]);
  const load = useCallback(async ()=>{
    const id=++request.current;
    try {
      const {data,error} = await createClient().rpc('office_roster',{company_id:workspaceId});
      if(id!==request.current) return;
      if(error) throw new Error(error.code==='P0001' ? error.message : 'Could not load the office. Check your connection and apply the shared office migration, then retry.');
      const rows = data as {user_id:string;full_name:string;job_title:string;avatar_url:string;office_status:OfficePresence;clocked_in:boolean}[];
      setPeople(rows.map(row=>({id:row.user_id,name:row.full_name,role:row.job_title,avatarUrl:row.avatar_url,initials:row.full_name.split(/\s+/).slice(0,2).map(part=>part[0]).join('').toUpperCase(),color:'bg-sky-300/15 text-sky-200',gradient:'from-sky-950 to-indigo-950',state:row.clocked_in ? row.office_status : 'Offline',presence:row.clocked_in ? row.office_status : 'Offline',isLocal:row.user_id===userId,room:'Work studio',live:true})));
      setStatus(rows.find(row=>row.user_id===userId)?.office_status ?? 'Working'); setError('');
    } catch(cause) {if(id===request.current){setPeople([]);setError(cause instanceof Error ? cause.message : 'Could not load office.');}}
    finally {if(id===request.current)setLoading(false);}
  },[userId,workspaceId]);
  useEffect(()=>{
    const refresh=()=>{if(!writing.current) void load();};
    refresh(); const timer=window.setInterval(refresh,10000); window.addEventListener('focus',refresh);
    const unsubscribe=subscribeToPersonalWorkSession(refresh);
    return ()=>{invalidate();window.clearInterval(timer);window.removeEventListener('focus',refresh);unsubscribe();};
  },[load,invalidate]);
  async function changeStatus(value:OfficePresence) {
    if(writing.current) return;
    writing.current=true;setSaving(true);invalidate();
    try {
      const {error}=await createClient().rpc('set_office_status',{company_id:workspaceId,new_status:value});
      if(error) throw new Error('Could not save your status. Please retry.');
      setStatus(value); await load();
    } finally {writing.current=false;setSaving(false);}
  }
  return <>
    {error && <p role="alert" className="mb-4 rounded-xl border border-rose-300/20 p-4 text-sm text-rose-200">{error} <button className="underline" onClick={()=>void load()}>Retry</button></p>}
    {loading ? <p role="status" className="text-sm text-zinc-400">Loading teammates…</p> : <OfficeRoomContent members={people} savedPresence={status} onSavePresence={changeStatus} presencePending={saving || !!error} />}
    <p className="mt-4 text-xs leading-5 text-zinc-500">Presence shows whether teammates are timed in, not whether their browser is open. Refreshes every 10 seconds. Time tracking is account-wide; status is saved separately for each company.</p>
  </>;
}
