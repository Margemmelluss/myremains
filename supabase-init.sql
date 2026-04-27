-- supabase-init.sql
-- Run this in Supabase SQL Editor to create the `tiles` table and RLS policies.

BEGIN;

-- 1) Create tiles table
CREATE TABLE IF NOT EXISTS public.tiles (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(50) NOT NULL,
  message VARCHAR(200) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2) Index for ordering
CREATE INDEX IF NOT EXISTS idx_tiles_created_at ON public.tiles(created_at DESC);

-- 3) Enable Row Level Security
ALTER TABLE public.tiles ENABLE ROW LEVEL SECURITY;

-- 4) Policy: allow public SELECT
CREATE POLICY IF NOT EXISTS "Allow public SELECT"
  ON public.tiles
  AS PERMISSIVE
  FOR SELECT
  TO public
  USING (true);

-- 5) Policy: allow public INSERT (with check)
CREATE POLICY IF NOT EXISTS "Allow public INSERT"
  ON public.tiles
  AS PERMISSIVE
  FOR INSERT
  TO public
  WITH CHECK (true);

COMMIT;

-- Notes:
-- Run this file in Supabase SQL Editor (SQL → New query) and press Run.
-- After running, go to Auth → Policies to verify the policies exist and RLS is enabled.
