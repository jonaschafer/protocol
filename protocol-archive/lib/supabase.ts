import { createClient } from '@supabase/supabase-js';
import { format, subDays } from 'date-fns';
import {
  ExerciseLog,
  SessionHistory,
  HistoryStats,
  ExerciseLogWithContext,
  CalfProgressData,
  PersonalRecord,
} from './types';
import { calculateSessionVolume, calculateExerciseVolume } from './historyUtils';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Check .env.local file.'
  );
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

export interface MilestoneStatus {
  painFreeRunning: boolean;
  calfMilestone: boolean;
  weeklyMileage: boolean;
  ptClearance: boolean;
}

/**
 * Check milestone completion status for protocol unlocking
 */
export async function checkMilestones(): Promise<MilestoneStatus> {
  try {
    // Auto-check calf milestone from logs
    const calfProgress = await getCalfProgress();
    const calfMilestone = calfProgress.leftMax >= 30 && calfProgress.rightMax >= 30;

    // For now, other milestones are manual (would come from user settings/inputs)
    // In a full implementation, these would be stored in a user_milestones table
    return {
      painFreeRunning: false, // Manual user input
      calfMilestone,
      weeklyMileage: false, // Manual user input
      ptClearance: false, // Manual user input
    };
  } catch (error) {
    console.error('Error checking milestones:', error);
    return {
      painFreeRunning: false,
      calfMilestone: false,
      weeklyMileage: false,
      ptClearance: false,
    };
  }
}

/**
 * Update which protocol is currently active
 */
