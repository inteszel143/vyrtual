create table public.personal_schedule_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  workspace_id uuid not null,
  title text not null check (length(trim(title)) between 1 and 120),
  kind text not null check (kind in ('Scheduled work','Meeting','Time off')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  notes text not null default '' check (length(notes) <= 2000),
  created_at timestamptz not null default now(),
  foreign key (workspace_id,user_id) references public.workspace_members(workspace_id,user_id) on delete cascade,
  check (ends_at > starts_at)
);
create index personal_schedule_week on public.personal_schedule_entries(user_id,workspace_id,starts_at);
alter table public.personal_schedule_entries enable row level security;
revoke all on public.personal_schedule_entries from anon, authenticated;
grant select, insert, delete on public.personal_schedule_entries to authenticated;
grant update (title,kind,starts_at,ends_at,notes) on public.personal_schedule_entries to authenticated;
create policy personal_schedule_read on public.personal_schedule_entries for select to authenticated using (user_id = (select auth.uid()));
create policy personal_schedule_insert on public.personal_schedule_entries for insert to authenticated with check (user_id = (select auth.uid()));
create policy personal_schedule_update on public.personal_schedule_entries for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy personal_schedule_delete on public.personal_schedule_entries for delete to authenticated using (user_id = (select auth.uid()));
