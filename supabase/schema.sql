-- supabase/schema.sql
-- Database setup for the TRPG Toolkit project.
-- Idempotent: safe to re-run on an existing or fresh Supabase project.

-- -------------------  ----------------------------------------------
-- Storage buckets
-- ------------------------------------------------------------------
-- Two private buckets: `maps` for backdrop images, `tokens` for character/creature pieces.
-- `public = false` means files are not served by URL — clients must request a signed URL.
-- The conflict clause makes this re-runnable.

insert into storage.buckets (id, name, public)
values
  ('maps',   'maps',   false),
  ('tokens', 'tokens', false)
on conflict (id) do nothing;

-- ------------------------------------------------------------------
-- Row-Level Security policies on storage.objects
-- ------------------------------------------------------------------
-- Convention: every file is stored at `<user_id>/<filename>` so that the first
-- folder in the path identifies the owner. Policies enforce that a user can
-- only see/write objects whose first folder matches their auth.uid().
--
-- We drop-then-create so this script is safe to re-run.

drop policy if exists "Users can read their own files in maps and tokens"   on storage.objects;
drop policy if exists "Users can upload to their own folder in maps and tokens" on storage.objects;
drop policy if exists "Users can update their own files in maps and tokens" on storage.objects;
drop policy if exists "Users can delete their own files in maps and tokens" on storage.objects;

-- READ
create policy "Users can read their own files in maps and tokens"
on storage.objects for select
to authenticated
using (
  bucket_id in ('maps', 'tokens')
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- INSERT
create policy "Users can upload to their own folder in maps and tokens"
on storage.objects for insert
to authenticated
with check (
  bucket_id in ('maps', 'tokens')
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- UPDATE
create policy "Users can update their own files in maps and tokens"
on storage.objects for update
to authenticated
using (
  bucket_id in ('maps', 'tokens')
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- DELETE
create policy "Users can delete their own files in maps and tokens"
on storage.objects for delete
to authenticated
using (
  bucket_id in ('maps', 'tokens')
  and (storage.foldername(name))[1] = auth.uid()::text
);