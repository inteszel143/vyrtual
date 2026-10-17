\set ON_ERROR_STOP on
begin;
select id from public.workspaces limit 1 \gset workspace_
set role authenticated;
select set_config('test.user_id','00000000-0000-0000-0000-000000000002',true);
select set_config('test.company',:'workspace_id',true);
select public.set_office_status(:'workspace_id','Meeting');
select id from public.start_personal_time_session() \gset clock_
do $$ begin
  if not exists(select 1 from public.office_roster(current_setting('test.company')::uuid) where clocked_in and office_status='Meeting') then raise exception 'Shared active status missing'; end if;
  begin
    perform public.set_office_status(current_setting('test.company')::uuid,'Invalid');
    raise exception 'Invalid status allowed';
  exception when raise_exception then
    if sqlerrm not like 'Choose a valid%' then raise; end if;
  end;
end $$;
select public.stop_personal_time_session(:'clock_id');
do $$ begin
  if exists(select 1 from public.office_roster(current_setting('test.company')::uuid) where clocked_in) then raise exception 'Stopped session still present'; end if;
end $$;
select set_config('test.user_id','00000000-0000-0000-0000-000000000003',true);
do $$ begin
  begin
    perform public.office_roster(current_setting('test.company')::uuid);
    raise exception 'Unrelated user can read office';
  exception when raise_exception then
    if sqlerrm not like 'You do not have access%' then raise; end if;
  end;
  begin
    perform public.set_office_status(current_setting('test.company')::uuid,'Away');
    raise exception 'Unrelated user can write office';
  exception when raise_exception then
    if sqlerrm not like 'You do not have access%' then raise; end if;
  end;
end $$;
reset role;
rollback;
select 'Shared office access and status checks passed' as result;
