-- One owned workspace per account. Membership is granted only by accepting an
-- unexpired invitation while signed in with the invitation's verified email.
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 100)
);
create table public.team_invitations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email text not null,
  full_name text not null check (length(trim(full_name)) between 1 and 100),
  job_title text not null check (length(trim(job_title)) between 1 and 80),
  member_type text not null check (member_type in ('Employee', 'Freelancer')),
  token uuid not null unique default gen_random_uuid(),
  expires_at timestamptz not null default now() + interval '7 days',
  accepted_at timestamptz,
  last_sent_at timestamptz not null default now(),
  unique (workspace_id, email)
);
create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  job_title text not null,
  member_type text not null check (member_type in ('Employee', 'Freelancer')),
  primary key (workspace_id, user_id),
  unique (workspace_id, email)
);
alter table public.workspaces enable row level security;
alter table public.team_invitations enable row level security;
alter table public.workspace_members enable row level security;
-- Reads are owner scoped; writes only go through the checked functions below.
create policy owner_workspace on public.workspaces for select to authenticated using (owner_id = auth.uid());
create policy owner_invitations on public.team_invitations for select to authenticated using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = auth.uid()));
create policy owner_members on public.workspace_members for select to authenticated using (exists (select 1 from public.workspaces w where w.id = workspace_id and w.owner_id = auth.uid()));
revoke all on public.workspaces, public.team_invitations, public.workspace_members from anon, authenticated;
grant select on public.workspaces, public.team_invitations, public.workspace_members to authenticated;

create function public.prepare_team_invitation(company_name text, invite_email text, invite_name text, invite_role text, invite_type text)
returns public.team_invitations language plpgsql security definer set search_path = '' as $$
declare w public.workspaces; invitation public.team_invitations; normalized_email text := lower(trim(invite_email));
begin
  if auth.uid() is null then raise exception 'Sign in to invite teammates.'; end if;
  if normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' or length(normalized_email) > 254 then raise exception 'Enter a valid email address.'; end if;
  if normalized_email = lower(auth.jwt()->>'email') then raise exception 'You already own this workspace.'; end if;
  insert into public.workspaces(owner_id, name) values (auth.uid(), trim(company_name)) on conflict (owner_id) do nothing;
  select * into w from public.workspaces where owner_id = auth.uid() for update;
  if exists (select 1 from public.workspace_members where workspace_id = w.id and email = normalized_email) then raise exception 'This email is already on the team.'; end if;
  select * into invitation from public.team_invitations where workspace_id = w.id and email = normalized_email;
  if invitation.last_sent_at > now() - interval '60 seconds' then raise exception 'Please wait a minute before resending this invitation.'; end if;
  if (select count(*) from public.team_invitations where workspace_id = w.id and last_sent_at > now() - interval '1 hour') >= 20 then raise exception 'Invitation limit reached. Try again in an hour.'; end if;
  insert into public.team_invitations(workspace_id, email, full_name, job_title, member_type)
    values (w.id, normalized_email, trim(invite_name), trim(invite_role), invite_type)
    on conflict (workspace_id, email) do update set full_name = excluded.full_name, job_title = excluded.job_title,
      member_type = excluded.member_type, expires_at = now() + interval '7 days', last_sent_at = now()
    returning * into invitation;
  return invitation;
end;
$$;
create function public.accept_team_invitation(invite_token uuid)
returns text language plpgsql security definer set search_path = '' as $$
declare invitation public.team_invitations; company text;
begin
  if auth.uid() is null then raise exception 'Open the sign-in link in your invitation email first.'; end if;
  select * into invitation from public.team_invitations where token = invite_token for update;
  if not found then raise exception 'This invitation is invalid.'; end if;
  if not exists (select 1 from auth.users where id = auth.uid() and lower(email) = invitation.email and email_confirmed_at is not null) then raise exception 'Sign in with the email address this invitation was sent to.'; end if;
  if invitation.accepted_at is null and invitation.expires_at <= now() then raise exception 'This invitation has expired. Ask the owner to resend it.'; end if;
  insert into public.workspace_members(workspace_id, user_id, email, full_name, job_title, member_type)
    values (invitation.workspace_id, auth.uid(), invitation.email, invitation.full_name, invitation.job_title, invitation.member_type)
    on conflict (workspace_id, user_id) do nothing;
  update public.team_invitations set accepted_at = coalesce(accepted_at, now()) where id = invitation.id;
  select name into company from public.workspaces where id = invitation.workspace_id;
  return company;
end;
$$;
revoke all on function public.prepare_team_invitation(text,text,text,text,text), public.accept_team_invitation(uuid) from public, anon;
grant execute on function public.prepare_team_invitation(text,text,text,text,text), public.accept_team_invitation(uuid) to authenticated;
