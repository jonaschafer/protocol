import { ExerciseLog, SessionExercise } from './types';

export type TrainingPhase = 'recovery' | 'general_prep' | 'max_strength' | 'power' | 'taper';

export interface ProgressionSuggestion {
  suggestedWeight?: number;
  suggestedReps?: string;
  suggestedLeftReps?: number;
  suggestedRightReps?: number;
  reasoning: string;
  lastSessionDate?: string;
  lastPerformance?: string;
  encouragement?: string;
}

/**
 * Calculate intelligent progression suggestions based on last performance
 */
export function calculateProgression(
  exercise: SessionExercise,
  lastLog: ExerciseLog | null,
  phase: TrainingPhase = 'recovery'
): ProgressionSuggestion | null {
  // No previous data - no suggestion
  if (!lastLog) {
    return null;
  }

  const isAMRAP = exercise.target_reps.toUpperCase().includes('AMRAP');
  const isTimeBased = exercise.target_reps.includes('sec');

  // Phase multipliers for progression rate
  const phaseMultipliers: Record<TrainingPhase, number> = {
    recovery: 0.5,
    general_prep: 1.0,
    max_strength: 1.5,
    power: 0.75,
    taper: 0.5,
  };

  const multiplier = phaseMultipliers[phase];

  // AMRAP progression (calf raises)
  if (isAMRAP) {
    return calculateAMRAPProgression(exercise, lastLog, multiplier);
  }

  // Time-based progression
  if (isTimeBased) {
    return calculateTimeBasedProgression(exercise, lastLog, multiplier);
  }

  // Regular weight/reps progression
  return calculateWeightProgression(exercise, lastLog, multiplier, phase);
}

/**
 * Calculate progression for AMRAP exercises (calf raises)
 */
function calculateAMRAPProgression(
  exercise: SessionExercise,
  lastLog: ExerciseLog,
  multiplier: number
): ProgressionSuggestion {
  // Parse left/right reps from last session
  const lastReps = lastLog.reps_per_set;

  if (lastReps.length >= 2) {
    const leftReps = parseInt(lastReps[0]);
    const rightReps = parseInt(lastReps[1]);
    const weakerLeg = leftReps < rightReps ? 'left' : 'right';
    const weakerReps = Math.min(leftReps, rightReps);
    const strongerReps = Math.max(leftReps, rightReps);

    // Check for milestone achievement
    const milestone = weakerReps >= 30;

    if (milestone) {
      return {
        suggestedLeftReps: leftReps + 1,
        suggestedRightReps: rightReps + 1,
        reasoning: `Milestone achieved! Both legs over 30 reps. Keep building.`,
        lastPerformance: `L:${leftReps}, R:${rightReps}`,
        encouragement: '🎉 Amazing progress! You\'re crushing it!',
      };
    }

    // Progressive suggestion - focus on weaker leg
    const suggestedLeft = weakerLeg === 'left' ? leftReps + 1 : leftReps;
    const suggestedRight = weakerLeg === 'right' ? rightReps + 1 : rightReps;

    return {
      suggestedLeftReps: suggestedLeft,
      suggestedRightReps: suggestedRight,
      reasoning: `Beat your ${weakerLeg} leg by 1 rep (${weakerReps} → ${weakerReps + 1})`,
      lastPerformance: `L:${leftReps}, R:${rightReps}`,
      encouragement: `Focus on form. You've got this! 💪`,
    };
  }

  return {
    suggestedLeftReps: 15,
    suggestedRightReps: 15,
    reasoning: 'Build a baseline - aim for 15 reps per leg',
    encouragement: 'Start conservative and build from here!',
  };
}

/**
 * Calculate progression for time-based exercises
 */