export async function updateActiveProtocol(protocolId: string): Promise<void> {
  try {
    // First, set all protocols to inactive
    const { error: deactivateError } = await supabase
      .from('protocols')
      .update({ active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all

    if (deactivateError) throw deactivateError;

    // Then, activate the selected protocol
    const { error: activateError } = await supabase
      .from('protocols')
      .update({ active: true })
      .eq('id', protocolId);

    if (activateError) throw activateError;
  } catch (error) {
    console.error('Error updating active protocol:', error);
    throw error;
  }
}

// History View Functions

/**
 * Get workout history within a date range
 * Groups exercise logs by session and date
 */
export async function getWorkoutHistory(
  startDate: Date,
  endDate: Date
): Promise<SessionHistory[]> {
  try {
    // Fetch all exercise logs in date range
    const { data: logs, error: logsError } = await supabase
      .from('exercise_logs')
      .select(
        `
        *,
        session_exercises (
          *,
          sessions (
            *,
            protocols (*)
          )
        )
      `
      )
      .gte('logged_at', startDate.toISOString())
      .lte('logged_at', endDate.toISOString())
      .order('logged_at', { ascending: false });

    if (logsError) throw logsError;
    if (!logs || logs.length === 0) return [];

    // Group logs by session and date
    const sessionMap = new Map<string, SessionHistory>();

    for (const log of logs) {
      const sessionExercise = (log as any).session_exercises;
      if (!sessionExercise) continue;

      const session = sessionExercise.sessions;
      if (!session) continue;

      const protocol = session.protocols;
      const date = log.logged_at.split('T')[0]; // YYYY-MM-DD
      const key = `${session.id}-${date}`;

      if (!sessionMap.has(key)) {
        sessionMap.set(key, {
          id: key,
          date,
          session,
          protocol,
          exercises: [],
          totalVolume: 0,
          duration: session.duration_minutes,
          completedExercises: 0,
          totalExercises: 0,
        });
      }

      const sessionHistory = sessionMap.get(key)!;

      // Find or create exercise entry
      const existingEntry = sessionHistory.exercises.find(
        (e) => e.id === sessionExercise.id
      );

      if (existingEntry) {
        existingEntry.logs.push(log);
      } else {
        const newEntry = {
          ...sessionExercise,
          logs: [log],
        };
        sessionHistory.exercises.push(newEntry);
      }
    }

    // Calculate totals for each session
    const sessions = Array.from(sessionMap.values()).map((session) => {
      const totalVolume = calculateSessionVolume(session.exercises);
      const completedExercises = session.exercises.length;

      return {
        ...session,
        totalVolume,
        completedExercises,
        totalExercises: completedExercises, // In history, we only see completed exercises
      };
    });

    return sessions;
  } catch (error) {
    console.error('Error fetching workout history:', error);
    return [];
  }
}

/**
 * Get aggregated history stats
 */
export async function getHistoryStats(
  startDate?: Date,
  endDate?: Date
): Promise<HistoryStats> {
  try {
    // Build query with optional date filters
    let query = supabase.from('exercise_logs').select('*');

    if (startDate) {
      query = query.gte('logged_at', startDate.toISOString());
    }
    if (endDate) {
      query = query.lte('logged_at', endDate.toISOString());
    }

    const { data: logs, error } = await query.order('logged_at', {
      ascending: true,
    });

    if (error) throw error;
    if (!logs || logs.length === 0) {
      return {
        totalWorkouts: 0,
        totalVolume: 0,
        currentStreak: 0,
        prCount: 0,
      };
    }

    // Calculate total workouts (unique dates)
    const uniqueDates = new Set(logs.map((log) => log.logged_at.split('T')[0]));
    const totalWorkouts = uniqueDates.size;

    // Calculate total volume
    const totalVolume = logs.reduce((sum, log) => {
      return sum + calculateExerciseVolume(log);
    }, 0);

    // Calculate current streak
    const sortedDates = Array.from(uniqueDates).sort().reverse();
    let streak = 0;
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    while (sortedDates.includes(format(checkDate, 'yyyy-MM-dd'))) {
      streak++;
      checkDate = subDays(checkDate, 1);
    }

    // Get PR count
    const prs = await getPersonalRecords();

    return {
      totalWorkouts,
      totalVolume,
      currentStreak: streak,
      prCount: prs.length,
    };
  } catch (error) {
    console.error('Error fetching history stats:', error);
    return {
      totalWorkouts: 0,
      totalVolume: 0,
      currentStreak: 0,
      prCount: 0,
    };
  }
}

/**
 * Get unique exercise names for filter dropdown
 */
export async function getExerciseNames(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('session_exercises')
      .select('exercise_name')
      .order('exercise_name');

    if (error) throw error;

    // Get unique names
    const uniqueNames = Array.from(
      new Set(data?.map((e) => e.exercise_name) || [])
    ).sort();

    return uniqueNames;
  } catch (error) {
    console.error('Error fetching exercise names:', error);
    return [];
  }
}

/**
 * Get calf raise progression history for chart
 */
export async function getCalfProgressHistory(
  startDate: Date,
  endDate: Date
): Promise<CalfProgressData[]> {
  try {
    // Find all calf raise session exercises
    const { data: exercises, error: exerciseError } = await supabase
      .from('session_exercises')
      .select('id')
      .eq('exercise_name', 'Single-Leg Calf Raise');

    if (exerciseError) throw exerciseError;
    if (!exercises || exercises.length === 0) return [];

    const exerciseIds = exercises.map((e) => e.id);

    // Fetch logs in date range
    const { data: logs, error: logsError } = await supabase
      .from('exercise_logs')
      .select('*')
      .in('session_exercise_id', exerciseIds)
      .gte('logged_at', startDate.toISOString())
      .lte('logged_at', endDate.toISOString())
      .order('logged_at', { ascending: true });

    if (logsError) throw logsError;
    if (!logs || logs.length === 0) return [];

    // Parse logs into progression data
    const progressData: CalfProgressData[] = logs
      .filter((log) => log.reps_per_set && log.reps_per_set.length >= 2)
      .map((log) => ({
        date: log.logged_at.split('T')[0],
        leftReps: parseInt(log.reps_per_set[0]),
        rightReps: parseInt(log.reps_per_set[1]),
      }));

    return progressData;
  } catch (error) {
    console.error('Error fetching calf progress history:', error);
    return [];
  }
}

/**
 * Get exercise history for a specific exercise
 */
export async function getExerciseHistory(
  exerciseName: string,
  startDate: Date,
  endDate: Date
): Promise<ExerciseLogWithContext[]> {
  try {
    // Find all session exercises with this name
    const { data: exercises, error: exerciseError } = await supabase
      .from('session_exercises')
      .select(
        `
        *,
        sessions (*)
      `
      )
      .eq('exercise_name', exerciseName);

    if (exerciseError) throw exerciseError;
    if (!exercises || exercises.length === 0) return [];

    const exerciseIds = exercises.map((e: any) => e.id);

    // Fetch logs
    const { data: logs, error: logsError } = await supabase
      .from('exercise_logs')
      .select('*')
      .in('session_exercise_id', exerciseIds)
      .gte('logged_at', startDate.toISOString())
      .lte('logged_at', endDate.toISOString())
      .order('logged_at', { ascending: false });

    if (logsError) throw logsError;
    if (!logs || logs.length === 0) return [];

    // Attach context to each log
    const logsWithContext: ExerciseLogWithContext[] = logs.map((log) => {
      const sessionExercise = exercises.find((e: any) => e.id === log.session_exercise_id);
      return {
        ...log,
        session_exercise: sessionExercise,
        session: (sessionExercise as any).sessions,
        date: log.logged_at.split('T')[0],
      };
    });

    return logsWithContext;
  } catch (error) {
    console.error('Error fetching exercise history:', error);
    return [];
  }
}

/**
 * Get personal records across all exercises
 */
export async function getPersonalRecords(): Promise<PersonalRecord[]> {
  try {
    // Fetch all exercise logs
    const { data: logs, error } = await supabase
      .from('exercise_logs')
      .select(
        `
        *,
        session_exercises (exercise_name)
      `
      )
      .order('logged_at', { ascending: true });

    if (error) throw error;
    if (!logs || logs.length === 0) return [];

    // Group by exercise name and find PRs
    const exerciseMap = new Map<
      string,
      { maxWeight: number; maxReps: number; maxVolume: number; dates: any }
    >();

    for (const log of logs) {
      const exerciseName = (log as any).session_exercises?.exercise_name;
      if (!exerciseName) continue;

      // Skip bodyweight exercises
      if (!log.weight_used || log.weight_used === 0) continue;

      const totalReps = log.reps_per_set.reduce(
        (sum: number, r: string) => sum + parseInt(r),
        0
      );
      const volume = calculateExerciseVolume(log);

      if (!exerciseMap.has(exerciseName)) {
        exerciseMap.set(exerciseName, {
          maxWeight: 0,
          maxReps: 0,
          maxVolume: 0,
          dates: {},
        });
      }

      const exerciseData = exerciseMap.get(exerciseName)!;

      // Track PRs
      if (log.weight_used > exerciseData.maxWeight) {
        exerciseData.maxWeight = log.weight_used;
        exerciseData.dates.weight = log.logged_at.split('T')[0];
      }

      if (totalReps > exerciseData.maxReps) {
        exerciseData.maxReps = totalReps;
        exerciseData.dates.reps = log.logged_at.split('T')[0];
      }

      if (volume > exerciseData.maxVolume) {
        exerciseData.maxVolume = volume;
        exerciseData.dates.volume = log.logged_at.split('T')[0];
      }
    }

    // Convert to PR array
    const prs: PersonalRecord[] = [];
    exerciseMap.forEach((data, exerciseName) => {
      if (data.maxWeight > 0) {
        prs.push({
          exerciseName,
          type: 'weight',
          value: data.maxWeight,
          date: data.dates.weight,
        });
      }
      if (data.maxReps > 0) {
        prs.push({
          exerciseName,
          type: 'reps',
          value: data.maxReps,
          date: data.dates.reps,
        });
      }
      if (data.maxVolume > 0) {
        prs.push({
          exerciseName,
          type: 'volume',
          value: data.maxVolume,
          date: data.dates.volume,
        });
      }
    });

    return prs;
  } catch (error) {
    console.error('Error fetching personal records:', error);
    return [];
  }
}

/**
 * Get all exercises from the exercise library
 */
export async function getAllExercises() {
  try {
    const { data, error } = await supabase
      .from('exercise_library')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return [];
  }
}
