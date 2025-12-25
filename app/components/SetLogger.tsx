'use client';

import { useState, useEffect } from 'react';
import { SessionExercise, ExerciseLog } from '@/lib/types';
import { supabase, getLastExerciseLog } from '@/lib/supabase';
import {
  calculateProgression,
  formatSessionDate,
  ProgressionSuggestion,
} from '@/lib/progression';

interface SetLoggerProps {
  exercise: SessionExercise;
  onComplete: () => void;
}

interface SetData {
  reps: string;
  weight: string;
  logged: boolean;
}

interface AMRAPSetData {
  leftReps: string;
  rightReps: string;
  logged: boolean;
}

export default function SetLogger({ exercise, onComplete }: SetLoggerProps) {
  const isAMRAP = exercise.target_reps.toUpperCase().includes('AMRAP');
  const isTimeBased = exercise.target_reps.includes('sec');

  const [progression, setProgression] = useState<ProgressionSuggestion | null>(null);
  const [lastLog, setLastLog] = useState<ExerciseLog | null>(null);
  const [isLoadingProgression, setIsLoadingProgression] = useState(true);

  // Initialize sets based on exercise type
  const initializeSets = (suggestion?: ProgressionSuggestion): SetData[] => {
    return Array.from({ length: exercise.sets }, () => ({
      reps: suggestion?.suggestedReps?.replace('sec', '') ||
            (isTimeBased ? exercise.target_reps.replace('sec', '') : ''),
      weight: suggestion?.suggestedWeight?.toString() ||
              exercise.target_weight?.toString() || '',
      logged: false,
    }));
  };

  const initializeAMRAPSets = (suggestion?: ProgressionSuggestion): AMRAPSetData[] => {
    return Array.from({ length: exercise.sets }, () => ({
      leftReps: suggestion?.suggestedLeftReps?.toString() || '',
      rightReps: suggestion?.suggestedRightReps?.toString() || '',
      logged: false,
    }));
  };

  const [sets, setSets] = useState<SetData[]>(initializeSets());
  const [amrapSets, setAmrapSets] = useState<AMRAPSetData[]>(initializeAMRAPSets());
  const [isLogging, setIsLogging] = useState(false);

  // Fetch progression suggestion on mount
  useEffect(() => {
    async function fetchProgression() {
      setIsLoadingProgression(true);
      try {
        const log = await getLastExerciseLog(exercise.id);
        setLastLog(log);

        if (log) {
          const suggestion = calculateProgression(exercise, log, 'recovery');
          setProgression(suggestion);

          // Pre-fill with suggested values
          if (suggestion) {
            if (isAMRAP) {
              setAmrapSets(initializeAMRAPSets(suggestion));
            } else {
              setSets(initializeSets(suggestion));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching progression:', error);
      } finally {
        setIsLoadingProgression(false);
      }
    }

    fetchProgression();
  }, [exercise.id]);

  const handleLogSet = async (setIndex: number) => {
    const setData = sets[setIndex];
    if (!setData.reps) return;

    setIsLogging(true);
    try {
      const { error } = await supabase.from('exercise_logs').insert({
        session_exercise_id: exercise.id,
        sets_completed: 1,
        reps_per_set: [setData.reps],
        weight_used: setData.weight ? parseFloat(setData.weight) : null,
        weight_unit: exercise.weight_unit || 'lbs',
      });

      if (error) throw error;

      // Mark set as logged
      const newSets = [...sets];
      newSets[setIndex].logged = true;
      setSets(newSets);

      // Check if all sets are logged
      if (newSets.every((s) => s.logged)) {
        setTimeout(onComplete, 500);
      }
    } catch (error) {
      console.error('Error logging set:', error);
      alert('Failed to log set. Please try again.');
    } finally {
      setIsLogging(false);
    }
  };

  const handleLogAMRAPSet = async (setIndex: number) => {
    const setData = amrapSets[setIndex];
    if (!setData.leftReps || !setData.rightReps) {
      alert('Please enter reps for both legs');
      return;
    }

    setIsLogging(true);
    try {
      const { error } = await supabase.from('exercise_logs').insert({
        session_exercise_id: exercise.id,
        sets_completed: 1,
        reps_per_set: [setData.leftReps, setData.rightReps],
        weight_used: null,
        weight_unit: null,
      });

      if (error) throw error;

      // Mark set as logged
      const newSets = [...amrapSets];
      newSets[setIndex].logged = true;
      setAmrapSets(newSets);

      // Check if all sets are logged
      if (newSets.every((s) => s.logged)) {
        setTimeout(onComplete, 500);
      }
    } catch (error) {
      console.error('Error logging AMRAP set:', error);
      alert('Failed to log set. Please try again.');
    } finally {
      setIsLogging(false);
    }
  };

  const handleCompleteAll = async () => {
    const unloggedSets = sets.filter((s) => !s.logged);
    if (unloggedSets.length === 0) {
      onComplete();
      return;
    }

    // Log all remaining sets at once
    setIsLogging(true);
    try {
      const repsPerSet = unloggedSets.map((s) => s.reps || '0');
      const avgWeight = unloggedSets.find((s) => s.weight)?.weight;

      const { error } = await supabase.from('exercise_logs').insert({
        session_exercise_id: exercise.id,
        sets_completed: unloggedSets.length,
        reps_per_set: repsPerSet,
        weight_used: avgWeight ? parseFloat(avgWeight) : null,
        weight_unit: exercise.weight_unit || 'lbs',
      });

      if (error) throw error;

      onComplete();
    } catch (error) {
      console.error('Error completing exercise:', error);
      alert('Failed to complete exercise. Please try again.');
    } finally {
      setIsLogging(false);
    }
  };

  // Progression Suggestion Component
  const ProgressionDisplay = () => {
    if (isLoadingProgression) {
      return (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-gray-600">Loading progression...</div>
        </div>
      );
    }

    if (!progression || !lastLog) {
      return null;
    }

    return (
      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-lg">💡</span>
          <div className="flex-1">
            <div className="text-sm font-semibold text-blue-900 mb-1">
              Progression Suggestion
            </div>
            {progression.lastPerformance && (
              <div className="text-xs text-gray-600 mb-1">
                Last session ({formatSessionDate(lastLog.logged_at)}): {progression.lastPerformance}
              </div>
            )}
            <div className="text-sm text-blue-800 font-medium">
              {progression.reasoning}
            </div>
            {progression.encouragement && (
              <div className="text-xs text-blue-700 mt-1 italic">
                {progression.encouragement}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // AMRAP rendering for calf raises (set-by-set with left/right legs)
  if (isAMRAP) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
        <ProgressionDisplay />
        {amrapSets.map((setData, index) => (
          <div
            key={index}
            className={`p-3 border rounded-lg ${
              setData.logged
                ? 'border-green-300 bg-green-50 opacity-75'
                : 'border-gray-300 bg-white'
            }`}
          >
            <div className="text-sm font-medium text-gray-700 mb-2">
              Set {index + 1} of {amrapSets.length} - Log your max reps (per leg):
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Left leg
                </label>
                <input
                  type="number"
                  value={setData.leftReps}
                  onChange={(e) => {
                    const newSets = [...amrapSets];
                    newSets[index].leftReps = e.target.value;
                    setAmrapSets(newSets);
                  }}
                  placeholder="0"
                  disabled={setData.logged}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Right leg
                </label>
                <input
                  type="number"
                  value={setData.rightReps}
                  onChange={(e) => {
                    const newSets = [...amrapSets];
                    newSets[index].rightReps = e.target.value;
                    setAmrapSets(newSets);
                  }}
                  placeholder="0"
                  disabled={setData.logged}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>
            </div>

            {setData.logged ? (
              <div className="flex items-center justify-center text-green-600 text-sm font-medium">
                ✓ Set {index + 1} logged: L:{setData.leftReps}, R:{setData.rightReps}
              </div>
            ) : (
              <button
                onClick={() => handleLogAMRAPSet(index)}
                disabled={
                  isLogging || !setData.leftReps || !setData.rightReps
                }
                className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed min-h-[44px]"
              >
                {isLogging ? 'Logging...' : `Log Set ${index + 1}`}
              </button>
            )}
          </div>
        ))}

        {amrapSets.every((s) => s.logged) && (
          <button
            onClick={onComplete}
            className="w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 min-h-[44px] mt-2"
          >
            Complete Exercise
          </button>
        )}
      </div>
    );
  }

  // Regular set-by-set logging
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
      <ProgressionDisplay />
      {sets.map((setData, index) => (
        <div
          key={index}
          className={`flex items-center gap-2 ${
            setData.logged ? 'opacity-50' : ''
          }`}
        >
          <div className="w-16 text-sm font-medium text-gray-700">
            Set {index + 1}
          </div>

          <input
            type="text"
            value={setData.reps}
            onChange={(e) => {
              const newSets = [...sets];
              newSets[index].reps = e.target.value;
              setSets(newSets);
            }}
            placeholder={isTimeBased ? 'sec' : 'reps'}
            disabled={setData.logged}
            className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />

          {!isTimeBased && (
            <>
              <input
                type="number"
                value={setData.weight}
                onChange={(e) => {
                  const newSets = [...sets];
                  newSets[index].weight = e.target.value;
                  setSets(newSets);
                }}
                placeholder="weight"
                disabled={setData.logged}
                className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
              <span className="text-sm text-gray-600">{exercise.weight_unit || 'lbs'}</span>
            </>
          )}

          {setData.logged ? (
            <div className="ml-auto text-green-600 text-xl">✓</div>
          ) : (
            <button
              onClick={() => handleLogSet(index)}
              disabled={isLogging || !setData.reps}
              className="ml-auto px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed min-h-[44px] min-w-[60px]"
            >
              Log
            </button>
          )}
        </div>
      ))}

      {sets.some((s) => s.logged) && (
        <button
          onClick={handleCompleteAll}
          disabled={isLogging}
          className="w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed min-h-[44px] mt-2"
        >
          {isLogging ? 'Completing...' : 'Complete Exercise'}
        </button>
      )}
    </div>
  );
}
