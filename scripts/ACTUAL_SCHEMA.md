# Actual Database Schema

This document describes the **actual** database schema in Supabase, discovered through runtime inspection.

## Summary of Differences from TypeScript Types

The database schema differs significantly from the TypeScript types in `types/database.ts`. The TypeScript types represent an ideal schema, but the actual database uses different column names and structure.

## Actual Schema

### training_plans

```typescript
{
  id: UUID (PK)
  plan_name: TEXT
  goal_race: TEXT
  goal_distance: TEXT
  goal_elevation: TEXT
  start_date: DATE
  end_date: DATE
  total_weeks: INTEGER
  current_week: INTEGER (default: 1)
  is_active: BOOLEAN (default: true)
  created_at: TIMESTAMPTZ
  updated_at: TIMESTAMPTZ
}
```

**Extra columns vs TypeScript types:**
- `current_week` - tracks which week the user is currently on
- `is_active` - boolean flag for active plan

### training_phases

```typescript
{
  id: UUID (PK)
  plan_id: UUID (FK → training_plans.id)
  name: TEXT ('Foundation' | 'Durability' | 'Specificity')
  week_start: INTEGER
  week_end: INTEGER
  start_date: DATE
  end_date: DATE
  focus: TEXT
}
```

**Note:** This table exists but is NOT used as a foreign key in weekly_plans. It's metadata only.

### weekly_plans

```typescript
{
  id: UUID (PK)
  plan_id: UUID (FK → training_plans.id)
  week_number: INTEGER
  phase: TEXT ('Foundation' | 'Durability' | 'Specificity')  // NOT a foreign key!
  week_start_date: DATE (required)
  week_theme: TEXT (nullable)
  target_miles: DECIMAL (nullable)
  target_vert: INTEGER (nullable)
  notes: TEXT (nullable)
  end_date: DATE (nullable)
}
```

**Key differences from TypeScript types:**
- `phase` is a TEXT field, not `phase_id` UUID foreign key
- `week_start_date` instead of `start_date`
- `end_date` instead of `week_end_date`
- No `created_at` timestamp

### daily_workouts

```typescript
{
  id: UUID (PK)
  weekly_plan_id: UUID (FK → weekly_plans.id)
  workout_date: DATE (required)  // not "date"
  day_of_week: TEXT (required)
  workout_type: TEXT (required) ('rest' | 'run' | 'strength' | 'rowing')

  // Run-specific columns
  run_distance_miles: DECIMAL (nullable)
  run_vert_feet: INTEGER (nullable)
  run_effort: TEXT (nullable)
  run_rpe_target: INTEGER (nullable)
  run_route: TEXT (nullable)
  run_notes: TEXT (nullable)

  // Strength-specific columns
  strength_session_type: TEXT (nullable)
  strength_duration_minutes: INTEGER (nullable)
  strength_exercises: JSONB (nullable)

  // Rowing-specific columns
  rowing_duration_minutes: INTEGER (nullable)
  rowing_effort: TEXT (nullable)
  rowing_spm_target: INTEGER (nullable)

  // Nutrition
  pre_run_fuel: TEXT (nullable)
  during_run_nutrition: TEXT (nullable)

  // General notes
  workout_notes: TEXT (nullable)
}
```

**Key differences from TypeScript types:**
- `workout_date` instead of `date`
- No `workout_name` or `description` fields
- Uses type-specific columns (run_*, strength_*, rowing_*) instead of generic target_* fields
- `run_notes` used for workout name/description
- `workout_notes` for general notes
- No `target_distance_miles`, `target_vert_feet`, `effort_guidance`, `pace_guidance`

## Data Mapping Guide

When seeding data, map fields as follows:

### Weekly Plans

```typescript
// TypeScript type says:
{
  phase_id: uuid,
  start_date: date,
  week_end_date: date
}

// Actual database needs:
{
  phase: 'Foundation',  // TEXT value, not UUID
  week_start_date: '2026-01-05',  // renamed
  end_date: '2026-01-11'  // different name
}
```

### Daily Workouts (Run)

```typescript
// TypeScript type says:
{
  date: '2026-01-06',
  workout_name: 'Tuesday Group Run',
  description: 'Social run',
  target_distance_miles: 6,
  target_vert_feet: 1500,
  effort_guidance: 'Z2, RPE 6-7',
  pace_guidance: '10:00-10:30/mi',
  notes: 'Pre-run fuel notes'
}

// Actual database needs:
{
  workout_date: '2026-01-06',  // renamed
  run_distance_miles: 6,  // run_ prefix
  run_vert_feet: 1500,  // run_ prefix
  run_effort: 'Z2, RPE 6-7',  // run_ prefix, combined effort/pace
  run_notes: 'Tuesday Group Run - Social run',  // workout name goes here
  pre_run_fuel: 'Toast + jam',  // specific nutrition field
  workout_notes: 'General notes'  // general notes
}
```

## Scripts for Schema Discovery

### check:schema
```bash
npm run check:schema
```

Queries the database to show actual column names and sample data.

### test-insert.ts

Located at `scripts/test-insert.ts`, this script performs test inserts to discover required columns and constraints.

## Recommendations

1. **Update TypeScript types** in `types/database.ts` to match actual schema
2. **Document schema decisions** - why phase is TEXT instead of FK
3. **Consider migration** to align schema with types (if desired)
4. **Keep this doc updated** when schema changes

## Last Verified

Date: 2025-12-27
Script: seed-training-plan.ts v1.1 (with schema fixes)
Status: ✅ Seeding successful with actual schema
