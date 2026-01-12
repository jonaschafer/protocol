-- Generated SQL for 27-Week Training Plan Seed
-- Review this SQL before executing
-- Generated: 2026-01-11T20:20:51.234Z

-- Step 1: Get or create v_plan_id
DO $$
DECLARE
  v_plan_id UUID;
  v_phase_foundation_id UUID;
  v_phase_durability_id UUID;
  v_phase_specificity_id UUID;
  v_weekly_plan_id UUID;
BEGIN
  -- Get or create training plan
  INSERT INTO training_plans (plan_name, goal_race, goal_distance, goal_elevation, start_date, end_date, total_weeks, current_week, is_active)
  VALUES ('Wy''East Trailfest 50M Training Plan', 'Wy''East Trailfest 50M - August 15, 2026', '50.1 miles', '10,650'' gain / 8,800'' loss', '2026-02-02', '2026-08-15', 27, 1, true)
  ON CONFLICT DO NOTHING;
  
  SELECT id INTO v_plan_id FROM training_plans WHERE plan_name = 'Wy''East Trailfest 50M Training Plan' LIMIT 1;
  
  -- Get or create phases
  INSERT INTO training_phases (plan_id, name, week_start, week_end, start_date, end_date, focus)
  VALUES 
    (v_plan_id, 'Foundation', 1, 9, '2026-02-02', '2026-04-05', 'Build 12mpw → 20mpw, daily PT exercises'),
    (v_plan_id, 'Durability', 10, 20, '2026-04-06', '2026-06-21', 'Build to 40mpw, progressive vert 6k-9k'),
    (v_plan_id, 'Specificity', 21, 27, '2026-06-22', '2026-08-09', 'Race-specific work, taper')
  ON CONFLICT DO NOTHING;
  
  SELECT id INTO v_phase_foundation_id FROM training_phases WHERE training_phases.plan_id = v_plan_id AND training_phases.name = 'Foundation' LIMIT 1;
  SELECT id INTO v_phase_durability_id FROM training_phases WHERE training_phases.plan_id = v_plan_id AND training_phases.name = 'Durability' LIMIT 1;
  SELECT id INTO v_phase_specificity_id FROM training_phases WHERE training_phases.plan_id = v_plan_id AND training_phases.name = 'Specificity' LIMIT 1;
  
  -- Now insert weeks and workouts
-- Phase: Foundation
INSERT INTO training_phases (plan_id, name, week_start, week_end, start_date, end_date, focus)
VALUES (v_plan_id, 'Foundation', 1, 9, '2026-02-02', '2026-04-05', 'Build 12mpw → 20mpw, daily PT exercises')
ON CONFLICT DO NOTHING;
-- Phase: Durability
INSERT INTO training_phases (plan_id, name, week_start, week_end, start_date, end_date, focus)
VALUES (v_plan_id, 'Durability', 10, 20, '2026-04-06', '2026-06-21', 'Build to 40mpw, progressive vert 6k-9k')
ON CONFLICT DO NOTHING;
-- Phase: Specificity
INSERT INTO training_phases (plan_id, name, week_start, week_end, start_date, end_date, focus)
VALUES (v_plan_id, 'Specificity', 21, 27, '2026-06-22', '2026-08-09', 'Race-specific work, taper')
ON CONFLICT DO NOTHING;

-- Week 1: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_foundation_id,
  1,
  '2026-02-02',
  '2026-02-08',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 1 LIMIT 1;
-- Monday, 2026-02-02
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-02',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-02-03
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-03',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-02-04
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-04',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-02-05
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-05',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-02-06
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-06',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-02-07
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-07',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-02-08
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-08',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 2: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_foundation_id,
  2,
  '2026-02-09',
  '2026-02-15',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 2 LIMIT 1;
-- Monday, 2026-02-09
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-09',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-02-10
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-10',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-02-11
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-11',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-02-12
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-12',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-02-13
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-13',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-02-14
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-14',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-02-15
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-15',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 3: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_foundation_id,
  3,
  '2026-02-16',
  '2026-02-22',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 3 LIMIT 1;
-- Monday, 2026-02-16
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-16',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-02-17
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-17',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-02-18
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-18',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-02-19
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-19',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-02-20
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-20',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-02-21
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-21',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-02-22
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-22',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 4: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_foundation_id,
  4,
  '2026-02-23',
  '2026-03-01',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 4 LIMIT 1;
