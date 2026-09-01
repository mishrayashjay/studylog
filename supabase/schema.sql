-- Create profiles table linked to Supabase auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text
);

-- Create study_sessions table
create table public.study_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject text not null,
  section text,
  duration integer not null, -- Duration in seconds
  notes text,
  timestamp timestamp with time zone default now() not null
);

-- Migration for existing databases
alter table public.study_sessions add column if not exists section text;

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.study_sessions enable row level security;

-- Profiles Policies
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

-- Study Sessions Policies
create policy "Users can view their own sessions" on public.study_sessions
  for select using (auth.uid() = user_id);

create policy "Users can insert their own sessions" on public.study_sessions
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own sessions" on public.study_sessions
  for update using (auth.uid() = user_id);

create policy "Users can delete their own sessions" on public.study_sessions
  for delete using (auth.uid() = user_id);

-- Trigger to automatically create a profile after sign-up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create notes table
create table public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null default 'Untitled Note',
  content text not null default '',
  category text not null default 'General',
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable Row Level Security (RLS)
alter table public.notes enable row level security;

-- Notes Policies
create policy "Users can view their own notes" on public.notes
  for select using (auth.uid() = user_id);

create policy "Users can insert their own notes" on public.notes
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own notes" on public.notes
  for update using (auth.uid() = user_id);

create policy "Users can delete their own notes" on public.notes
  for delete using (auth.uid() = user_id);

-- Create section_notes table for per-section notes
create table if not exists public.section_notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  section_name text not null,
  content text default '' not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  unique (user_id, section_name)
);

-- Enable Row Level Security (RLS)
alter table public.section_notes enable row level security;

-- Section Notes Policies
create policy "Users can view their own section notes" on public.section_notes
  for select using (auth.uid() = user_id);

create policy "Users can insert their own section notes" on public.section_notes
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own section notes" on public.section_notes
  for update using (auth.uid() = user_id);

create policy "Users can delete their own section notes" on public.section_notes
  for delete using (auth.uid() = user_id);
