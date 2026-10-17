\set ON_ERROR_STOP on
begin;
do $$ begin
  if not exists(select 1 from public.workspace_members where user_id = '00000000-0000-0000-0000-000000000002' and avatar_url = 'https://example.com/existing.jpg') then raise exception 'Existing photo not backfilled'; end if;
end $$;
update auth.users set raw_user_meta_data = '{"avatar_url":"https://example.com/updated.jpg"}' where id = '00000000-0000-0000-0000-000000000002';
do $$ begin
  if not exists(select 1 from public.workspace_members where user_id = '00000000-0000-0000-0000-000000000002' and avatar_url = 'https://example.com/updated.jpg') then raise exception 'Photo update not synchronized'; end if;
end $$;
update auth.users set raw_user_meta_data = '{"picture":"https://example.com/provider.jpg"}' where id = '00000000-0000-0000-0000-000000000003';
insert into public.workspace_members(workspace_id,user_id,email,full_name,job_title,member_type)
select id, '00000000-0000-0000-0000-000000000003', 'other@example.com', 'Other', 'Designer', 'Freelancer' from public.workspaces limit 1;
do $$ begin
  if not exists(select 1 from public.workspace_members where user_id = '00000000-0000-0000-0000-000000000003' and avatar_url = 'https://example.com/provider.jpg') then raise exception 'New membership photo missing'; end if;
end $$;
set role authenticated;
select set_config('test.user_id','00000000-0000-0000-0000-000000000001',true);
do $$ begin
  if (select count(*) from public.workspace_members where avatar_url <> '') <> 2 then raise exception 'Owner cannot read member photos'; end if;
end $$;
select set_config('test.user_id','00000000-0000-0000-0000-000000000003',true);
do $$ begin
  if (select count(*) from public.workspace_members) <> 0 then raise exception 'Photos leaked outside owner scope'; end if;
end $$;
reset role;
rollback;
select 'Team photo backfill, sync, join and isolation checks passed' as result;
