\set ON_ERROR_STOP on
set role authenticated;
select set_config('test.user_id', '00000000-0000-0000-0000-000000000002', false);
do $$ begin
  if (select count(*) from public.my_workspace_memberships()) <> 1 then raise exception 'Member cannot read own membership'; end if;
  if (select company_name from public.my_workspace_memberships()) <> 'Example' then raise exception 'Wrong company'; end if;
  if (select member_type from public.my_workspace_memberships()) <> 'Employee' then raise exception 'Wrong role'; end if;
  if (select count(*) from public.team_invitations) <> 0 then raise exception 'Owner-only invitations exposed'; end if;
end $$;
insert into storage.objects(bucket_id, name) values ('profile-photos', '00000000-0000-0000-0000-000000000002/avatar.jpg');
do $$ begin
  begin
    insert into storage.objects(bucket_id, name) values ('profile-photos', '00000000-0000-0000-0000-000000000003/avatar.jpg');
    raise exception 'Cross-user photo upload allowed';
  exception when insufficient_privilege then null;
  end;
end $$;
select set_config('test.user_id', '00000000-0000-0000-0000-000000000003', false);
do $$ begin
  if (select count(*) from public.my_workspace_memberships()) <> 0 then raise exception 'Cross-user membership leaked'; end if;
  if (select count(*) from storage.objects) <> 0 then raise exception 'Other photo objects listed'; end if;
  update storage.objects set name = 'changed.jpg';
  if found then raise exception 'Other user photo modified'; end if;
end $$;
reset role;
set role anon;
do $$ begin
  begin
    perform public.my_workspace_memberships();
    raise exception 'Anonymous membership read allowed';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
select 'Member welcome access checks passed' as result;