-- Monday, 2026-02-23
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-23',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-02-24
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-24',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-02-25
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-25',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-02-26
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-26',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-02-27
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-27',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-02-28
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-02-28',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-03-01
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-01',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 5: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_foundation_id,
  5,
  '2026-03-02',
  '2026-03-08',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 5 LIMIT 1;
-- Monday, 2026-03-02
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-02',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-03-03
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-03',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-03-04
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-04',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-03-05
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-05',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-03-06
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-06',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-03-07
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-07',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-03-08
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-08',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 6: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_foundation_id,
  6,
  '2026-03-09',
  '2026-03-15',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 6 LIMIT 1;
-- Monday, 2026-03-09
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-09',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-03-10
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-10',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-03-11
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-11',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-03-12
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-12',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-03-13
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-13',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-03-14
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-14',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-03-15
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-15',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 7: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_foundation_id,
  7,
  '2026-03-16',
  '2026-03-22',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 7 LIMIT 1;
-- Monday, 2026-03-16
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-16',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-03-17
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-17',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-03-18
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-18',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-03-19
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-19',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-03-20
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-20',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-03-21
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-21',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-03-22
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-22',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 8: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_foundation_id,
  8,
  '2026-03-23',
  '2026-03-29',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 8 LIMIT 1;
-- Monday, 2026-03-23
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-23',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-03-24
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-24',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-03-25
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-25',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-03-26
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-26',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-03-27
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-27',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-03-28
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-28',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-03-29
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-29',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 9: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_foundation_id,
  9,
  '2026-03-30',
  '2026-04-05',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 9 LIMIT 1;
-- Monday, 2026-03-30
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-30',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-03-31
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-03-31',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-04-01
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-01',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-04-02
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-02',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-04-03
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-03',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-04-04
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-04',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-04-05
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-05',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'PT FOUNDATION PROGRAM (20-25 minutes daily):

Hip Flexor Strengthening:
  • Seated Banded Hip Flexor March - 3x15-20 each leg
  • Psoas Plank - 3x30sec
  • Hip Marches - 2x15 each leg

Adductor Strengthening:
  • Side Plank Clam Raise - 2x15 each side
  • Side-Lying Adduction - 3x15 each leg (Priority)
  • Copenhagen Plank - 3x20sec each side (Priority)

Abductor Maintenance:
  • Monster Walks - 3 sets of 18ft (one direction)
  • Side Walks with Band - 3 sets of 9ft each direction
  • Fonda (Fire hydrants) - 3x15 each side
  • Single-Leg Balance Eyes Closed - 3x30sec each leg

Glutes & Posterior Chain:
  • Single-Leg Glute Bridge with Weight - 4x8 each leg
  • Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)

Knee & ITB Protection:
  • Wall Sit - 3x30sec (progress to 3x60sec by Week 9)
  • Step Downs - 3x15 each leg

'
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 10: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_durability_id,
  10,
  '2026-04-06',
  '2026-04-12',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 10 LIMIT 1;
-- Monday, 2026-04-06
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-06',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-04-07
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-07',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-04-08
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-08',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-04-09
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-09',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-04-10
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-10',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-04-11
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-11',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-04-12
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-12',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 11: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_durability_id,
  11,
  '2026-04-13',
  '2026-04-19',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 11 LIMIT 1;
-- Monday, 2026-04-13
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-13',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-04-14
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-14',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-04-15
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-15',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-04-16
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-16',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-04-17
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-17',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-04-18
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-18',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-04-19
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-19',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 12: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_durability_id,
  12,
  '2026-04-20',
  '2026-04-26',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 12 LIMIT 1;
-- Monday, 2026-04-20
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-20',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-04-21
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-21',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-04-22
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-22',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-04-23
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-23',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-04-24
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-24',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-04-25
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-25',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-04-26
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-26',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 13: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_durability_id,
  13,
  '2026-04-27',
  '2026-05-03',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 13 LIMIT 1;
-- Monday, 2026-04-27
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-27',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-04-28
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-28',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-04-29
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-29',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-04-30
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-04-30',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-05-01
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-01',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-05-02
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-02',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-05-03
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-03',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 14: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_durability_id,
  14,
  '2026-05-04',
  '2026-05-10',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 14 LIMIT 1;
-- Monday, 2026-05-04
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-04',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-05-05
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-05',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-05-06
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-06',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-05-07
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-07',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-05-08
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-08',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-05-09
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-09',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-05-10
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-10',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 15: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_durability_id,
  15,
  '2026-05-11',
  '2026-05-17',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 15 LIMIT 1;
