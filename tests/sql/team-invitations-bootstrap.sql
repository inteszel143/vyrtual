create role anon;
create role authenticated;
create schema auth;
create table auth.users(id uuid primary key, email text, email_confirmed_at timestamptz);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.user_id', true), '')::uuid $$;
create function auth.jwt() returns jsonb language sql stable as $$ select jsonb_build_object('email', current_setting('test.email', true)) $$;
grant usage on schema auth to authenticated;
grant execute on function auth.uid(), auth.jwt() to authenticated;
insert into auth.users values
('00000000-0000-0000-0000-000000000001', 'owner@example.com', now()),
('00000000-0000-0000-0000-000000000002', 'recipient@example.com', now()),
('00000000-0000-0000-0000-000000000003', 'other@example.com', now());
