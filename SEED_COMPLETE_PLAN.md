# Complete 27-Week Plan Seed - Review Guide

## ✅ What Was Done

1. **Created new seed script**: `scripts/seed-27week-complete.ts`
   - Parses `MASTER_PLAN_27WEEKS_COMPLETE.md` systematically
   - Supports dry-run mode to generate SQL for review
   - Maintains existing database schema

2. **Generated SQL file**: `seed-complete.sql`
   - Contains all INSERT statements for 27 weeks
   - Uses `ON CONFLICT` clauses for safe re-runs
   - Wrapped in a PostgreSQL DO block for transaction safety

## 📋 SQL File Review Checklist

Before executing the SQL, verify:

- [ ] **Training Plan**: Single plan with correct metadata
- [ ] **Training Phases**: 3 phases (Foundation, Durability, Specificity)
- [ ] **Weekly Plans**: All 27 weeks present (check for duplicates)
- [ ] **Daily Workouts**: ~189 workouts (7 days × 27 weeks)
- [ ] **Dates**: Start date is Feb 2, 2026; end date is Aug 15, 2026
- [ ] **Week Numbers**: Sequential 1-27
- [ ] **Phase Assignments**: 
  - Weeks 1-9 → Foundation
  - Weeks 10-20 → Durability  
  - Weeks 21-27 → Specificity

## ⚠️ Known Issues

1. **Week 24 appears twice** in the generated SQL
   - Check the markdown file for duplicate week 24 entries
   - The SQL will handle this with `ON CONFLICT` (last one wins)
   - Consider removing duplicate before executing

## 🚀 Execution Steps

### Option 1: Review SQL First (Recommended)

1. **Review the SQL file**:
   ```bash
   # View the generated SQL
   cat seed-complete.sql
   # Or open in your editor
   ```

2. **Check for issues**:
   - Search for duplicate weeks
   - Verify all 27 weeks are present
   - Check that dates are correct

3. **Execute in Supabase**:
   - Open Supabase Dashboard → SQL Editor
   - Copy contents of `seed-complete.sql`
   - Paste and execute

### Option 2: Direct Seed (No SQL Review)

```bash
npm run seed:complete
```

This will:
- Parse the complete plan
- Insert directly into Supabase
- Show progress for each week
- Handle conflicts automatically

## 📊 What Gets Created

- **1 Training Plan**: Wy'East Trailfest 50M Training Plan
- **3 Training Phases**: Foundation (9 weeks), Durability (11 weeks), Specificity (7 weeks)
- **27 Weekly Plans**: One for each week with dates, mileage, vert
- **~189 Daily Workouts**: All 7 days × 27 weeks with:
  - Run data (distance, vert, effort, route)
  - Strength exercises (when applicable)
  - PT Foundation exercises (Weeks 1-9)
  - Rowing workouts (when applicable)
  - Workout notes and guidance

## 🔧 Schema Compatibility

The script maintains your existing schema:
- Uses `week_start_date` and `week_end_date` (not `start_date`/`end_date`)
- Uses `phase_id` (not `phase`)
- All existing columns preserved
- New data only, no schema changes

## 📝 NPM Scripts Added

```json
{
  "seed:complete": "tsx scripts/seed-27week-complete.ts",
  "seed:sql": "tsx scripts/seed-27week-complete.ts --dry-run --output=seed-complete.sql"
}
```

## 🐛 Troubleshooting

### If SQL has duplicate weeks:
- Check the markdown file for duplicate week headers
- The `ON CONFLICT` clause will update with the last value
- Consider manually removing duplicates from SQL before executing

### If dates are wrong:
- Verify the start date in the markdown (should be Feb 2, 2026)
- Check the `getWeekStartDate()` function calculates correctly

### If workouts are missing:
- Check the markdown parsing regex patterns
- Verify day headers are in format: `### Monday, Month Day`
- Check for typos in day names

## ✅ Next Steps

1. **Review** `seed-complete.sql` file
2. **Fix** any duplicate weeks if found
3. **Execute** SQL in Supabase SQL Editor
4. **Verify** data in Supabase dashboard
5. **Test** the app to see all 27 weeks
