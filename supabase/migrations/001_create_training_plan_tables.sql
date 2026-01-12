-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Training Plans table
CREATE TABLE IF NOT EXISTS training_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_name TEXT NOT NULL,
  goal_race TEXT NOT NULL,
  goal_distance TEXT,
  goal_elevation TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_weeks INTEGER NOT NULL,
  current_week INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training Phases table
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

-- Weekly Plans table
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plan_id, week_number)
);

-- Daily Workouts table
CREATE TABLE IF NOT EXISTS daily_workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  weekly_plan_id UUID REFERENCES weekly_plans(id) ON DELETE CASCADE,
  "date" DATE NOT NULL,
  day_of_week TEXT NOT NULL,
  workout_type TEXT NOT NULL CHECK (workout_type IN ('rest', 'run', 'strength', 'rowing', 'run+strength')),
  workout_name TEXT,
  description TEXT,
  target_distance_miles DECIMAL,
  target_vert_feet INTEGER,
  target_duration_minutes INTEGER,
  effort_guidance TEXT,
  pace_guidance TEXT,
  notes TEXT,
  run_distance_miles DECIMAL,
  run_vert_feet INTEGER,
  run_effort TEXT,
  run_notes TEXT,
  strength_session_type TEXT,
  strength_exercises JSONB,
  rowing_duration_minutes INTEGER,
  rowing_effort TEXT,
  workout_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(weekly_plan_id, "date")
);

-- Create indexes for training plan tables
CREATE INDEX IF NOT EXISTS idx_training_phases_plan_id ON training_phases(plan_id);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_plan_id ON weekly_plans(plan_id);
CREATE INDEX IF NOT EXISTS idx_weekly_plans_phase_id ON weekly_plans(phase_id);
CREATE INDEX IF NOT EXISTS idx_daily_workouts_weekly_plan_id ON daily_workouts(weekly_plan_id);
CREATE INDEX IF NOT EXISTS idx_daily_workouts_date ON daily_workouts("date");

-- Enable Row Level Security for training plan tables
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_workouts ENABLE ROW LEVEL SECURITY;

-- Create policies for training plan tables (allow all for now)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'training_plans' AND policyname = 'Enable all access for training_plans'
  ) THEN
    CREATE POLICY "Enable all access for training_plans" ON training_plans FOR ALL USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'training_phases' AND policyname = 'Enable all access for training_phases'
  ) THEN
    CREATE POLICY "Enable all access for training_phases" ON training_phases FOR ALL USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'weekly_plans' AND policyname = 'Enable all access for weekly_plans'
  ) THEN
    CREATE POLICY "Enable all access for weekly_plans" ON weekly_plans FOR ALL USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'daily_workouts' AND policyname = 'Enable all access for daily_workouts'
  ) THEN
    CREATE POLICY "Enable all access for daily_workouts" ON daily_workouts FOR ALL USING (true);
  END IF;
END $$;
