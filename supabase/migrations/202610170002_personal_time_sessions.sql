-- Personal time records are account-scoped. Only server clock RPCs may write.
create table public.personal_time_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default clock_timestamp(),
  ended_at timestamptz,
  constraint valid_session_duration check (ended_at is null or ended_at >= started_at)
);
create unique index one_active_personal_session on public.personal_time_sessions(user_id) where ended_at is null;
create index personal_session_history on public.personal_time_sessions(user_id, ended_at);
alter table public.personal_time_sessions enable row level security;
revoke all on public.personal_time_sessions from anon, authenticated;
grant select on public.personal_time_sessions to authenticated;
create policy own_time_sessions on public.personal_time_sessions for select to authenticated using (user_id = (select auth.uid()));

create function public.start_personal_time_session()
returns public.personal_time_sessions language plpgsql security definer set search_path = '' as $$
declare session public.personal_time_sessions;
begin
  if auth.uid() is null then raise exception 'Please sign in to record time.'; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(auth.uid()::text, 0));
  select * into session from public.personal_time_sessions where user_id = auth.uid() and ended_at is null;
  if found then return session; end if;
  insert into public.personal_time_sessions(user_id) values(auth.uid()) returning * into session;
  return session;
end;
$$;
create function public.stop_personal_time_session(session_id uuid)
returns public.personal_time_sessions language plpgsql security definer set search_path = '' as $$
declare session public.personal_time_sessions;
begin
  if auth.uid() is null then raise exception 'Please sign in to record time.'; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(auth.uid()::text, 0));
  select * into session from public.personal_time_sessions where id = session_id and user_id = auth.uid() for update;
  if not found then raise exception 'This time session is unavailable. Refresh your time logs.'; end if;
  if session.ended_at is null then
    update public.personal_time_sessions set ended_at = greatest(clock_timestamp(), started_at)
    where id = session.id returning * into session;
  end if;
  return session;
end;
$$;
revoke all on function public.start_personal_time_session(), public.stop_personal_time_session(uuid) from public, anon;
grant execute on function public.start_personal_time_session(), public.stop_personal_time_session(uuid) to authenticated;
