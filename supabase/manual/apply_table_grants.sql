-- Run in the Supabase SQL Editor for an existing database.
-- All five tables must already exist. This does not change migration history.
begin;

grant select on public.workspaces, public.team_invitations,
  public.workspace_members, public.personal_time_sessions,
  public.personal_schedule_entries to anon;

grant select, insert, update, delete on public.workspaces,
  public.team_invitations, public.workspace_members,
  public.personal_time_sessions, public.personal_schedule_entries
  to authenticated;

grant select, insert, update, delete on public.workspaces,
  public.team_invitations, public.workspace_members,
  public.personal_time_sessions, public.personal_schedule_entries
  to service_role;

commit;
