-- Disposable database only, after the invitation lifecycle checks.
alter table auth.users add column raw_user_meta_data jsonb default '{}'::jsonb;
update auth.users set raw_user_meta_data = '{"avatar_url":"https://example.com/existing.jpg"}'
where id = '00000000-0000-0000-0000-000000000002';
