/**
 * TypeScript types for Running Plan Database Schema
 * Generated from Wy'East Wonder 50M Training Plan schema
 */

// ============================================================================
// ENUMS
// ============================================================================

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type PhaseName = 'Foundation' | 'Durability' | 'Specificity';

export type WorkoutType = 'rest' | 'run' | 'strength' | 'rowing';

export type EffortZone = 'Z1' | 'Z2' | 'Z3' | 'Tempo' | 'VO2' | 'Max';

export type StrengthSessionType = 'Heavy Day 1' | 'Heavy Day 2' | 'Maintenance' | 'PT Foundation';

export type RowingEffort = 'Z2' | 'Steady State' | 'Easy';

// ============================================================================
// HELPER TYPES
// ============================================================================

export interface Niggle {
  location: string;
  severity: number; // 1-10
  description: string;
}

export interface Sleep {
  hours: number;
  quality: number; // 1-10
}

export interface RunData {
  distance_miles?: number;
  vert_feet?: number;
  time_hours?: number;
  pace_per_mile?: string; // Format: "MM:SS"
  rpe?: number; // 1-10
  route?: string;
  effort_zone?: EffortZone;
}

export interface StrengthData {
  session_type?: StrengthSessionType;
  duration_minutes?: number;
  exercises_completed?: string[];
  notes?: string;
}

export interface RowingData {
  duration_minutes?: number;
  spm?: number; // Strokes per minute
  effort?: RowingEffort;
}

export interface StrengthExercise {
  name: string;
  sets?: number;
  reps?: number | string; // Can be number or "AMRAP"
  weight?: number;
  duration?: string; // e.g., "30sec"
  tempo?: string; // e.g., "5-count"
  note?: string;
  height?: string; // For step-ups
}

// ============================================================================
// DATABASE TABLE TYPES
// ============================================================================

export interface TrainingPlan {
  id: string;
  plan_name: string;
  goal_race: string;
  goal_distance: string;
  goal_elevation: string;
  start_date: string; // ISO date: YYYY-MM-DD
  end_date: string; // ISO date: YYYY-MM-DD
  total_weeks: number;
  created_at: string;
  updated_at: string;
}

export interface TrainingPhase {
  id: string;
  plan_id: string; // FK to training_plans
  name: PhaseName;
  week_start: number;
  week_end: number;
  start_date: string; // ISO date
  end_date: string; // ISO date
  focus: string;
  created_at: string;
}

export interface WeeklyPlan {
  id: string;
  plan_id: string; // FK to training_plans
  phase_id: string; // FK to training_phases
  week_number: number; // 1-36
  start_date: string; // ISO date
  end_date: string; // ISO date
  target_miles?: number;
  target_vert?: number;
  notes?: string;
  created_at: string;
}

export interface DailyWorkout {
  id: string;
  weekly_plan_id: string; // FK to weekly_plans
  date: string; // ISO date: YYYY-MM-DD
  day_of_week: DayOfWeek;
  workout_type: WorkoutType;
  workout_name?: string;
  description?: string;
  target_distance_miles?: number;
  target_vert_feet?: number;
  target_duration_minutes?: number;
  effort_guidance?: string;
  pace_guidance?: string;
  notes?: string;
  created_at: string;
}

export interface DailyLog {
  id: string;
  daily_workout_id: string; // FK to daily_workouts
  date: string; // ISO date: YYYY-MM-DD
  day_of_week: DayOfWeek;
  week_number: number; // 1-36
  phase: PhaseName;
  workout_completed: boolean;

  // Workout data (optional, depends on workout type)
  run_data?: RunData;
  strength_data?: StrengthData;
  rowing_data?: RowingData;

  // Recovery & wellness
  pt_exercises_completed?: boolean;
  niggles?: Niggle[];
  sleep?: Sleep;
  stress?: number; // 1-10
  motivation?: number; // 1-10

  // Nutrition
  pre_run_fuel?: string;
  during_run_nutrition?: string;

  // General notes
  notes?: string;

  created_at: string;
  updated_at: string;
}

export interface WeeklyReview {
  id: string;
  weekly_plan_id: string; // FK to weekly_plans
  week_number: number;

  // Completion stats
  total_miles?: number;
  total_vert?: number;
  runs_completed?: string; // Format: "X/Y"
  strength_completed?: string; // Format: "X/Y"

  // Flags
  red_flags?: string[]; // Triggers: Persistent pain 3+ days, Motivation <5, Sleep <6hrs
  yellow_flags?: string[]; // Triggers: Felt strong and added miles, RPE creeping up
  green_lights?: string[]; // Examples: All workouts completed, No niggles, Motivation high

  // Modifications
  next_week_modifications?: string; // "Stay the course", "Reduce volume 20%", etc.
  coach_notes?: string;

  created_at: string;
  updated_at: string;
}

// ============================================================================
// VIEW TYPES (for common joins)
// ============================================================================

export interface DailyWorkoutWithLog extends DailyWorkout {
  log?: DailyLog | null;
}

export interface WeeklyPlanWithWorkouts extends WeeklyPlan {
  workouts: DailyWorkoutWithLog[];
  review?: WeeklyReview | null;
}

export interface TrainingPhaseWithWeeks extends TrainingPhase {
  weekly_plans: WeeklyPlanWithWorkouts[];
}

export interface TrainingPlanFull extends TrainingPlan {
  phases: TrainingPhaseWithWeeks[];
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface WeekSummary {
  week_number: number;
  total_miles: number;
  total_vert: number;
  workouts_completed: number;
  workouts_planned: number;
  avg_motivation?: number;
  avg_sleep?: number;
  niggles_count: number;
}

export interface PhaseSummary {
  phase: PhaseName;
  weeks: number[];
  total_miles: number;
  total_vert: number;
  completion_rate: number; // 0-100
  avg_rpe?: number;
}

// Modification protocols
export interface ModificationAction {
  trigger: string;
  action: string;
  example?: string;
}

export type RedFlagResponse = ModificationAction;
export type YellowFlagResponse = ModificationAction;

export interface MissedWorkoutProtocol {
  scenario: string;
  action: string;
}

// Race day specific types
export interface AidStation {
  number: number;
  name: string;
  mile: number;
  cutoff?: string | null;
  cutoff_hours?: number;
  drop_bag: boolean;
  target_arrival?: string;
}

export interface PacingSegment {
  miles: string;
  effort: string;
  goal: string;
  note?: string;
}

export interface NutritionProtocol {
  pre_race: string;
  during_race: {
    carbs: string;
    method: string;
    sodium: string;
    hydration: string;
    real_food: string;
  };
}

export interface RaceDayPlan {
  race_name: string;
  date: string;
  distance: string;
  elevation_gain: string;
  start_time: string;
  finish_cutoff: string;
  aid_stations: AidStation[];
  pacing_strategy: Record<string, PacingSegment>;
  nutrition_protocol: NutritionProtocol;
  gear_checklist: string[];
  mental_mantras: string[];
}
