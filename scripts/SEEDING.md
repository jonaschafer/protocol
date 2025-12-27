# Training Plan Seeding

## Overview

The `seed-training-plan.ts` script populates your Supabase database with the Wy'East Wonder 50M training plan structure.

## What Gets Created

### Current (Week 1 Only)
- ✅ 1 training plan record (plan metadata, race goal, dates)
- ✅ 3 training phase records (Foundation, Durability, Specificity)
- ✅ 1 weekly plan record (Week 1)
- ✅ 7 daily workout records (Week 1 workouts)

### Coming Soon
- 📅 Weeks 2-36 (after providing week data)

## Database Schema Required

Make sure these tables exist in Supabase:

```sql
-- Training Plans
CREATE TABLE training_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_name TEXT NOT NULL,
  goal_race TEXT NOT NULL,
  goal_distance TEXT,
  goal_elevation TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_weeks INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training Phases
CREATE TABLE training_phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES training_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (name IN ('Foundation', 'Durability', 'Specificity')),
  week_start INTEGER NOT NULL,
  week_end INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  focus TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly Plans
CREATE TABLE weekly_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES training_plans(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES training_phases(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  week_theme TEXT,
  target_miles DECIMAL,
  target_vert INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plan_id, week_number)
);

-- Daily Workouts
CREATE TABLE daily_workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  weekly_plan_id UUID REFERENCES weekly_plans(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  day_of_week TEXT NOT NULL,
  workout_type TEXT NOT NULL CHECK (workout_type IN ('rest', 'run', 'strength', 'rowing')),
  workout_name TEXT,
  description TEXT,
  target_distance_miles DECIMAL,
  target_vert_feet INTEGER,
  target_duration_minutes INTEGER,
  effort_guidance TEXT,
  pace_guidance TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(weekly_plan_id, date)
);
```

## Usage

### Run the seeding script:

```bash
npm run seed:plan
```

### Expected Output:

```
🌲 Wy'East Wonder 50M Training Plan - Database Seeding

============================================================

✅ Environment variables loaded successfully

🏃 Seeding Training Plan

✅ Created training plan: Wy'East Wonder 50M Training Plan
   ID: abc-123-def
   Duration: 2026-01-05 to 2026-09-07
   Total weeks: 36

📅 Seeding Training Phases

✅ Created phase: Foundation
   Weeks 1-12
   2026-01-05 to 2026-03-29
   Focus: Build 18mpw → 40mpw, tissue adaptation, PT exercises daily

✅ Created phase: Durability
   Weeks 13-28
   2026-03-30 to 2026-07-19
   Focus: Hold 40-50mpw, progressive vert 6k-9k, block periodization

✅ Created phase: Specificity
   Weeks 29-36
   2026-07-20 to 2026-09-07
   Focus: Race-specific vert, back-to-back loading, taper

📆 Seeding Week 1

✅ Created Week 1 plan
   Theme: Start conservative, establish PT habit
   Target: 27 miles, 2200 ft vert

📝 Seeding Daily Workouts for Week 1

✅ Monday (2026-01-05): Rest Day + PT
✅ Tuesday (2026-01-06): Tuesday Group Run
   6 miles, 1500 ft vert
   Effort: Z2, RPE 6-7, conversational

✅ Wednesday (2026-01-07): Easy Run
   4 miles, 0 ft vert
   Effort: Z2, RPE 5-6

✅ Thursday (2026-01-08): Easy Run
   5 miles, 300 ft vert
   Effort: Z2, RPE 5-6

✅ Friday (2026-01-09): Rest Day + PT
✅ Saturday (2026-01-10): Long Run
   8 miles, 400 ft vert
   Effort: Z2, RPE 6

✅ Sunday (2026-01-11): Easy Run
   4 miles, 0 ft vert
   Effort: Z2, RPE 5

✅ Created 7 daily workouts

============================================================

🎉 Seeding Complete!

Summary:
  ✅ 1 training plan
  ✅ 3 training phases
  ✅ 1 weekly plan (Week 1)
  ✅ 7 daily workouts

============================================================

💡 Next steps:
  1. Check data in Supabase dashboard
  2. Provide WEEK-02 through WEEK-36 data
  3. Re-run script to seed remaining weeks
```

## Idempotency

The script is safe to run multiple times:
- ✅ Checks if plan already exists before inserting
- ✅ Checks if phases already exist
- ✅ Checks if Week 1 already exists
- ✅ Checks if daily workouts already exist
- ✅ Will skip existing records and only insert missing data

## Adding More Weeks

To add weeks 2-36, update the script with additional week data:

1. Create `WEEK_N_PLAN` objects with:
   - week_number, start_date, end_date
   - week_theme, target_miles, target_vert

2. Create `WEEK_N_WORKOUTS` arrays with daily workout details

3. Add `seedWeekN()` functions following the Week 1 pattern

4. Call them in `main()` function

## Troubleshooting

### Missing environment variables
Make sure `.env.local` exists with:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Permission errors
The script uses the anon key. If you get permission errors, you may need to:
1. Disable RLS on these tables temporarily, OR
2. Add service role key to `.env.local` and update script

### Duplicate key errors
The script checks for duplicates, but if you see errors:
- Check the UNIQUE constraints in your schema
- Clear the database and re-run: `DELETE FROM training_plans WHERE plan_name = 'Wy''East Wonder 50M Training Plan';`

## Next Steps

1. Run `npm run seed:plan` to populate Week 1
2. Verify data in Supabase dashboard
3. Provide remaining 35 weeks of data
4. Update script to seed all weeks
5. Build UI to display and track the plan
