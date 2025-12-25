// Protocol - A training protocol/program
export interface Protocol {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  created_at: string;
}

// Session - A scheduled workout session (e.g., Tuesday Strength)
export interface Session {
  id: string;
  protocol_id: string;
  day_of_week: number; // 0=Sunday, 1=Monday, etc.
  name: string;
  duration_minutes: number;
  session_type: 'main' | 'micro' | 'rest';
  created_at: string;
}

// SessionExercise - An exercise within a session template
export interface SessionExercise {
  id: string;
  session_id: string;
  exercise_name: string;
  sets: number;
  target_reps: string; // e.g., "8", "8-10", "30sec", "AMRAP"
  target_weight?: number;
  weight_unit?: 'lbs' | 'kg';
  equipment?: string;
  order_index: number;
  is_non_negotiable: boolean;
  injury_warning: boolean;
  notes?: string;
  created_at: string;
}

// ExerciseLog - Log of an exercise performed
export interface ExerciseLog {
  id: string;
  session_exercise_id: string;
  logged_at: string;
  sets_completed: number;
  reps_per_set: string[]; // e.g., ["8", "8", "7"] or ["14", "19"] for left/right
  weight_used?: number;
  weight_unit?: 'lbs' | 'kg';
  rpe?: number; // 1-10 scale
  notes?: string;
}

// View types for joined data
export interface SessionWithExercises extends Session {
  protocol: Protocol;
  exercises: SessionExercise[];
}

export interface SessionExerciseWithLogs extends SessionExercise {
  logs: ExerciseLog[];
}

// History view types

// Aggregated session with all exercise logs for history view
export interface SessionHistory {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  session: Session;
  protocol: Protocol;
  exercises: SessionExerciseWithLogs[];
  totalVolume: number; // calculated (weighted exercises only)
  duration: number; // in minutes
  completedExercises: number;
  totalExercises: number;
}

// Aggregated stats for history view
export interface HistoryStats {
  totalWorkouts: number; // total unique workout dates
  totalVolume: number; // all-time total volume (lbs)
  currentStreak: number; // consecutive days with workouts
  prCount: number; // number of personal records
}

// Personal record tracking
export interface PersonalRecord {
  exerciseName: string;
  type: 'weight' | 'reps' | 'volume';
  value: number;
  date: string;
  previousValue?: number;
}

// Exercise log with session context for progression view
export interface ExerciseLogWithContext extends ExerciseLog {
  session_exercise: SessionExercise;
  session: Session;
  date: string; // ISO date for grouping
}

// Data point for exercise progression chart
export interface ExerciseProgressPoint {
  date: string;
  weight?: number;
  reps: number[]; // array of reps per set
  volume: number;
  rpe?: number;
}

// Filter state for history view
export interface HistoryFilters {
  dateRange: 'week' | 'month' | 'quarter' | 'all';
  exerciseName: string | null; // null = all exercises
}

// Calf progress data point for chart
export interface CalfProgressData {
  date: string;
  leftReps: number;
  rightReps: number;
}

// Exercise library (imported from ExerciseDB)
export interface ExerciseLibrary {
  id: string;
  external_id: string; // ExerciseDB ID
  name: string;
  description?: string;
  body_parts: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  demo_file_path?: string; // Supabase Storage path to GIF
  instructions: string[];
  target_muscles: string[];
  secondary_muscles: string[];
  created_at: string;
  updated_at: string;
}
