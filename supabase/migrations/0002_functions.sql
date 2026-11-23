-- =========================================================
-- Lensa — Helper Functions
-- =========================================================
create or replace function public.is_admin(uid uuid default auth.uid())
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles where id = uid and role = 'admin');
$$;

create or replace function public.is_blocked_between(a uuid, b uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.blocks
    where (blocker_id = a and blocked_id = b)
       or (blocker_id = b and blocked_id = a)
  );
$$;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.get_or_create_tag(p_name text)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  v_slug text;
  v_id   uuid;
begin
  v_slug := lower(regexp_replace(trim(p_name), '[^a-z0-9]+', '-', 'gi'));
  v_slug := trim(both '-' from v_slug);
  if v_slug = '' then raise exception 'invalid tag name'; end if;

  select id into v_id from public.tags where slug = v_slug;
  if v_id is null then
    insert into public.tags (name, slug) values (trim(p_name), v_slug)
    on conflict (slug) do update set name = excluded.name
    returning id into v_id;
  end if;
  return v_id;
end;
$$;