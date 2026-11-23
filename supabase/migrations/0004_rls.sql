-- =========================================================
-- Lensa — Row Level Security
-- =========================================================
alter table public.profiles         enable row level security;
alter table public.posts            enable row level security;
alter table public.tags             enable row level security;
alter table public.post_tags        enable row level security;
alter table public.likes            enable row level security;
alter table public.comments         enable row level security;
alter table public.follows          enable row level security;
alter table public.blocks           enable row level security;
alter table public.notifications    enable row level security;
alter table public.reports          enable row level security;
alter table public.admin_audit_logs enable row level security;

-- profiles
create policy "profiles_select_all"   on public.profiles for select using (true);
create policy "profiles_insert_self"  on public.profiles for insert with check (id = auth.uid());
create policy "profiles_update_self"  on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

-- posts
create policy "posts_select_visible" on public.posts for select using (
  (is_hidden = false and not public.is_blocked_between(auth.uid(), author_id))
  or author_id = auth.uid()
  or public.is_admin()
);
create policy "posts_insert_own"           on public.posts for insert with check (author_id = auth.uid());
create policy "posts_update_own"           on public.posts for update using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "posts_delete_own_or_admin"  on public.posts for delete using (author_id = auth.uid() or public.is_admin());

-- tags
create policy "tags_select_all"           on public.tags for select using (true);
create policy "tags_insert_authenticated" on public.tags for insert with check (auth.role() = 'authenticated');
create policy "tags_update_admin"         on public.tags for update using (public.is_admin()) with check (public.is_admin());
create policy "tags_delete_admin"         on public.tags for delete using (public.is_admin());

-- post_tags
create policy "post_tags_select_all" on public.post_tags for select using (true);
create policy "post_tags_insert_own_post" on public.post_tags for insert with check (
  exists (select 1 from public.posts p where p.id = post_id and p.author_id = auth.uid())
);
create policy "post_tags_delete_own_post" on public.post_tags for delete using (
  exists (select 1 from public.posts p where p.id = post_id and p.author_id = auth.uid())
);

-- likes
create policy "likes_select_all" on public.likes for select using (true);
create policy "likes_insert_own" on public.likes for insert with check (user_id = auth.uid());
create policy "likes_delete_own" on public.likes for delete using (user_id = auth.uid());

-- comments
create policy "comments_select_visible" on public.comments for select using (
  (is_hidden = false and not public.is_blocked_between(auth.uid(), author_id))
  or author_id = auth.uid()
  or public.is_admin()
);
create policy "comments_insert_own"          on public.comments for insert with check (author_id = auth.uid());
create policy "comments_update_own"          on public.comments for update using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "comments_delete_own_or_admin" on public.comments for delete using (author_id = auth.uid() or public.is_admin());

-- follows
create policy "follows_select_all" on public.follows for select using (true);
create policy "follows_insert_own" on public.follows for insert with check (follower_id = auth.uid());
create policy "follows_delete_own" on public.follows for delete using (follower_id = auth.uid());

-- blocks
create policy "blocks_select_own" on public.blocks for select using (blocker_id = auth.uid());
create policy "blocks_insert_own" on public.blocks for insert with check (blocker_id = auth.uid());
create policy "blocks_delete_own" on public.blocks for delete using (blocker_id = auth.uid());

-- notifications
create policy "notifications_select_own" on public.notifications for select using (recipient_id = auth.uid());
create policy "notifications_update_own" on public.notifications for update using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());
create policy "notifications_delete_own" on public.notifications for delete using (recipient_id = auth.uid());

-- reports
create policy "reports_select_own_or_admin" on public.reports for select using (reporter_id = auth.uid() or public.is_admin());
create policy "reports_insert_own"          on public.reports for insert with check (reporter_id = auth.uid());
create policy "reports_update_admin"        on public.reports for update using (public.is_admin()) with check (public.is_admin());
create policy "reports_delete_admin"        on public.reports for delete using (public.is_admin());

-- admin_audit_logs
create policy "audit_logs_select_admin" on public.admin_audit_logs for select using (public.is_admin());