-- Monday, 2026-05-11
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-11',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-05-12
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-12',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-05-13
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-13',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-05-14
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-14',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-05-15
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-15',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-05-16
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-16',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-05-17
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-17',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 16: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_durability_id,
  16,
  '2026-05-18',
  '2026-05-24',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 16 LIMIT 1;
-- Monday, 2026-05-18
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-18',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-05-19
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-19',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-05-20
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-20',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-05-21
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-21',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-05-22
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-22',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-05-23
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-23',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-05-24
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-24',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 17: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_durability_id,
  17,
  '2026-05-25',
  '2026-05-31',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 17 LIMIT 1;
-- Monday, 2026-05-25
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-25',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-05-26
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-26',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-05-27
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-27',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-05-28
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-28',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-05-29
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-29',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-05-30
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-30',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-05-31
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-05-31',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 18: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_durability_id,
  18,
  '2026-06-01',
  '2026-06-07',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 18 LIMIT 1;
-- Monday, 2026-06-01
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-01',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-06-02
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-02',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-06-03
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-03',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-06-04
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-04',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-06-05
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-05',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-06-06
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-06',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-06-07
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-07',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 19: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_durability_id,
  19,
  '2026-06-08',
  '2026-06-14',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 19 LIMIT 1;
-- Monday, 2026-06-08
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-08',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-06-09
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-09',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-06-10
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-10',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-06-11
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-11',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-06-12
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-12',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-06-13
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-13',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-06-14
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-14',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 20: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_durability_id,
  20,
  '2026-06-15',
  '2026-06-21',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 20 LIMIT 1;
-- Monday, 2026-06-15
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-15',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-06-16
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-16',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-06-17
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-17',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-06-18
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-18',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-06-19
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-19',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-06-20
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-20',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-06-21
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-21',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 21: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_specificity_id,
  21,
  '2026-06-22',
  '2026-06-28',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 21 LIMIT 1;
-- Monday, 2026-06-22
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-22',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-06-23
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-23',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-06-24
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-24',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-06-25
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-25',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-06-26
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-26',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-06-27
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-27',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-06-28
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-28',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 22: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_specificity_id,
  22,
  '2026-06-29',
  '2026-07-05',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 22 LIMIT 1;
-- Monday, 2026-06-29
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-29',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-06-30
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-06-30',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-07-01
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-01',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-07-02
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-02',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-07-03
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-03',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-07-04
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-04',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-07-05
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-05',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 23: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_specificity_id,
  23,
  '2026-07-06',
  '2026-07-12',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 23 LIMIT 1;
-- Monday, 2026-07-06
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-06',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-07-07
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-07',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-07-08
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-08',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-07-09
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-09',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-07-10
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-10',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-07-11
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-11',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-07-12
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-12',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 24: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_specificity_id,
  24,
  '2026-07-13',
  '2026-07-19',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 24 LIMIT 1;

-- Week 25: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_specificity_id,
  25,
  '2026-07-20',
  '2026-07-26',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 25 LIMIT 1;
-- Monday, 2026-07-20
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-20',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-07-21
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-21',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-07-22
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-22',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-07-23
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-23',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-07-24
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-24',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-07-25
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-25',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-07-26
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-26',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 26: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_specificity_id,
  26,
  '2026-07-27',
  '2026-08-02',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 26 LIMIT 1;
-- Monday, 2026-07-27
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-27',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-07-28
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-28',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-07-29
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-29',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-07-30
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-30',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-07-31
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-07-31',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-08-01
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-08-01',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-08-02
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-08-02',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;

-- Week 27: No theme
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  v_phase_specificity_id,
  27,
  '2026-08-03',
  '2026-08-09',
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = 27 LIMIT 1;
-- Monday, 2026-08-03
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-08-03',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-08-04
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-08-04',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-08-05
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-08-05',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-08-06
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-08-06',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-08-07
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-08-07',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-08-08
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-08-08',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Sunday, 2026-08-09
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-08-09',
  'Sunday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Monday, 2026-08-03
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-08-03',
  'Monday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Tuesday, 2026-08-04
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-08-04',
  'Tuesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Wednesday, 2026-08-05
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-08-05',
  'Wednesday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Thursday, 2026-08-06
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-08-06',
  'Thursday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Friday, 2026-08-07
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-08-07',
  'Friday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
-- Saturday, 2026-08-08
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '2026-08-08',
  'Saturday',
  'rest',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;
END $$;