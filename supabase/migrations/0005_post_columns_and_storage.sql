-- =========================================================
-- Lensa — Tambahan Kolom Posts, Auto Profile Trigger & Storage Policy
-- =========================================================

-- 1. Tambahkan kolom title, location, exposure ke tabel posts
alter table public.posts
  add column if not exists title text not null default 'Tanpa Judul',
  add column if not exists location text,
  add column if not exists exposure text;

-- 2. Trigger otomatis membuat row di public.profiles saat user baru daftar
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_username text;
  v_display_name text;
begin
  -- Buat username valid (huruf kecil, angka, underscore, 3-20 karakter)
  v_username := lower(regexp_replace(split_part(new.email, '@', 1), '[^a-z0-9_]', '', 'g'));
  if char_length(v_username) < 3 then
    v_username := 'user_' || substr(replace(new.id::text, '-', ''), 1, 8);
  else
    v_username := left(v_username, 14) || '_' || substr(replace(new.id::text, '-', ''), 1, 5);
  end if;

  v_display_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'display_name'), ''),
    split_part(new.email, '@', 1),
    'Pengguna Lensa'
  );

  insert into public.profiles (id, username, display_name)
  values (new.id, v_username, left(v_display_name, 50))
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: pastikan user yang sudah ada di auth.users punya row di public.profiles
insert into public.profiles (id, username, display_name)
select
  u.id,
  left(
    case
      when char_length(regexp_replace(lower(split_part(u.email, '@', 1)), '[^a-z0-9_]', '', 'g')) >= 3
        then left(regexp_replace(lower(split_part(u.email, '@', 1)), '[^a-z0-9_]', '', 'g'), 14) || '_' || substr(replace(u.id::text, '-', ''), 1, 5)
      else 'user_' || substr(replace(u.id::text, '-', ''), 1, 8)
    end,
    20
  ),
  left(coalesce(nullif(split_part(u.email, '@', 1), ''), 'Pengguna Lensa'), 50)
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id)
on conflict (id) do nothing;

-- 3. Pastikan bucket storage 'post-images' tersedia & bersifat public
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do update set public = true;

-- 4. Storage RLS policies untuk bucket 'post-images'
drop policy if exists "post_images_public_select" on storage.objects;
create policy "post_images_public_select"
  on storage.objects for select
  using (bucket_id = 'post-images');

drop policy if exists "post_images_auth_insert" on storage.objects;
create policy "post_images_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'post-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "post_images_auth_delete" on storage.objects;
create policy "post_images_auth_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'post-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
