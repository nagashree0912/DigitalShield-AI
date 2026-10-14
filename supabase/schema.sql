-- DigitalShield AI initial schema.
-- Review access requirements before production use. Keep RLS enabled.
create extension if not exists pgcrypto;

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  industry text not null default '',
  description text not null default '',
  official_social_urls text[] not null default '{}',
  official_app_ids text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references public.brands(id) on delete set null,
  input_type text not null check (input_type in ('url','message','payment','screenshot','qr')),
  input_value text not null,
  source text not null default 'user_submission',
  status text not null default 'submitted',
  verdict text not null default 'unverified',
  evidence jsonb not null default '[]'::jsonb,
  provider_status jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.findings (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references public.brands(id) on delete set null,
  scan_id uuid references public.scans(id) on delete set null,
  finding_type text not null,
  target text not null,
  risk_level text not null default 'unverified' check (risk_level in ('high','medium','low','official','unverified')),
  confidence numeric(5,2),
  evidence jsonb not null default '[]'::jsonb,
  source_name text,
  source_url text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references public.brands(id) on delete set null,
  title text not null,
  description text not null default '',
  status text not null default 'open' check (status in ('open','in_progress','resolved','false_positive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.brands enable row level security;
alter table public.scans enable row level security;
alter table public.findings enable row level security;
alter table public.cases enable row level security;

-- This starter API uses a server-side service-role key and must be protected by
-- authenticated API middleware before production. Never expose the service key to browsers.
-- Browser policies are intentionally not opened broadly here.


-- Workspace records created through the Add Item form.
create table if not exists public.workspace_items (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'Finding',
  name text not null,
  target text not null,
  risk text not null default 'Unverified'
    check (risk in ('Unverified','Low','Medium','High')),
  description text not null default '',
  evidence text not null default '',
  status text not null default 'Saved to Supabase',
  source text not null default 'User entered',
  created_at timestamptz not null default now()
);

alter table public.workspace_items enable row level security;
-- This starter accesses this table through the server-side service-role client.
-- Add authentication, ownership checks, and appropriate RLS policies before production.
