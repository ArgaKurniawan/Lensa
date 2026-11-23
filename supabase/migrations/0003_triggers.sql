-- =========================================================
-- Lensa — Triggers
-- =========================================================
create trigger trg_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

create trigger trg_posts_updated_at before update on public.posts
for each row execute function public.set_updated_at();

create trigger trg_comments_updated_at before update on public.comments
for each row execute function public.set_updated_at();

-- likes
create or replace function public.on_like_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_post_author uuid;
begin
  if tg_op = 'INSERT' then
    update public.posts set like_count = like_count + 1 where id = new.post_id;
    select author_id into v_post_author from public.posts where id = new.post_id;
    if v_post_author is not null and v_post_author <> new.user_id then
      insert into public.notifications (recipient_id, actor_id, type, post_id)
      values (v_post_author, new.user_id, 'like', new.post_id);
    end if;
    return new;
  elsif tg_op = 'DELETE' then
    update public.posts set like_count = greatest(like_count - 1, 0) where id = old.post_id;
    return old;
  end if;
  return null;
end; $$;

create trigger trg_like_change after insert or delete on public.likes
for each row execute function public.on_like_change();

-- comments
create or replace function public.on_comment_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_post_author uuid;
begin
  if tg_op = 'INSERT' then
    update public.posts set comment_count = comment_count + 1 where id = new.post_id;
    select author_id into v_post_author from public.posts where id = new.post_id;
    if v_post_author is not null and v_post_author <> new.author_id then
      insert into public.notifications (recipient_id, actor_id, type, post_id, comment_id)
      values (v_post_author, new.author_id, 'comment', new.post_id, new.id);
    end if;
    return new;
  elsif tg_op = 'DELETE' then
    update public.posts set comment_count = greatest(comment_count - 1, 0) where id = old.post_id;
    return old;
  end if;
  return null;
end; $$;

create trigger trg_comment_change after insert or delete on public.comments
for each row execute function public.on_comment_change();

-- follows
create or replace function public.on_follow_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.profiles set following_count = following_count + 1 where id = new.follower_id;
    update public.profiles set follower_count  = follower_count  + 1 where id = new.following_id;
    insert into public.notifications (recipient_id, actor_id, type)
    values (new.following_id, new.follower_id, 'follow');
    return new;
  elsif tg_op = 'DELETE' then
    update public.profiles set following_count = greatest(following_count - 1, 0) where id = old.follower_id;
    update public.profiles set follower_count  = greatest(follower_count  - 1, 0) where id = old.following_id;
    return old;
  end if;
  return null;
end; $$;

create trigger trg_follow_change after insert or delete on public.follows
for each row execute function public.on_follow_change();

-- posts
create or replace function public.on_post_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.profiles set post_count = post_count + 1 where id = new.author_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.profiles set post_count = greatest(post_count - 1, 0) where id = old.author_id;
    return old;
  end if;
  return null;
end; $$;

create trigger trg_post_change after insert or delete on public.posts
for each row execute function public.on_post_change();

-- post_tags
create or replace function public.on_post_tag_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    update public.tags set post_count = post_count + 1 where id = new.tag_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.tags set post_count = greatest(post_count - 1, 0) where id = old.tag_id;
    return old;
  end if;
  return null;
end; $$;

create trigger trg_post_tag_change after insert or delete on public.post_tags
for each row execute function public.on_post_tag_change();