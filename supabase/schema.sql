create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text,
  status text not null default 'new',
  score integer not null default 0,
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.leads enable row level security;

create policy "Public can insert leads"
on public.leads
for insert
to anon, authenticated
with check (true);

create policy "Authenticated users can read leads"
on public.leads
for select
to authenticated
using (true);
