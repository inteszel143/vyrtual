-- Run after the time migration in the disposable auth bootstrap database.
\set ON_ERROR_STOP on
begin;
set role authenticated;
select set_config('test.user_id', '00000000-0000-0000-0000-000000000002', true);
select id from public.start_personal_time_session() \gset first_
select set_config('test.first_session', :'first_id', true);
do $$ declare again public.personal_time_sessions; begin
  again := public.start_personal_time_session();
  if again.id <> current_setting('test.first_session')::uuid then raise exception 'Repeated start created duplicate'; end if;
  if (select count(*) from public.personal_time_sessions where ended_at is null) <> 1 then raise exception 'Expected one running session'; end if;
  begin
    insert into public.personal_time_sessions(user_id, started_at) values(auth.uid(), now() - interval '5 days');
    raise exception 'Client was allowed to forge a timestamp';
  exception when insufficient_privilege then null;
  end;
end $$;
select set_config('test.user_id', '00000000-0000-0000-0000-000000000003', true);
do $$ begin
  if (select count(*) from public.personal_time_sessions) <> 0 then raise exception 'Cross-account read allowed'; end if;
  begin
    perform public.stop_personal_time_session(current_setting('test.first_session')::uuid);
    raise exception 'Cross-account stop allowed';
  exception when raise_exception then
    if sqlerrm not like 'This time session is unavailable%' then raise; end if;
  end;
end $$;
select set_config('test.user_id', '00000000-0000-0000-0000-000000000002', true);
do $$ declare stopped public.personal_time_sessions; repeated public.personal_time_sessions; newer public.personal_time_sessions; begin
  stopped := public.stop_personal_time_session(current_setting('test.first_session')::uuid);
  if stopped.ended_at is null or stopped.ended_at < stopped.started_at then raise exception 'Invalid end timestamp'; end if;
  newer := public.start_personal_time_session();
  repeated := public.stop_personal_time_session(stopped.id);
  if repeated.ended_at <> stopped.ended_at then raise exception 'Repeated stop changed recorded duration'; end if;
  if not exists(select 1 from public.personal_time_sessions where id = newer.id and ended_at is null) then raise exception 'Stale stop closed new session'; end if;
end $$;
reset role;
set role anon;
do $$ begin
  begin
    perform public.start_personal_time_session();
    raise exception 'Anonymous start allowed';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
rollback;
select 'Personal time lifecycle and account isolation checks passed' as result;
