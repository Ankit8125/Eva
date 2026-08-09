create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null,
  avatar_url text,
  email_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;

grant select, update on table public.users to authenticated;

create or replace function public.sync_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (
    id,
    email,
    name,
    avatar_url,
    email_verified,
    created_at,
    updated_at
  )
  values (
    new.id,
    new.email,
    coalesce(new.profile ->> 'name', new.metadata ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.profile ->> 'avatar_url', new.metadata ->> 'avatar_url'),
    coalesce(new.email_verified, false),
    coalesce(new.created_at, now()),
    now()
  )
  on conflict (id) do update
  set
    email = excluded.email,
    name = excluded.name,
    avatar_url = excluded.avatar_url,
    email_verified = excluded.email_verified,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists sync_auth_user_profile on auth.users;

create trigger sync_auth_user_profile
after insert or update of email, email_verified, profile, metadata on auth.users
for each row execute function public.sync_auth_user_profile();

insert into public.users (
  id,
  email,
  name,
  avatar_url,
  email_verified,
  created_at,
  updated_at
)
select
  id,
  email,
  coalesce(profile ->> 'name', metadata ->> 'name', split_part(email, '@', 1)),
  coalesce(profile ->> 'avatar_url', metadata ->> 'avatar_url'),
  coalesce(email_verified, false),
  coalesce(created_at, now()),
  now()
from auth.users
where email is not null
on conflict (id) do update
set
  email = excluded.email,
  name = excluded.name,
  avatar_url = excluded.avatar_url,
  email_verified = excluded.email_verified,
  updated_at = now();

create policy "users_select_own"
on public.users
for select
to authenticated
using (auth.uid() = id);

create policy "users_update_own"
on public.users
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
