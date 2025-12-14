# Database Migration Instructions

## Summary of Changes

I've updated your Watch Utopia application to include **Year** and **Condition** fields for watches.

### Files Modified:

1. **WatchDetailsPage.jsx** - Added Year and Condition display in the product details grid
2. **SuperAdminProfilePage.jsx** - Added Year and Condition fields to the add/edit product form
3. **ProductEditPage.jsx** - Added Year and Condition fields to the product edit form

### Database Changes Required:

You need to run the SQL queries in `database_migrations.sql` to add the new columns to your database.

## How to Apply the Database Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor**
3. Open the file `database_migrations.sql` from your project
4. Copy the entire content
5. Paste it into the SQL Editor
6. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
supabase db reset # if you want to reset (WARNING: This will delete all data)
# OR
# Run the migration manually by executing the SQL file
```

## What the Migration Does

### 1. Adds New Columns

- `year` (INTEGER) - For the manufacturing/release year of the watch
- `condition` (TEXT) - For the condition (e.g., NEW, UNWORN, USED, EXCELLENT, MINT)

### 2. Sets Up Row Level Security (RLS)

The migration includes RLS policies that:

- Allow **everyone** (public) to READ products
- Allow only **super_admin** users to INSERT, UPDATE, and DELETE products

### 3. Adds Column Documentation

Includes SQL comments explaining what each column is for

## Testing After Migration

1. **Run the migration** in your Supabase SQL Editor
2. **Verify the columns exist** by running:
   ```sql
   SELECT column_name, data_type, is_nullable
   FROM information_schema.columns
   WHERE table_name = 'brands' AND column_name IN ('year', 'condition');
   ```
3. **Test in the app**:
   - Go to your Super Admin profile
   - Try adding a new product with Year and Condition
   - Try editing an existing product and adding Year and Condition
   - View a product detail page to see the Year and Condition displayed

## Field Usage Examples

### Year Field

- Format: Enter as a 4-digit number (e.g., 2025, 2024, 2023)
- Optional: Can be left empty if year is not applicable

### Condition Field

- Common values: NEW, UNWORN, USED, EXCELLENT, MINT, GOOD
- Format: Free text, but uppercase is recommended for consistency
- Optional: Can be left empty

## Notes

- Both fields are **optional** - you don't have to fill them in
- Existing products will have NULL values for year and condition (which is fine)
- The fields will only display on product detail pages if they have values
- Year accepts integers from 1900 to 2100
- Condition is free text, so you can use any description you want

## Troubleshooting

If you encounter any errors:

1. **Permission denied**: Make sure you're logged in as a super admin in Supabase
2. **Column already exists**: The migration uses `IF NOT EXISTS`, so it's safe to run multiple times
3. **RLS policy errors**: The migration drops existing policies with the same name before creating new ones

## Need Help?

If you run into issues, check:

- Your Supabase connection is active
- You have the correct permissions
- The `brands` table exists in your database
