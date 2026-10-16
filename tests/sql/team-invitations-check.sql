\set ON_ERROR_STOP on
set role authenticated;
select set_config('test.user_id', '00000000-0000-0000-0000-000000000001', false);
select set_config('test.email', 'owner@example.com', false);
select id, token from public.prepare_team_invitation('Example',' RECIPIENT@example.com ','Recipient','Designer','Employee') \gset invitation_
do $$ begin
  if (select count(*) from public.team_invitations) <> 1 then raise exception 'Owner cannot see invite'; end if;
  begin
    perform public.prepare_team_invitation('Example','recipient@example.com','Recipient','Designer','Employee');
    raise exception 'Resend was not throttled';
  exception when raise_exception then
    if sqlerrm not like 'Please wait a minute%' then raise; end if;
  end;
end $$;
select set_config('test.user_id', '00000000-0000-0000-0000-000000000003', false);
select set_config('test.email', 'other@example.com', false);
select set_config('test.token', :'invitation_token', false);
do $$ begin
  if (select count(*) from public.team_invitations) <> 0 then raise exception 'RLS leaked invitations'; end if;
  begin
    perform public.accept_team_invitation(current_setting('test.token')::uuid);
    raise exception 'Wrong email accepted';
  exception when raise_exception then
    if sqlerrm not like 'Sign in with the email%' then raise; end if;
  end;
  begin
    insert into public.workspace_members values (gen_random_uuid(),auth.uid(),'other@example.com','Other','Owner','Employee');
    raise exception 'Direct membership insert allowed';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
update public.team_invitations set expires_at = now() - interval '1 second';
set role authenticated;
select set_config('test.user_id', '00000000-0000-0000-0000-000000000002', false);
select set_config('test.email', 'recipient@example.com', false);
do $$ begin
  begin
    perform public.accept_team_invitation(current_setting('test.token')::uuid);
    raise exception 'Expired invite accepted';
  exception when raise_exception then
    if sqlerrm not like 'This invitation has expired%' then raise; end if;
  end;
end $$;
reset role;
update public.team_invitations set expires_at = now() + interval '7 days';
set role authenticated;
select public.accept_team_invitation(:'invitation_token');
select public.accept_team_invitation(:'invitation_token');
select set_config('test.user_id', '00000000-0000-0000-0000-000000000001', false);
select set_config('test.email', 'owner@example.com', false);
do $$ begin
  if (select count(*) from public.workspace_members) <> 1 then raise exception 'Acceptance was not idempotent'; end if;
  if (select accepted_at from public.team_invitations limit 1) is null then raise exception 'Acceptance not recorded'; end if;
  begin
    perform public.prepare_team_invitation('Example','recipient@example.com','Recipient','Designer','Employee');
    raise exception 'Duplicate member invited';
  exception when raise_exception then
    if sqlerrm not like 'This email is already%' then raise; end if;
  end;
end $$;
select 'All database authorization and lifecycle checks passed' as result;