function calculateTimeBasedProgression(
  exercise: SessionExercise,
  lastLog: ExerciseLog,
  multiplier: number
): ProgressionSuggestion {
  const targetSeconds = parseInt(exercise.target_reps.replace('sec', ''));
  const lastSeconds = parseInt(lastLog.reps_per_set[0]);

  // Check if they completed all sets at target time
  const completedAllSets = lastLog.reps_per_set.every(
    (reps) => parseInt(reps) >= targetSeconds
  );

  if (completedAllSets) {
    const progression = Math.round(5 * multiplier);
    return {
      suggestedReps: `${targetSeconds + progression}sec`,
      reasoning: `Crushed ${targetSeconds}sec! Add ${progression}sec`,
      lastPerformance: `${lastLog.sets_completed}×${lastSeconds}sec`,
      encouragement: 'Strength is building! Keep it up! 💪',
    };
  }

  return {
    suggestedReps: `${targetSeconds}sec`,
    reasoning: 'Keep working toward target time',
    lastPerformance: `${lastLog.sets_completed} sets @ ${lastSeconds}sec avg`,
    encouragement: 'Consistency builds strength!',
  };
}

/**
 * Calculate progression for weight-based exercises
 */
function calculateWeightProgression(
  exercise: SessionExercise,
  lastLog: ExerciseLog,
  multiplier: number,
  phase: TrainingPhase
): ProgressionSuggestion {
  const targetReps = parseTargetReps(exercise.target_reps);
  const lastWeight = lastLog.weight_used || exercise.target_weight || 0;
  const lastReps = lastLog.reps_per_set.map((r) => parseInt(r));
  const avgReps = lastReps.reduce((a, b) => a + b, 0) / lastReps.length;

  // Check if they hit target reps on all sets
  const hitTarget = lastReps.every((r) => r >= targetReps);
  const within1to2 = Math.abs(avgReps - targetReps) <= 2 && avgReps < targetReps;
  const missedBy3Plus = targetReps - avgReps >= 3;

  // Determine base progression amount
  const isStrengthWork = targetReps <= 8;
  const baseProgression = isStrengthWork ? 5 : 2.5;
  const progression = Math.round(baseProgression * multiplier * 10) / 10; // Round to nearest 0.5

  if (hitTarget) {
    const newWeight = lastWeight + progression;
    return {
      suggestedWeight: newWeight,
      reasoning: `Hit all reps! Add ${progression}lb (${phase} phase)`,
      lastPerformance: `${lastLog.sets_completed}×${lastReps.join(',')} @ ${lastWeight}${lastLog.weight_unit}`,
      encouragement: 'Progressive overload working! 💪',
    };
  }

  if (within1to2) {
    return {
      suggestedWeight: lastWeight,
      reasoning: `Close to target (${avgReps.toFixed(1)} avg). Stay at ${lastWeight}lb`,
      lastPerformance: `${lastLog.sets_completed}×${lastReps.join(',')} @ ${lastWeight}${lastLog.weight_unit}`,
      encouragement: 'Dial it in. You\'re almost there!',
    };
  }

  if (missedBy3Plus) {
    const reduction = Math.round(lastWeight * 0.05 * 10) / 10; // 5% reduction
    const newWeight = Math.max(lastWeight - reduction, lastWeight - 10); // Cap at -10lb
    return {
      suggestedWeight: newWeight,
      reasoning: `Dropped ${(targetReps - avgReps).toFixed(1)} reps. Reduce to ${newWeight}lb`,
      lastPerformance: `${lastLog.sets_completed}×${lastReps.join(',')} @ ${lastWeight}${lastLog.weight_unit}`,
      encouragement: 'Recovery phase - listen to your body.',
    };
  }

  // Default: keep same weight
  return {
    suggestedWeight: lastWeight,
    reasoning: `Keep building at ${lastWeight}lb`,
    lastPerformance: `${lastLog.sets_completed}×${lastReps.join(',')} @ ${lastWeight}${lastLog.weight_unit}`,
    encouragement: 'Consistency is key!',
  };
}

/**
 * Parse target reps from string (e.g., "8", "8-10", "8 each")
 */
function parseTargetReps(targetReps: string): number {
  const cleaned = targetReps.toLowerCase().replace(/[^0-9-]/g, '');

  if (cleaned.includes('-')) {
    // Range like "8-10" - use lower bound
    return parseInt(cleaned.split('-')[0]);
  }

  return parseInt(cleaned) || 8;
}

/**
 * Format date for display
 */
export function formatSessionDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Earlier today';
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
