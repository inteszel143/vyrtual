alter table public.workspace_members add column office_status text not null default 'Working'
  check (office_status in ('Working','Away','Break','Meal Break','Meeting','Snoozed','Do not disturb'));

create function public.office_roster(company_id uuid)
returns table(user_id uuid,full_name text,job_title text,avatar_url text,office_status text,clocked_in boolean)
language plpgsql stable security definer set search_path = '' as $$
begin
  if auth.uid() is null or not (
    exists(select 1 from public.workspace_members where workspace_id = company_id and workspace_members.user_id = auth.uid())
    or exists(select 1 from public.workspaces where id = company_id and owner_id = auth.uid())
  ) then raise exception 'You do not have access to this office.'; end if;
  return query select m.user_id, coalesce(nullif(u.raw_user_meta_data->>'full_name',''),m.full_name),m.job_title,m.avatar_url,m.office_status,
    exists(select 1 from public.personal_time_sessions t where t.user_id = m.user_id and t.ended_at is null)
    from public.workspace_members m join auth.users u on u.id=m.user_id
    where m.workspace_id=company_id order by m.full_name,m.user_id;
end;
$$;
create function public.set_office_status(company_id uuid,new_status text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'Please sign in again.'; end if;
  if new_status is null or new_status not in ('Working','Away','Break','Meal Break','Meeting','Snoozed','Do not disturb') then raise exception 'Choose a valid office status.'; end if;
  update public.workspace_members set office_status=new_status where workspace_id=company_id and user_id=auth.uid();
  if not found then raise exception 'You do not have access to this office.'; end if;
end;
$$;
revoke all on function public.office_roster(uuid),public.set_office_status(uuid,text) from public,anon;
grant execute on function public.office_roster(uuid),public.set_office_status(uuid,text) to authenticated;
