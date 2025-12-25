import { createClient } from '@supabase/supabase-js';
import { ExerciseLog } from './types';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get the most recent exercise log for a specific session exercise
 * Used for progression suggestions
 */
export async function getLastExerciseLog(
  sessionExerciseId: string
): Promise<ExerciseLog | null> {
  try {
    const { data, error } = await supabase
      .from('exercise_logs')
      .select('*')
      .eq('session_exercise_id', sessionExerciseId)
      .order('logged_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // PGRST116 means no rows found - this is expected for first-time exercises
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching last exercise log:', error);
    return null;
  }
}

export interface CalfProgress {
  leftMax: number;
  rightMax: number;
  lastLoggedDate: string | null;
  totalSessions: number;
  averageImprovement: number;
}

/**
 * Get calf raise progress for milestone tracking
 * Fetches all calf raise logs and calculates max reps per leg
 */
export async function getCalfProgress(): Promise<CalfProgress> {
  try {
    // First, find all session_exercises for "Single-Leg Calf Raise"
    const { data: exercises, error: exerciseError } = await supabase
      .from('session_exercises')
      .select('id')
      .eq('exercise_name', 'Single-Leg Calf Raise');

    if (exerciseError) throw exerciseError;

    if (!exercises || exercises.length === 0) {
      return {
        leftMax: 0,
        rightMax: 0,
        lastLoggedDate: null,
        totalSessions: 0,
        averageImprovement: 0,
      };
    }

    const exerciseIds = exercises.map((e) => e.id);

    // Fetch all logs for calf raises
    const { data: logs, error: logsError } = await supabase
      .from('exercise_logs')
      .select('*')
      .in('session_exercise_id', exerciseIds)
      .order('logged_at', { ascending: true });

    if (logsError) throw logsError;

    if (!logs || logs.length === 0) {
      return {
        leftMax: 0,
        rightMax: 0,
        lastLoggedDate: null,
        totalSessions: 0,
        averageImprovement: 0,
      };
    }

    // Parse all logs to find max for each leg
    let leftMax = 0;
    let rightMax = 0;
    let firstLeftReps = 0;
    let firstRightReps = 0;
    let lastLoggedDate: string | null = null;

    logs.forEach((log, index) => {
      if (log.reps_per_set && log.reps_per_set.length >= 2) {
        const leftReps = parseInt(log.reps_per_set[0]);
        const rightReps = parseInt(log.reps_per_set[1]);

        if (index === 0) {
          firstLeftReps = leftReps;
          firstRightReps = rightReps;
        }

        leftMax = Math.max(leftMax, leftReps);
        rightMax = Math.max(rightMax, rightReps);
        lastLoggedDate = log.logged_at;
      }
    });

    // Calculate average improvement per session
    const totalSessions = logs.length;
    const leftImprovement = firstLeftReps > 0 ? (leftMax - firstLeftReps) / totalSessions : 0;
    const rightImprovement = firstRightReps > 0 ? (rightMax - firstRightReps) / totalSessions : 0;
    const averageImprovement = (leftImprovement + rightImprovement) / 2;

    return {
      leftMax,
      rightMax,
      lastLoggedDate,
      totalSessions,
      averageImprovement: Math.max(averageImprovement, 0.33), // Assume at least 1 rep per 3 sessions
    };
  } catch (error) {
    console.error('Error fetching calf progress:', error);
    return {
      leftMax: 0,
      rightMax: 0,
      lastLoggedDate: null,
      totalSessions: 0,
      averageImprovement: 0,
    };
  }
}
