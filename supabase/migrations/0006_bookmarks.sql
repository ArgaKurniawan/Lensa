-- =========================================================
-- Lensa — Bookmarks / Saved Posts Schema & RLS
-- =========================================================

-- 1. Buat tabel bookmarks
create table if not exists public.bookmarks (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  post_id    uuid not null references public.posts(id)    on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

-- Index untuk performa query bookmark per user dan per post
create index if not exists bookmarks_user_created_idx on public.bookmarks (user_id, created_at desc);
create index if not exists bookmarks_post_idx on public.bookmarks (post_id);

-- 2. Aktifkan Row Level Security (RLS)
alter table public.bookmarks enable row level security;

-- 3. RLS Policies: Hanya pemilik akun yang dapat melihat, menyimpan, dan menghapus bookmark miliknya
drop policy if exists "bookmarks_select_own" on public.bookmarks;
create policy "bookmarks_select_own"
  on public.bookmarks for select
  using (user_id = auth.uid());

drop policy if exists "bookmarks_insert_own" on public.bookmarks;
create policy "bookmarks_insert_own"
  on public.bookmarks for insert
  with check (user_id = auth.uid());

drop policy if exists "bookmarks_delete_own" on public.bookmarks;
create policy "bookmarks_delete_own"
  on public.bookmarks for delete
  using (user_id = auth.uid());

-- 4. Berikan hak akses (Grants) untuk authenticated user
grant select, insert, delete on public.bookmarks to authenticated;
