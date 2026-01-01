import { supabase } from './supabase';

export interface TodaysWorkout {
  id: string;
  workout_date: string;
  day_of_week: string;
  workout_type: 'run' | 'rowing' | 'rest' | 'strength';
  run_distance_miles?: number;
  run_vert_feet?: number;
  run_effort?: string;
  run_rpe_target?: string;
  run_route?: string;
  run_notes?: string;
  strength_session_type?: string;
  strength_duration_minutes?: number;
  strength_exercises?: any; // JSONB
  rowing_duration_minutes?: number;
  rowing_effort?: string;
  rowing_spm_target?: string;
  pre_run_fuel?: string;
  during_run_nutrition?: string;
  workout_notes?: string;
  weekly_plan?: {
    week_number: number;
    phase: string;
    week_theme?: string;
  };
}

export interface WeeklySummary {
  weekNumber: number;
  phase: string;
  weekTheme?: string;
  targetMiles: number;
  targetVert: number;
  actualMiles: number;
  actualVert: number;
  workoutsCompleted: number;
  totalWorkouts: number;
}

export interface DailyLogData {
  daily_workout_id: string;
  log_date: string;
  workout_completed: boolean;

  // Run data
  run_distance_miles?: number;
  run_vert_feet?: number;
  run_time_hours?: number;
  run_pace_per_mile?: string;
  run_rpe?: number;
  run_route?: string;
  run_effort_zone?: string;

  // Strength data
  strength_session_type?: string;
  strength_duration_minutes?: number;
  strength_exercises_completed?: string[];
  strength_sets_logged?: any; // JSONB structure: { "exercise_name": [{ set: 1, reps: 10, weight: 95, unit: "lbs", notes: "" }] }
  strength_notes?: string;

  // Rowing data
  rowing_duration_minutes?: number;
  rowing_spm?: number;
  rowing_effort?: string;

  // PT
  pt_exercises_completed?: boolean;

  // Recovery metrics
  sleep_hours?: number;
  sleep_quality?: number; // 1-10
  stress_level?: number; // 1-10
  motivation_level?: number; // 1-10

  // Niggles
  niggles?: any; // JSONB array

  // Nutrition
  pre_run_fuel?: string;
  during_run_nutrition?: string;

  // Notes
  notes?: string;
}

/**
 * Get today's prescribed workout
 */
export async function getTodaysWorkout(): Promise<TodaysWorkout | null> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const { data, error } = await supabase
    .from('daily_workouts')
    .select(`
      *,
      weekly_plan:weekly_plans (
        week_number,
        phase,
        week_theme
      )
    `)
    .eq('workout_date', today)
    .single();

  if (error) {
    // PGRST116 means no rows found - this is expected when no workout scheduled
    if (error.code === 'PGRST116') {
      console.log(`No workout scheduled for ${today}`);
      return null;
    }
    // Log other errors
    console.error('Error fetching today\'s workout:', error);
    return null;
  }

  return data;
}

/**
 * Get all workouts for a specific week
 */
export async function getWeekWorkouts(weekNumber: number) {
  const { data, error } = await supabase
    .from('weekly_plans')
    .select(`
      *,
      daily_workouts!inner (*)
    `)
    .eq('week_number', weekNumber)
    .order('workout_date', { foreignTable: 'daily_workouts', ascending: true })
    .single();

  if (error) {
    console.error('Error fetching week workouts:', error);
    return null;
  }

  return data;
}

/**
 * Get current week number based on training plan start date
 * Returns 0 if in Week 0 (Recovery week), otherwise 1-36
 */
export async function getCurrentWeek(): Promise<number> {
  const { data: plan } = await supabase
    .from('training_plans')
    .select('start_date, current_week')
    .eq('is_active', true)
    .single();

  if (!plan) return 1;

  // Calculate week based on start_date if current_week not set
  if (plan.current_week) return plan.current_week;

  const today = new Date();

  // Check if Week 0 exists and if we're in its date range
  const { data: weekZero } = await supabase
    .from('weekly_plans')
    .select('week_start_date, end_date')
    .eq('week_number', 0)
    .single();

  if (weekZero) {
    const weekZeroStart = new Date(weekZero.week_start_date);
    const weekZeroEnd = new Date(weekZero.end_date);

    if (today >= weekZeroStart && today <= weekZeroEnd) {
      return 0; // We're in Week 0
    }
  }

  const startDate = new Date(plan.start_date);
  const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(daysDiff / 7) + 1;

  return Math.max(1, Math.min(weekNumber, 36)); // Clamp to 1-36 (Week 0 handled above)
}

/**
 * Get weekly summary with actual vs planned
 */
