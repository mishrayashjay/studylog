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
  duration integer not null, -- Duration in seconds
  notes text,
  timestamp timestamp with time zone default now() not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.study_sessions enable row level security;

-- Profiles Policies
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

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
