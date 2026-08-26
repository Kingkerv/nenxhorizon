-- ============================================================
-- NENXHORIZON — database setup
-- ------------------------------------------------------------
-- Copy this WHOLE file, paste it into the Supabase SQL Editor,
-- and press Run. You only ever do this once.
-- ============================================================

create table if not exists public.players (
  "userId"       bigint       primary key,   -- Roblox UserId. Primary key = the same
                                             -- player can never be written twice.
  "username"     text         not null,
  "displayName"  text,
  "firstJoinAt"  timestamptz  not null default now(),

  -- Room to grow. The registry page shows these automatically
  -- as soon as they start having values in them, so nothing on
  -- the website has to be rebuilt later.
  "totalPower"   bigint,
  "level"        integer,
  "nenRank"      text
);

-- Makes "newest souls first" fast even with a hundred thousand rows.
create index if not exists players_firstjoinat_idx
  on public.players ("firstJoinAt" desc);

-- ============================================================
-- LOCK THE TABLE DOWN
-- ------------------------------------------------------------
-- Row Level Security ON with no policies means: nobody on the
-- public internet can read or write this table directly.
-- Only your website's server code can, because it uses the
-- service_role key, which is allowed to bypass RLS.
-- ============================================================
alter table public.players enable row level security;

-- ============================================================
-- LATER, IF YOU WANT PLAYER CARDS
-- ------------------------------------------------------------
-- To add a new column (say, a clan), run just this one line in
-- the SQL Editor. Nothing else needs changing on the database.
--
--   alter table public.players add column if not exists "clan" text;
--
-- Then tell the website chat the column name and it will add it
-- to the cards.
-- ============================================================
