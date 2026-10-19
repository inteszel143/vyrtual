-- Test-only storage stand-in, for a disposable database after the invitation tests.
create schema storage;
create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
create table storage.objects(id uuid default gen_random_uuid(), bucket_id text, name text);
create function storage.foldername(text) returns text[] language sql immutable as $$ select string_to_array($1, '/') $$;
alter table storage.objects enable row level security;
grant usage on schema storage to authenticated;
grant select, insert, update on storage.objects to authenticated;
