\set ON_ERROR_STOP on
begin;
select id from public.workspaces limit 1 \gset workspace_
set role authenticated;
select set_config('test.user_id','00000000-0000-0000-0000-000000000002',true);
insert into public.personal_schedule_entries(workspace_id,title,kind,starts_at,ends_at)
values (:'workspace_id','Design work','Scheduled work','2026-10-19T09:00:00Z','2026-10-19T17:00:00Z') returning id \gset entry_
update public.personal_schedule_entries set title = 'Updated work' where id = :'entry_id';
do $$ begin
  if (select count(*) from public.personal_schedule_entries where title='Updated work') <> 1 then raise exception 'Own entry unavailable'; end if;
  begin
    update public.personal_schedule_entries set ends_at = starts_at;
    raise exception 'Invalid duration permitted';
  exception when check_violation then null;
  end;
end $$;
select set_config('test.user_id','00000000-0000-0000-0000-000000000003',true);
do $$ begin
  if (select count(*) from public.personal_schedule_entries) <> 0 then raise exception 'Other account data leaked'; end if;
  delete from public.personal_schedule_entries;
  if found then raise exception 'Other account deleted entry'; end if;
end $$;
select set_config('test.user_id','00000000-0000-0000-0000-000000000002',true);
do $$ begin
  begin
    insert into public.personal_schedule_entries(workspace_id,title,kind,starts_at,ends_at)
    values(gen_random_uuid(),'Invalid company','Meeting',now(),now()+interval '1 hour');
    raise exception 'Nonmember company insert allowed';
  exception when foreign_key_violation then null;
  end;
  delete from public.personal_schedule_entries;
  if not found then raise exception 'Own delete failed'; end if;
end $$;
reset role;
rollback;
select 'Schedule CRUD, duration and isolation checks passed' as result;
