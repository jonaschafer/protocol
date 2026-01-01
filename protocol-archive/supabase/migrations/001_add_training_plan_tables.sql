-- Migration: Add Running Plan Tables
-- This migration adds the schema for the 36-week training plan

-- Training Phases table (if not exists)
CREATE TABLE IF NOT EXISTS training_phases (
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

-- Weekly Plans table (if not exists)
CREATE TABLE IF NOT EXISTS weekly_plans (
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'weekly_plans_plan_id_week_number_key'
  ) THEN
    ALTER TABLE weekly_plans ADD CONSTRAINT weekly_plans_plan_id_week_number_key UNIQUE(plan_id, week_number);
  END IF;
END $$;

-- Daily Workouts table (if not exists)
CREATE TABLE IF NOT EXISTS daily_workouts (
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'daily_workouts_weekly_plan_id_date_key'
  ) THEN
    ALTER TABLE daily_workouts ADD CONSTRAINT daily_workouts_weekly_plan_id_date_key UNIQUE(weekly_plan_id, date);
  END IF;
END $$;

-- Create indexes for training plan tables
CREATE INDEX IF NOT EXISTS idx_training_phases_plan_id ON training_phases(plan_id);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_plan_id ON weekly_plans(plan_id);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_phase_id ON weekly_plans(phase_id);
CREATE INDEX IF NOT EXISTS idx_daily_workouts_weekly_plan_id ON daily_workouts(weekly_plan_id);
CREATE INDEX IF NOT EXISTS idx_daily_workouts_date ON daily_workouts(date);

-- Enable Row Level Security for training plan tables
ALTER TABLE training_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_workouts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable all access for training_phases" ON training_phases;
DROP POLICY IF EXISTS "Enable all access for weekly_plans" ON weekly_plans;
DROP POLICY IF EXISTS "Enable all access for daily_workouts" ON daily_workouts;

-- Create policies for training plan tables
CREATE POLICY "Enable all access for training_phases" ON training_phases FOR ALL USING (true);
CREATE POLICY "Enable all access for weekly_plans" ON weekly_plans FOR ALL USING (true);
CREATE POLICY "Enable all access for daily_workouts" ON daily_workouts FOR ALL USING (true);
