-- This migration is now redundant as all fields are included in 001_create_training_plan_tables.sql
-- Keeping this file for reference but it's safe to skip if 001 has been run

-- Add missing fields to training_plans table (if not already added in 001)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'training_plans' AND column_name = 'current_week') THEN
    ALTER TABLE training_plans ADD COLUMN current_week INTEGER DEFAULT 1;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'training_plans' AND column_name = 'is_active') THEN
    ALTER TABLE training_plans ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Add missing fields to daily_workouts table (if not already added in 001)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'daily_workouts' AND column_name = 'run_distance_miles') THEN
    ALTER TABLE daily_workouts ADD COLUMN run_distance_miles DECIMAL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'daily_workouts' AND column_name = 'run_vert_feet') THEN
    ALTER TABLE daily_workouts ADD COLUMN run_vert_feet INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'daily_workouts' AND column_name = 'run_effort') THEN
    ALTER TABLE daily_workouts ADD COLUMN run_effort TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'daily_workouts' AND column_name = 'run_notes') THEN
    ALTER TABLE daily_workouts ADD COLUMN run_notes TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'daily_workouts' AND column_name = 'strength_session_type') THEN
    ALTER TABLE daily_workouts ADD COLUMN strength_session_type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'daily_workouts' AND column_name = 'strength_exercises') THEN
    ALTER TABLE daily_workouts ADD COLUMN strength_exercises JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'daily_workouts' AND column_name = 'rowing_duration_minutes') THEN
    ALTER TABLE daily_workouts ADD COLUMN rowing_duration_minutes INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'daily_workouts' AND column_name = 'rowing_effort') THEN
    ALTER TABLE daily_workouts ADD COLUMN rowing_effort TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'daily_workouts' AND column_name = 'workout_notes') THEN
    ALTER TABLE daily_workouts ADD COLUMN workout_notes TEXT;
  END IF;
END $$;

-- Update workout_type check constraint to include all types (if constraint exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'daily_workouts_workout_type_check'
  ) THEN
    ALTER TABLE daily_workouts DROP CONSTRAINT daily_workouts_workout_type_check;
  END IF;
  
  ALTER TABLE daily_workouts
  ADD CONSTRAINT daily_workouts_workout_type_check 
  CHECK (workout_type IN ('rest', 'run', 'strength', 'rowing', 'run+strength'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
