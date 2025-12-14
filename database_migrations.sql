-- Migration to add 'year' and 'condition' columns to the brands table
-- Date: 2025-12-14

-- Add year column (integer for year like 2024, 2025, etc.)
ALTER TABLE brands
ADD COLUMN IF NOT EXISTS year INTEGER;

-- Add condition column (text for condition like 'NEW', 'UNWORN', 'USED', 'EXCELLENT', etc.)
ALTER TABLE brands
ADD COLUMN IF NOT EXISTS condition TEXT;

-- Add comments to the new columns
COMMENT ON COLUMN brands.year IS 'Manufacturing or release year of the watch';
COMMENT ON COLUMN brands.condition IS 'Condition of the watch (e.g., NEW, UNWORN, USED, EXCELLENT, MINT)';

-- Row Level Security (RLS) Policies
-- Note: If you already have RLS enabled on the brands table, these policies will extend it

-- Enable RLS on brands table (if not already enabled)
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all users to SELECT (read) products
DROP POLICY IF EXISTS "Allow public read access to brands" ON brands;
CREATE POLICY "Allow public read access to brands"
ON brands
FOR SELECT
TO public
USING (true);

-- Policy: Allow authenticated super admins to INSERT products
DROP POLICY IF EXISTS "Allow super admin insert on brands" ON brands;
CREATE POLICY "Allow super admin insert on brands"
ON brands
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role' = 'super_admin')
  OR
  (auth.jwt() -> 'user_metadata' ->> 'role' = 'super_admin')
);

-- Policy: Allow authenticated super admins to UPDATE products
DROP POLICY IF EXISTS "Allow super admin update on brands" ON brands;
CREATE POLICY "Allow super admin update on brands"
ON brands
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role' = 'super_admin')
  OR
  (auth.jwt() -> 'user_metadata' ->> 'role' = 'super_admin')
)
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role' = 'super_admin')
  OR
  (auth.jwt() -> 'user_metadata' ->> 'role' = 'super_admin')
);

-- Policy: Allow authenticated super admins to DELETE products
DROP POLICY IF EXISTS "Allow super admin delete on brands" ON brands;
CREATE POLICY "Allow super admin delete on brands"
ON brands
FOR DELETE
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role' = 'super_admin')
  OR
  (auth.jwt() -> 'user_metadata' ->> 'role' = 'super_admin')
);

-- Verification query - Run this after the migration to verify the columns were added
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'brands' AND column_name IN ('year', 'condition');
