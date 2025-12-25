-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Protocols table
CREATE TABLE protocols (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  protocol_id UUID NOT NULL REFERENCES protocols(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('main', 'micro', 'rest')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session exercises table
CREATE TABLE session_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  sets INTEGER NOT NULL,
  target_reps TEXT NOT NULL,
  target_weight DECIMAL,
  weight_unit TEXT CHECK (weight_unit IN ('lbs', 'kg')),
  equipment TEXT,
  order_index INTEGER NOT NULL,
  is_non_negotiable BOOLEAN DEFAULT false,
  injury_warning BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercise logs table
CREATE TABLE exercise_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_exercise_id UUID NOT NULL REFERENCES session_exercises(id) ON DELETE CASCADE,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sets_completed INTEGER NOT NULL,
  reps_per_set TEXT[] NOT NULL,
  weight_used DECIMAL,
  weight_unit TEXT CHECK (weight_unit IN ('lbs', 'kg')),
  rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10),
  notes TEXT
);

-- Exercise library table (populated from ExerciseDB API)
CREATE TABLE exercise_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id TEXT UNIQUE, -- ExerciseDB ID
  name TEXT NOT NULL,
  description TEXT,
  body_parts TEXT[] NOT NULL DEFAULT '{}',
  equipment TEXT[] NOT NULL DEFAULT '{}',
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  demo_file_path TEXT, -- Supabase Storage path to GIF
  instructions TEXT[],
  target_muscles TEXT[],
  secondary_muscles TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast filtering
CREATE INDEX idx_exercise_library_body_parts ON exercise_library USING GIN (body_parts);
CREATE INDEX idx_exercise_library_equipment ON exercise_library USING GIN (equipment);
CREATE INDEX idx_exercise_library_difficulty ON exercise_library(difficulty);
CREATE INDEX idx_exercise_library_target_muscles ON exercise_library USING GIN (target_muscles);

-- Create full-text search index
CREATE INDEX idx_exercise_library_name_search ON exercise_library USING GIN (to_tsvector('english', name));
CREATE INDEX idx_exercise_library_description_search ON exercise_library USING GIN (to_tsvector('english', COALESCE(description, '')));

-- Create indexes for common queries
CREATE INDEX idx_sessions_protocol_id ON sessions(protocol_id);
CREATE INDEX idx_sessions_day_of_week ON sessions(day_of_week);
CREATE INDEX idx_session_exercises_session_id ON session_exercises(session_id);
CREATE INDEX idx_session_exercises_order ON session_exercises(session_id, order_index);
CREATE INDEX idx_exercise_logs_session_exercise_id ON exercise_logs(session_exercise_id);
CREATE INDEX idx_exercise_logs_logged_at ON exercise_logs(logged_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_library ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now - customize based on your auth setup)
CREATE POLICY "Enable all access for protocols" ON protocols FOR ALL USING (true);
CREATE POLICY "Enable all access for sessions" ON sessions FOR ALL USING (true);
CREATE POLICY "Enable all access for session_exercises" ON session_exercises FOR ALL USING (true);
CREATE POLICY "Enable all access for exercise_logs" ON exercise_logs FOR ALL USING (true);
CREATE POLICY "Enable read access for exercise_library" ON exercise_library FOR SELECT USING (true);
CREATE POLICY "Enable insert access for exercise_library" ON exercise_library FOR INSERT WITH CHECK (true);
