create table if not exists public.download_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'download_page',
  created_at timestamptz not null default now(),
  unique (email)
);

alter table public.download_waitlist enable row level security;

create policy "Anyone can submit download waitlist email"
on public.download_waitlist
for insert
to anon, authenticated
with check (
  email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
);

grant insert on public.download_waitlist to anon, authenticated;
