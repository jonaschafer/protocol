import { subDays, subMonths, startOfDay } from 'date-fns';
import { ExerciseLog, SessionExerciseWithLogs } from './types';

/**
 * Calculate total volume for a session
 * Volume = sum of (weight × total_reps) for all weighted exercises
 * Excludes bodyweight and time-based exercises (volume = 0)
 */
export function calculateSessionVolume(exercises: SessionExerciseWithLogs[]): number {
  let totalVolume = 0;

  for (const exercise of exercises) {
    for (const log of exercise.logs) {
      totalVolume += calculateExerciseVolume(log);
    }
  }

  return totalVolume;
}

/**
 * Calculate volume for a single exercise log
 * Returns 0 for bodyweight/time-based exercises
 */
export function calculateExerciseVolume(log: ExerciseLog): number {
  // Only count weighted exercises
  if (!log.weight_used || log.weight_used === 0) {
    return 0;
  }

  // Sum all reps across sets
  const totalReps = log.reps_per_set.reduce((sum, repsStr) => {
    const reps = parseInt(repsStr, 10);
    return sum + (isNaN(reps) ? 0 : reps);
  }, 0);

  return log.weight_used * totalReps;
}

/**
 * Get date range bounds based on filter selection
 */
export function getDateRangeBounds(range: 'week' | 'month' | 'quarter' | 'all'): {
  start: Date;
  end: Date;
} {
  const end = new Date();
  let start: Date;

  switch (range) {
    case 'week':
      start = subDays(end, 7);
      break;
    case 'month':
      start = subDays(end, 30);
      break;
    case 'quarter':
      start = subMonths(end, 3);
      break;
    case 'all':
      // Go back 2 years as a reasonable "all time" limit
      start = subMonths(end, 24);
      break;
  }

  return {
    start: startOfDay(start),
    end,
  };
}

/**
 * Group logs by date (ISO date string)
 */
export function groupLogsByDate<T extends { logged_at: string }>(
  logs: T[]
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  for (const log of logs) {
    const date = log.logged_at.split('T')[0]; // Get YYYY-MM-DD
    if (!grouped.has(date)) {
      grouped.set(date, []);
    }
    grouped.get(date)!.push(log);
  }

  return grouped;
}

/**
 * Format volume for display
 */
export function formatVolume(volume: number, unit: string = 'lbs'): string {
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K ${unit}`;
  }
  return `${Math.round(volume).toLocaleString()} ${unit}`;
}

/**
 * Format large numbers with K suffix
 */
export function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}
