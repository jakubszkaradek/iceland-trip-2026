-- Expenses table for Iceland Trip 2026
create table if not exists public.expenses (
  id text primary key default gen_random_uuid()::text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  "user" text not null,
  "desc" text not null,
  amount numeric not null,
  currency text not null default 'PLN',
  split text not null default 'all',
  category text default 'Inne',
  date text not null
);

-- Settings table for budget & currency rates
create table if not exists public.group_settings (
  key text primary key,
  value jsonb not null
);

-- Allow public access for trip group
alter table public.expenses enable row level security;
alter table public.group_settings enable row level security;

create policy "Allow all expenses access" on public.expenses for all using (true) with check (true);
create policy "Allow all settings access" on public.group_settings for all using (true) with check (true);

-- Insert initial group settings
insert into public.group_settings (key, value)
values 
  ('budget_per_person', '4500'::jsonb),
  ('isk_rate', '0.029'::jsonb)
on conflict (key) do nothing;
