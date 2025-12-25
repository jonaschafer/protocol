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
