"use client";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useMemberProfile } from "@/components/member-profile-provider";
import { createClient } from "@/lib/supabase/client";
import { localInput, moveDays, scheduledHours, validateSchedule, weekStart, type ScheduleEntry } from "@/lib/personal-schedule";

export default function PersonalSchedule() {
  const profile = useMemberProfile();
  if (!profile || profile.loading) return <p role="status" className="text-sm text-zinc-400">Loading your schedule…</p>;
  if (!profile.user || !profile.membership) return <p className="text-sm text-zinc-400">Join a company workspace to plan your schedule.</p>;
  return <Schedule key={`${profile.user.id}:${profile.membership.workspace_id}`} userId={profile.user.id} workspaceId={profile.membership.workspace_id} />;
}
function Schedule({ userId, workspaceId }: { userId: string; workspaceId: string }) {
  const [week, setWeek] = useState(() => weekStart(new Date()));
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const [editor, setEditor] = useState<{ entry?: ScheduleEntry } | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const inFlight = useRef(false);
  const end = moveDays(week,7);
  const reload = useCallback(() => setRevision(value => value+1), []);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const rows: ScheduleEntry[] = [];
        for (let offset = 0; ; offset += 500) {
          const { data, error } = await createClient().from("personal_schedule_entries")
            .select("id,title,kind,starts_at,ends_at,notes").eq("user_id",userId).eq("workspace_id",workspaceId)
            .lt("starts_at",moveDays(week,7).toISOString()).gt("ends_at",week.toISOString()).order("starts_at").order("id").range(offset,offset+499);
          if (error) throw new Error(error.code === 'PGRST205' ? 'Schedule setup is missing. Apply the personal schedule migration in Supabase, then retry.' : 'Could not load your schedule. Please retry.');
          if (!active) return;
          rows.push(...(data ?? []));
          if (!data || data.length < 500) break;
        }
        if (active) { setEntries(rows); setError(""); }
      } catch (cause) { if (active) setError(cause instanceof Error ? cause.message : 'Could not load schedule.'); }
      finally { if (active) setLoading(false); }
    }
    void load();
    return () => { active = false; };
  }, [week,workspaceId,userId,revision]);
  useEffect(() => { window.addEventListener('focus',reload); return () => window.removeEventListener('focus',reload); }, [reload]);
  useEffect(() => { if (editor) dialog.current?.showModal(); else dialog.current?.close(); },[editor]);
  function open(entry?: ScheduleEntry) { setFormError(''); setConfirmDelete(false); setEditor({entry}); }
  function navigate(date: Date) { setLoading(true); setEntries([]); setWeek(date); }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const values = new FormData(event.currentTarget);
    const title = String(values.get('title') ?? '').trim(), start = String(values.get('start')), finish = String(values.get('end'));
    const validation = validateSchedule(title,start,finish);
    if (validation) { setFormError(validation); return; }
    const payload = { title, starts_at: new Date(start).toISOString(), ends_at: new Date(finish).toISOString(), kind: String(values.get('kind')), notes: String(values.get('notes') ?? '').trim() };
    inFlight.current = true; setSaving(true); setFormError('');
    try {
      const client = createClient();
      const query = editor?.entry ? client.from('personal_schedule_entries').update(payload).eq('id',editor.entry.id).eq('user_id',userId).eq('workspace_id',workspaceId) : client.from('personal_schedule_entries').insert({...payload,user_id:userId,workspace_id:workspaceId});
      const { data, error } = await query.select('id').single();
      if (error || !data) throw new Error('Could not save this entry. Check your connection and workspace access, then retry.');
      setEditor(null); navigate(weekStart(new Date(start))); reload();
    } catch(cause) { setFormError(cause instanceof Error ? cause.message : 'Could not save entry.'); }
    finally { inFlight.current = false; setSaving(false); }
  }
  async function remove() {
    if (!editor?.entry || inFlight.current) return;
    inFlight.current = true; setSaving(true); setFormError('');
    try {
      const { error, data } = await createClient().from('personal_schedule_entries').delete().eq('id',editor.entry.id).eq('user_id',userId).eq('workspace_id',workspaceId).select('id').single();
      if (error || !data) throw new Error('Could not delete this entry. Refresh and try again.');
      setEditor(null); setLoading(true); reload();
    } catch(cause) { setFormError(cause instanceof Error ? cause.message : 'Could not delete entry.'); }
    finally { inFlight.current = false; setSaving(false); }
  }
  const dateLabel = (date: Date) => date.toLocaleDateString([], {month:'short',day:'numeric',year:'numeric'});
  const timeLabel = (value: string) => new Date(value).toLocaleString([], {month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});
  const inputClass = "mt-2 w-full rounded-xl border border-white/10 bg-[#09090d] p-3 text-sm text-white";
  const buttonClass = "rounded-xl border border-white/10 px-3 py-2 text-xs text-zinc-200 hover:bg-white/5 disabled:opacity-50";
  return <>
    <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-zinc-400">Times shown in {Intl.DateTimeFormat().resolvedOptions().timeZone}</p><button className="rounded-xl bg-sky-300 px-4 py-3 text-sm font-semibold text-slate-950" onClick={() => open()}>+ Add schedule</button></div>
    {!loading && !error && <section className="mt-5 grid gap-3 sm:grid-cols-3">{[['Work hours',`${scheduledHours(entries,week,end).toFixed(1)}h`],['Meetings',entries.filter(e=>e.kind==='Meeting').length],['Time-off entries',entries.filter(e=>e.kind==='Time off').length]].map(([label,value])=><article key={label} className="rounded-2xl border border-white/10 bg-[#111116] p-5"><p className="text-xs text-zinc-400">{label}</p><p className="mt-3 text-2xl font-semibold">{value}</p></article>)}</section>}
    <section className="mt-6 rounded-2xl border border-white/10 bg-[#111116] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-sm font-semibold">{dateLabel(week)} – {dateLabel(moveDays(end,-1))}</h3><div className="flex gap-2"><button className={buttonClass} onClick={()=>navigate(moveDays(week,-7))} aria-label="Previous week">←</button><button className={buttonClass} onClick={()=>navigate(weekStart(new Date()))}>This week</button><button className={buttonClass} onClick={()=>navigate(moveDays(week,7))} aria-label="Next week">→</button></div></div>
      {loading ? <p role="status" className="py-10 text-sm text-zinc-400">Loading schedule…</p> : error ? <p role="alert" className="py-6 text-sm text-rose-300">{error} <button onClick={()=>{setLoading(true);reload();}} className="underline">Retry</button></p> : !entries.length ? <div className="py-12 text-center"><h4 className="text-sm font-medium">Nothing planned this week</h4><p className="mt-2 text-xs text-zinc-400">Add a work block, meeting, or personal time off to get started.</p></div> : <div className="mt-5 space-y-3">{entries.map(entry=><article key={entry.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-300/15 bg-sky-300/5 p-4"><div className="min-w-0"><p className="text-[10px] uppercase tracking-widest text-sky-200">{entry.kind}</p><h4 className="mt-1 break-words text-sm font-medium">{entry.title}</h4><p className="mt-2 text-xs text-zinc-400">{timeLabel(entry.starts_at)} – {timeLabel(entry.ends_at)}</p>{entry.notes && <p className="mt-2 whitespace-pre-wrap break-words text-xs text-zinc-500">{entry.notes}</p>}</div><button onClick={()=>open(entry)} className={buttonClass} aria-label={`Edit ${entry.title}`}>Edit</button></article>)}</div>}
    </section>
    <p className="mt-4 text-xs leading-5 text-zinc-500">Personal plans saved to your account for this company. Time off is not an approved leave request. Overlapping plans are allowed; work-hour totals add each work block.</p>
    <dialog ref={dialog} onCancel={event=>{if(saving) event.preventDefault(); else setEditor(null);}} aria-labelledby="schedule-title" className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#111116] p-6 text-white backdrop:bg-black/70">
      {editor && <form key={editor.entry?.id ?? 'new'} onSubmit={save}><h2 id="schedule-title" className="text-xl font-semibold">{editor.entry ? 'Edit schedule' : 'Add schedule'}</h2><fieldset disabled={saving} className="mt-5 space-y-4">
        <label className="block text-xs text-zinc-400">Title<input autoFocus name="title" required maxLength={120} defaultValue={editor.entry?.title} className={inputClass}/></label>
        <label className="block text-xs text-zinc-400">Type<select name="kind" defaultValue={editor.entry?.kind ?? 'Scheduled work'} className={inputClass}><option>Scheduled work</option><option>Meeting</option><option>Time off</option></select></label>
        <label className="block text-xs text-zinc-400">Start (your local time)<input type="datetime-local" name="start" required defaultValue={editor.entry ? localInput(new Date(editor.entry.starts_at)) : localInput(week)} className={inputClass}/></label>
        <label className="block text-xs text-zinc-400">End (your local time)<input type="datetime-local" name="end" required defaultValue={editor.entry ? localInput(new Date(editor.entry.ends_at)) : localInput(new Date(week.getTime()+3600000))} className={inputClass}/></label>
        <label className="block text-xs text-zinc-400">Notes (optional)<textarea name="notes" maxLength={2000} defaultValue={editor.entry?.notes} className={inputClass}/></label>
        {formError && <p role="alert" className="text-sm text-rose-300">{formError}</p>}
        {confirmDelete && <p className="text-sm text-rose-200">Delete this schedule entry permanently?</p>}
        <div className="flex flex-wrap justify-end gap-2">{editor.entry && <button type="button" onClick={()=>confirmDelete ? void remove() : setConfirmDelete(true)} className={buttonClass}>{confirmDelete ? 'Confirm delete' : 'Delete'}</button>}<button type="button" onClick={()=>setEditor(null)} className={buttonClass}>Cancel</button><button type="submit" className="rounded-xl bg-sky-300 px-4 py-2 text-sm font-semibold text-slate-950">{saving ? 'Saving…' : 'Save schedule'}</button></div>
      </fieldset></form>}
    </dialog>
  </>;
}