export async function getWeeklySummary(weekNumber: number): Promise<WeeklySummary | null> {
  // Get weekly plan
  const { data: weekPlan } = await supabase
    .from('weekly_plans')
    .select('*')
    .eq('week_number', weekNumber)
    .single();

  if (!weekPlan) return null;

  // Get all workouts for this week
  const { data: workouts } = await supabase
    .from('daily_workouts')
    .select('id, workout_date')
    .eq('weekly_plan_id', weekPlan.id);

  if (!workouts) return null;

  // Get all logs for this week
  const workoutIds = workouts.map(w => w.id);
  const { data: logs } = await supabase
    .from('daily_logs')
    .select('*')
    .in('daily_workout_id', workoutIds);

  const actualMiles = logs?.reduce((sum, log) => sum + (log.run_distance_miles || 0), 0) || 0;
  const actualVert = logs?.reduce((sum, log) => sum + (log.run_vert_feet || 0), 0) || 0;
  const workoutsCompleted = logs?.filter(log => log.workout_completed).length || 0;

  return {
    weekNumber: weekPlan.week_number,
    phase: weekPlan.phase,
    weekTheme: weekPlan.week_theme,
    targetMiles: weekPlan.target_miles || 0,
    targetVert: weekPlan.target_vert || 0,
    actualMiles,
    actualVert,
    workoutsCompleted,
    totalWorkouts: workouts.length
  };
}

/**
 * Create a daily log entry
 */
export async function createDailyLog(data: DailyLogData) {
  const { data: log, error } = await supabase
    .from('daily_logs')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('Error creating daily log:', error);
    throw error;
  }

  return log;
}

/**
 * Check if today's workout has been logged
 */
export async function getTodaysLog(workoutId: string) {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('daily_workout_id', workoutId)
    .eq('log_date', today)
    .maybeSingle(); // Use maybeSingle instead of single to handle 0 or 1 rows

  if (error) {
    console.error('Error fetching today\'s log:', error);
    return null;
  }

  return data;
}

/**
 * Get workout for a specific date
 */
export async function getWorkoutByDate(date: string): Promise<TodaysWorkout | null> {
  const { data, error } = await supabase
    .from('daily_workouts')
    .select(`
      *,
      weekly_plan:weekly_plans (
        week_number,
        phase,
        week_theme
      )
    `)
    .eq('workout_date', date)
    .single();

  if (error) {
    // PGRST116 means no rows found - this is expected when no workout scheduled
    if (error.code === 'PGRST116') {
      console.log(`No workout scheduled for ${date}`);
      return null;
    }
    // Log other errors
    console.error('Error fetching workout by date:', error);
    return null;
  }

  return data;
}

/**
 * Get all logs for a specific week
 */
export async function getWeekLogs(weekNumber: number) {
  // First get the weekly plan
  const { data: weekPlan } = await supabase
    .from('weekly_plans')
    .select('id')
    .eq('week_number', weekNumber)
    .single();

  if (!weekPlan) return [];

  // Get all workouts for this week
  const { data: workouts } = await supabase
    .from('daily_workouts')
    .select('id')
    .eq('weekly_plan_id', weekPlan.id);

  if (!workouts) return [];

  // Get all logs for these workouts
  const workoutIds = workouts.map(w => w.id);
  const { data: logs } = await supabase
    .from('daily_logs')
    .select('*, daily_workout:daily_workouts(*)')
    .in('daily_workout_id', workoutIds)
    .order('log_date', { ascending: false });

  return logs || [];
}

/**
 * Get all weeks for a specific phase with summaries
 */
export async function getPhaseWeeks(phaseName: string) {
  const { data: weeks, error } = await supabase
    .from('weekly_plans')
    .select('*')
    .eq('phase', phaseName)
    .order('week_number', { ascending: true });

  if (error) {
    console.error('Error fetching phase weeks:', error);
    return [];
  }

  // Get summaries for each week
  const weeksWithSummaries = await Promise.all(
    weeks.map(async (week) => {
      const summary = await getWeeklySummary(week.week_number);
      return {
        ...week,
        summary
      };
    })
  );

  return weeksWithSummaries;
}

/**
 * Get recent logged workouts
 */
export async function getRecentLogs(limit: number = 5) {
  const { data: logs, error } = await supabase
    .from('daily_logs')
    .select(`
      *,
      daily_workout:daily_workouts (
        *,
        weekly_plan:weekly_plans (
          week_number,
          phase
        )
      )
    `)
    .eq('workout_completed', true)
    .order('log_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent logs:', error);
    return [];
  }

  return logs || [];
}

/**
 * Get current week number (alias for getCurrentWeek for clarity)
 */
export async function getCurrentWeekNumber(): Promise<number> {
  return getCurrentWeek();
}

/**
 * Get training plan info
 */
export async function getTrainingPlan() {
  const { data: plan, error } = await supabase
    .from('training_plans')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching training plan:', error);
    return null;
  }

  return plan;
}

/**
 * Get current week by finding which weekly_plans row contains today's date
 * More reliable than calculating based on start_date
 */
export async function getCurrentWeekByDate(): Promise<number> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const { data, error } = await supabase
    .from('weekly_plans')
    .select('week_number, week_start_date, end_date')
    .lte('week_start_date', today)
    .gte('end_date', today)
    .single();

  if (error || !data) {
    console.log('No current week found for today, falling back to getCurrentWeek()');
    return getCurrentWeek();
  }

  return data.week_number;
}

/**
 * Get all training phases with actual dates
 */
export async function getTrainingPhases() {
  const { data: phases, error } = await supabase
    .from('training_phases')
    .select('*')
    .order('week_start', { ascending: true });

  if (error) {
    console.error('Error fetching training phases:', error);
    return [];
  }

  return phases || [];
}
