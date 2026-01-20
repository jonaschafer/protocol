# Supabase Setup Instructions

## Step 1: Run Database Migrations

You need to run the following SQL migrations in your Supabase SQL Editor (Dashboard → SQL Editor):

### Migration 1: Create Base Tables
Run the contents of: `supabase/migrations/001_create_training_plan_tables.sql`

This creates:
- `training_plans` table
- `training_phases` table  
- `weekly_plans` table (with `phase_id` column)
- `daily_workouts` table
- All necessary indexes and RLS policies

### Migration 2: Fix Missing Column (if needed)
If you get an error about missing `phase_id` column, run: `supabase/migrations/003_fix_phase_id_column.sql`

Or manually run:
```sql
ALTER TABLE weekly_plans 
ADD COLUMN IF NOT EXISTS phase_id UUID REFERENCES training_phases(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_weekly_plans_phase_id ON weekly_plans(phase_id);
```

## Step 2: Set Environment Variables

Make sure your `.env.local` file contains:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 3: Run Seed Script

```bash
npm run seed
```

This will:
- Parse `MASTER_PLAN_27WEEKS.md`
- Create the training plan
- Create 3 phases (Foundation, Durability, Specificity)
- Create 27 weekly plans
- Create ~189 daily workouts

## Troubleshooting

### Error: "null value in column 'phase' violates not-null constraint"
**Solution**: Run migration `005_fix_phase_column.sql` in Supabase SQL Editor. This drops the old "phase" column and ensures "phase_id" exists.

Or manually run:
```sql
ALTER TABLE weekly_plans DROP COLUMN IF EXISTS phase;
ALTER TABLE weekly_plans 
ADD COLUMN IF NOT EXISTS phase_id UUID REFERENCES training_phases(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_weekly_plans_phase_id ON weekly_plans(phase_id);
```

### Error: "Could not find the 'phase_id' column"
**Solution**: Run migration `003_fix_phase_id_column.sql` or `005_fix_phase_column.sql` in Supabase SQL Editor

### Error: "Could not find the 'start_date' column"
**Solution**: Run migration `004_fix_weekly_plans_columns.sql` in Supabase SQL Editor

### Error: "relation does not exist"
**Solution**: Run migration `001_create_training_plan_tables.sql` first

### Error: "Master plan file not found"
**Solution**: Set `MASTER_PLAN_PATH` environment variable or ensure the file is at:
- `/Users/jonschafer/Dropbox/ jon/work/WHT_Git/protocol-local/cursor docs/MASTER_PLAN_27WEEKS.md`
