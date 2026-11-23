-- =========================================================
-- Lensa — Initial Schema
-- =========================================================
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create type public.user_role          as enum ('user', 'admin');
create type public.notification_type  as enum ('like', 'comment', 'follow');
create type public.report_target_type as enum ('post', 'comment', 'user');
create type public.report_reason      as enum ('spam', 'harassment', 'inappropriate', 'copyright', 'other');
create type public.report_status      as enum ('open', 'resolved', 'dismissed');

-- profiles
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  username        text not null unique,
  display_name    text not null,
  bio             text,
  avatar_url      text,
  role            public.user_role not null default 'user',
  follower_count  int not null default 0,
  following_count int not null default 0,
  post_count      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint username_format  check (username ~ '^[a-z0-9_]{3,20}$'),
  constraint display_name_len check (char_length(display_name) between 1 and 50),
  constraint bio_len          check (bio is null or char_length(bio) <= 160)
);
create index profiles_username_trgm_idx on public.profiles using gin (username gin_trgm_ops);

-- posts
create table public.posts (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid not null references public.profiles(id) on delete cascade,
  image_url     text not null,
  image_path    text not null,
  caption       text,
  film_stock    text,
  camera        text,
  lens          text,
  alt_text      text,
  is_hidden     boolean not null default false,
  hidden_reason text,
  like_count    int not null default 0,
  comment_count int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint caption_len check (caption is null or char_length(caption) <= 500)
);
create index posts_author_created_idx  on public.posts (author_id, created_at desc);
create index posts_created_public_idx  on public.posts (created_at desc) where is_hidden = false;

-- tags
create table public.tags (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  post_count int not null default 0,
  created_at timestamptz not null default now(),
  constraint slug_format check (slug ~ '^[a-z0-9-]{1,40}$'),
  constraint name_len    check (char_length(name) between 1 and 40)
);
create index tags_name_trgm_idx on public.tags using gin (name gin_trgm_ops);

create table public.post_tags (
  post_id uuid not null references public.posts(id) on delete cascade,
  tag_id  uuid not null references public.tags(id)  on delete cascade,
  primary key (post_id, tag_id)
);
create index post_tags_tag_idx on public.post_tags (tag_id);

-- likes
create table public.likes (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  post_id    uuid not null references public.posts(id)    on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);
create index likes_post_idx on public.likes (post_id);

-- comments
create table public.comments (
  id            uuid primary key default gen_random_uuid(),
  post_id       uuid not null references public.posts(id)    on delete cascade,
  author_id     uuid not null references public.profiles(id) on delete cascade,
  body          text not null,
  is_hidden     boolean not null default false,
  hidden_reason text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint body_len check (char_length(body) between 1 and 300)
);
create index comments_post_created_idx on public.comments (post_id, created_at);
create index comments_author_idx       on public.comments (author_id);

-- follows
create table public.follows (
  follower_id  uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (follower_id, following_id),
  constraint no_self_follow check (follower_id <> following_id)
);
create index follows_following_idx on public.follows (following_id);

-- blocks
create table public.blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint no_self_block check (blocker_id <> blocked_id)
);
create index blocks_blocked_idx on public.blocks (blocked_id);

-- notifications
create table public.notifications (
  id           uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  actor_id     uuid not null references public.profiles(id) on delete cascade,
  type         public.notification_type not null,
  post_id      uuid references public.posts(id)    on delete cascade,
  comment_id   uuid references public.comments(id) on delete cascade,
  is_read      boolean not null default false,
  created_at   timestamptz not null default now(),
  constraint no_self_notification check (recipient_id <> actor_id),
  constraint ref_required check (
    (type = 'follow'  and post_id is null     and comment_id is null)
    or (type = 'like'    and post_id is not null and comment_id is null)
    or (type = 'comment' and post_id is not null and comment_id is not null)
  )
);
create index notifications_recipient_created_idx on public.notifications (recipient_id, created_at desc);
create index notifications_unread_idx            on public.notifications (recipient_id) where is_read = false;

-- reports
create table public.reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type public.report_target_type not null,
  target_id   uuid not null,
  reason      public.report_reason not null,
  details     text,
  status      public.report_status not null default 'open',
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at  timestamptz not null default now(),
  constraint details_len check (details is null or char_length(details) <= 500)
);
create unique index reports_unique_per_target on public.reports (reporter_id, target_type, target_id);
create index        reports_status_created_idx  on public.reports (status, created_at);

-- admin_audit_logs
create table public.admin_audit_logs (
  id          uuid primary key default gen_random_uuid(),
  admin_id    uuid references public.profiles(id) on delete set null,
  action      text not null,
  target_type text not null,
  target_id   uuid,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);
create index admin_audit_logs_created_idx on public.admin_audit_logs (created_at desc);