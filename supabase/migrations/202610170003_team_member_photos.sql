-- Expose only the member's display photo through the existing owner-scoped RLS.
alter table public.workspace_members add column avatar_url text not null default '';

create function public.set_member_profile_on_join()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  select coalesce(nullif(u.raw_user_meta_data->>'avatar_url', ''), u.raw_user_meta_data->>'picture', '')
    into new.avatar_url from auth.users u where u.id = new.user_id;
  new.avatar_url := coalesce(new.avatar_url, '');
  return new;
end;
$$;
create trigger member_profile_on_join before insert on public.workspace_members
for each row execute function public.set_member_profile_on_join();

create function public.sync_member_profile_photo()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.workspace_members
    set avatar_url = coalesce(nullif(new.raw_user_meta_data->>'avatar_url', ''), new.raw_user_meta_data->>'picture', '')
    where user_id = new.id;
  return new;
end;
$$;
create trigger member_profile_photo_updated after update of raw_user_meta_data on auth.users
for each row when (old.raw_user_meta_data is distinct from new.raw_user_meta_data)
execute function public.sync_member_profile_photo();
revoke all on function public.set_member_profile_on_join(), public.sync_member_profile_photo() from public, anon, authenticated;

-- Include photos saved before this migration; no need for users to upload again.
update public.workspace_members m
set avatar_url = coalesce(nullif(u.raw_user_meta_data->>'avatar_url', ''), u.raw_user_meta_data->>'picture', '')
from auth.users u where u.id = m.user_id;
