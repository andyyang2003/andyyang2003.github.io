-- Run this in Supabase SQL Editor.

create table if not exists public.saved_calendars (
  code_hash text primary key,
  calendar_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.saved_calendars enable row level security;

-- The browser never accesses this table directly.
revoke all on table public.saved_calendars from anon, authenticated;

-- The deployed Edge Function uses Supabase's server-side service role.
