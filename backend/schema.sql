create extension if not exists pgcrypto;

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) between 3 and 320),
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  trek_name text not null check (char_length(trek_name) between 2 and 160),
  start_date date not null,
  travelers integer not null check (travelers between 1 and 20),
  addons text[] not null default '{}',
  customer_name text not null check (char_length(customer_name) between 2 and 160),
  customer_email text not null check (char_length(customer_email) between 3 and 320),
  customer_phone text not null check (char_length(customer_phone) between 5 and 40),
  message text not null default '' check (char_length(message) <= 3000),
  grand_total integer not null check (grand_total >= 0),
  payment_method text not null check (payment_method in ('deposit', 'full')),
  deposit_amount integer not null check (deposit_amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);
