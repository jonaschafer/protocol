# Data Mapping: Master Plan → Database → App

This document explains how data flows from your `MASTER_PLAN_27WEEKS_COMPLETE.md` file into your Supabase database and then into your app.

## Overview

Your training plan is structured hierarchically:
- **Training Plan** (1 plan: Wy'East Trailfest 50M)
  - **Training Phases** (3 phases: Foundation, Durability, Specificity)
    - **Weekly Plans** (27 weeks)
      - **Daily Workouts** (7 days per week = 189 total workouts)

---

## Database Schema

### 1. `training_plans` Table
**Purpose:** Top-level container for the entire training plan

| Column | Type | Source (from Master Plan) | Example |
|--------|------|---------------------------|---------|
| `plan_name` | TEXT | Line 1: Plan title | "Wy'East Trailfest 50M Training Plan" |
| `goal_race` | TEXT | Line 2: Goal race | "Wy'East Trailfest 50M - August 15, 2026" |
| `goal_distance` | TEXT | Line 3: Distance | "50.1 miles" |
| `goal_elevation` | TEXT | Line 4: Elevation | "10,650' gain / 8,800' loss" |
| `start_date` | DATE | Line 5: Training start | "2026-02-02" |
| `end_date` | DATE | Line 5: Race date | "2026-08-15" |
| `total_weeks` | INTEGER | Line 6: Duration | 27 |
| `current_week` | INTEGER | Manual/calculated | 1 |
| `is_active` | BOOLEAN | Manual | true |

**Extracted from:** Plan Overview section (lines 1-43)

---

### 2. `training_phases` Table
**Purpose:** Organize weeks into training phases

| Column | Type | Source (from Master Plan) | Example |
|--------|------|---------------------------|---------|
| `plan_id` | UUID | Foreign key | Links to training_plans |
| `name` | TEXT | Phase headers | "Foundation", "Durability", "Specificity" |
| `week_start` | INTEGER | Phase overview | 1, 10, 21 |
| `week_end` | INTEGER | Phase overview | 9, 20, 27 |
| `start_date` | DATE | Phase dates | "2026-02-02", "2026-04-06", "2026-06-22" |
| `end_date` | DATE | Phase dates | "2026-04-05", "2026-06-21", "2026-08-09" |
| `focus` | TEXT | Phase description | "Build 12mpw → 20mpw, daily PT exercises" |

**Extracted from:**
- **Foundation:** Lines 14-19
- **Durability:** Lines 21-30
- **Specificity:** Lines 32-38

---

### 3. `weekly_plans` Table
**Purpose:** Store weekly training targets and themes

| Column | Type | Source (from Master Plan) | Example |
|--------|------|---------------------------|---------|
| `plan_id` | UUID | Foreign key | Links to training_plans |
| `phase_id` | UUID | Foreign key | Links to training_phases |
| `week_number` | INTEGER | Week header | 1, 2, 3... 27 |
| `start_date` | DATE | Calculated from plan start | "2026-02-02" (Week 1) |
| `end_date` | DATE | Calculated (start + 6 days) | "2026-02-08" (Week 1) |
| `week_theme` | TEXT | Week "Focus" or "Key Theme" | "Base building, establish PT habit" |
| `target_miles` | DECIMAL | Week "Volume" | 12, 13, 14... |
| `target_vert` | INTEGER | Week "Volume" | 1800, 2000, 2200... |
| `notes` | TEXT | Week description | Same as week_theme |

**Extracted from:** Each week section header (e.g., "## Week 1: February 2-8, 2026")

**Example Week 1:**
```markdown
## Week 1: February 2-8, 2026
**Focus:** Base building, establish PT habit  
**Volume:** 12 miles, 1800ft vert  
**Key Theme:** Start conservative, perfect form
```

Maps to:
- `week_number`: 1
- `start_date`: 2026-02-02
- `end_date`: 2026-02-08
- `week_theme`: "Base building, establish PT habit"
- `target_miles`: 12
- `target_vert`: 1800

---

### 4. `daily_workouts` Table
**Purpose:** Store individual day workouts with all details

| Column | Type | Source (from Master Plan) | Example |
|--------|------|---------------------------|---------|
| `weekly_plan_id` | UUID | Foreign key | Links to weekly_plans |
| `date` | DATE | Day header | "2026-02-02" |
| `day_of_week` | TEXT | Day name | "Monday", "Tuesday" |
| `workout_type` | TEXT | Parsed from content | "rest", "run", "strength", "rowing", "run+strength" |
| `run_distance_miles` | DECIMAL | "**Run:** X miles" | 4, 3, 6... |
| `run_vert_feet` | INTEGER | "X ft vert" | 1000, 200, 400... |
| `run_effort` | TEXT | "**Effort:**" | "Conversational (Z2, RPE 6)" |
| `run_notes` | TEXT | Route, notes, fuel | "Route: Your usual Tuesday group route" |
| `strength_session_type` | TEXT | "**Strength - Heavy Day 1**" | "Heavy Day 1", "Heavy Day 2" |
| `strength_exercises` | JSONB | Parsed exercises | Array of exercise objects |
| `rowing_duration_minutes` | INTEGER | "**Row:** X min" | 30, 45, 50... |
| `rowing_effort` | TEXT | "Z2", "RPE X" | "Z2", "steady state" |
| `workout_notes` | TEXT | All other notes | PT exercises, nutrition, etc. |

**Extracted from:** Individual day sections (e.g., "### Monday, February 2")

**Example Day (Tuesday, February 3):**
```markdown
### Tuesday, February 3
- **Group Run:** 4 miles, 1000ft vert
- **Effort:** Conversational (Z2, RPE 6)
- **Route:** Your usual Tuesday group route (shorter distance)
- **Post-run:**
  - **Strength - Heavy Day 1:** (30min)
    - Trap bar deadlift 3x6 (55%, 65%, 70%)
    - Bulgarian split squat 3x6 each (bodyweight only)
```

Maps to:
- `workout_type`: "run+strength"
- `run_distance_miles`: 4
- `run_vert_feet`: 1000
- `run_effort`: "Conversational (Z2, RPE 6)"
- `run_notes`: "Route: Your usual Tuesday group route (shorter distance)"
- `strength_session_type`: "Heavy Day 1"
- `strength_exercises`: `[{"name": "Trap bar deadlift", "sets": 3, "reps": 6, "notes": "55%, 65%, 70%"}, ...]`

---

## Data Extraction Patterns

### Running Workouts
The seed script looks for these patterns:
- `**Group Run:** X miles, Y ft vert`
- `**Long Run:** X miles, Y ft vert`
- `**Easy Run:** X miles, Y ft vert`
- `**Hill Workout:** X miles, Y ft vert`
- `**Tempo Workout:** X miles, Y ft vert`
- `**VO2 Max Workout:** X miles, Y ft vert`

### Strength Workouts
- `**Strength - Heavy Day 1:**` or `**Strength - Heavy Day 2:**`
- Exercises parsed from bullet points:
  - `Trap bar deadlift 3x6 (55%, 65%, 70%)`
  - `Bulgarian split squat 3x6 each (bodyweight only)`

### Rowing Workouts
- `**Rowing:** X min` or `X min row`
- Effort extracted: `Z2`, `RPE X`, `steady state`

### Rest Days
- `**Rest Day**` → `workout_type: "rest"`

### PT Foundation (Weeks 1-9)
- Automatically added to `workout_notes` for all days in Foundation phase
- Full PT routine from lines 92-171

---

## App Data Flow

### How Your App Should Use This Data

1. **Phase Overview Page** (`/phases`)
   - Query: `fetchPhases()` from `lib/supabase-data.ts`
   - Displays: All phases with weeks, dates, totals

2. **Week View** (`/week`)
   - Query: `fetchWeek(weekNumber)`
   - Displays: Week theme, targets, all 7 daily workouts

3. **Day View** (`/day/[dayName]`)
   - Query: `fetchDayByWeekAndDay(weekNumber, dayOfWeek)`
   - Displays: Full workout details, exercises, notes

4. **Exercise View** (`/exercises/[exerciseName]`)
   - Query: Filter `daily_workouts` by `strength_exercises` JSONB
   - Displays: Exercise history across all weeks

---

## Current App Data Structure (for reference)

Your app currently uses `dayData.ts` with this structure:
```typescript
{
  date: string;
  dayNumber: number;
  category: string;
  runData?: {
    variant?: 'run' | 'row';
    helper?: string;
    miles: number | string;
    vert?: number | string;
    zone?: number | string;
    rpe?: string;
    route?: string;
    // ...
  };
  exercises: Array<{
    id: string;
    exerciseName: string;
    sets?: number;
    reps?: number | string;
    weight?: string;
    exerciseNote?: string;
    // ...
  }>;
}
```

### Mapping Database → App Format

You'll need to transform database data to match your app's expected format:

```typescript
// Database → App transformation
const transformWorkout = (dbWorkout: DailyWorkout) => {
  return {
    date: dbWorkout.date,
    dayNumber: calculateDayNumber(dbWorkout.date),
    category: dbWorkout.weekly_plans.training_phases.name,
    runData: dbWorkout.workout_type.includes('run') ? {
      variant: dbWorkout.rowing_duration_minutes ? 'row' : 'run',
      miles: dbWorkout.run_distance_miles || dbWorkout.rowing_duration_minutes,
      vert: dbWorkout.run_vert_feet,
      rpe: extractRPE(dbWorkout.run_effort),
      route: extractRoute(dbWorkout.run_notes),
    } : undefined,
    exercises: dbWorkout.strength_exercises ? 
      JSON.parse(dbWorkout.strength_exercises).map(ex => ({
        id: slugify(ex.name),
        exerciseName: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        exerciseNote: ex.notes,
      })) : []
  }
}
```

---

## Next Steps

1. ✅ **Fixed:** Column name mismatches (`start_date` vs `week_start_date`)
2. ✅ **Fixed:** Seed script path to use `MASTER_PLAN_27WEEKS_COMPLETE.md`
3. **TODO:** Run migrations in Supabase SQL editor (if not already done)
4. **TODO:** Run seed script: `npm run seed`
5. **TODO:** Update app components to use Supabase data instead of `dayData.ts`
6. **TODO:** Create transformation functions to map database format → app format

---

## Running Migrations

If you haven't run the migrations yet, execute these in order in your Supabase SQL editor:

1. `supabase/migrations/001_create_training_plan_tables.sql`
2. `supabase/migrations/002_add_training_plan_fields.sql` (if exists)
3. `supabase/migrations/003_fix_phase_id_column.sql`
4. `supabase/migrations/004_fix_weekly_plans_columns.sql`
5. `supabase/migrations/005_fix_phase_column.sql`

Then run: `npm run seed`
