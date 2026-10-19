-- Read only the caller's memberships without broadening owner-only table access.
create function public.my_workspace_memberships()
returns table(workspace_id uuid, company_name text, full_name text, job_title text, member_type text)
language sql stable security definer set search_path = '' as $$
  select w.id, w.name, m.full_name, m.job_title, m.member_type
  from public.workspace_members m join public.workspaces w on w.id = m.workspace_id
  where m.user_id = auth.uid() order by w.name, w.id;
$$;
revoke all on function public.my_workspace_memberships() from public, anon;
grant execute on function public.my_workspace_memberships() to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-photos', 'profile-photos', true, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
create policy profile_photo_insert on storage.objects for insert to authenticated
with check (bucket_id = 'profile-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy profile_photo_update on storage.objects for update to authenticated
using (bucket_id = 'profile-photos' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'profile-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy profile_photo_select on storage.objects for select to authenticated
using (bucket_id = 'profile-photos' and (storage.foldername(name))[1] = auth.uid()::text);
