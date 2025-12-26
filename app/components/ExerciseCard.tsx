'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SessionExercise, ExerciseLog } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import SetLogger from './SetLogger';

interface ExerciseCardProps {
  exercise: SessionExercise;
  onComplete: () => void;
}

export default function ExerciseCard({ exercise, onComplete }: ExerciseCardProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Check if exercise has been logged today
  useEffect(() => {
    checkCompletionStatus();
  }, [exercise.id]);

  // Auto-save notes with debouncing (2.5 seconds after user stops typing)
  useEffect(() => {
    if (!notes || !isCompleted) return; // Only save if completed and has notes

    const timer = setTimeout(async () => {
      setIsSavingNotes(true);
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data: existingLogs } = await supabase
          .from('exercise_logs')
          .select('id')
          .eq('session_exercise_id', exercise.id)
          .gte('logged_at', today.toISOString())
          .order('logged_at', { ascending: false })
          .limit(1);

        if (existingLogs && existingLogs.length > 0) {
          const { error } = await supabase
            .from('exercise_logs')
            .update({ notes })
            .eq('id', existingLogs[0].id);

          if (error) throw error;

          setShowSaved(true);
          setTimeout(() => setShowSaved(false), 2000);
        }
      } catch (error) {
        console.error('Error auto-saving notes:', error);
      } finally {
        setIsSavingNotes(false);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [notes, exercise.id, isCompleted]);

  const checkCompletionStatus = async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('exercise_logs')
        .select('*')
        .eq('session_exercise_id', exercise.id)
        .gte('logged_at', today.toISOString())
        .order('logged_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setLogs(data);
        setIsCompleted(true);
        setIsStarted(false);
        // Load notes from the most recent log
        if (data[0].notes) {
          setNotes(data[0].notes);
        }
      }
    } catch (error) {
      console.error('Error checking completion status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setIsStarted(false);
    onComplete();
  };

  const handleUndo = async () => {
    if (!window.confirm('Delete today\'s log for this exercise?')) return;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { error } = await supabase
        .from('exercise_logs')
        .delete()
        .eq('session_exercise_id', exercise.id)
        .gte('logged_at', today.toISOString());

      if (error) throw error;

      setIsCompleted(false);
      setLogs([]);
    } catch (error) {
      console.error('Error deleting logs:', error);
      alert('Failed to delete log. Please try again.');
    }
  };

  const formatTarget = () => {
    const parts = [];

    parts.push(`${exercise.sets}×${exercise.target_reps}`);

    if (exercise.target_weight) {
      parts.push(`@ ${exercise.target_weight}${exercise.weight_unit || 'lbs'}`);
    }

    return parts.join(' ');
  };

  const getRestPeriod = () => {
    const isAMRAP = exercise.target_reps.toUpperCase().includes('AMRAP');
    const isTimeBased = exercise.target_reps.includes('sec');
    const hasWeight = exercise.target_weight && exercise.target_weight > 0;

    if (isAMRAP || isTimeBased) {
      return '30-60s rest between sets';
    } else if (hasWeight) {
      return '60-90s rest between sets';
    } else {
      return '30-60s rest between sets';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`bg-white border rounded-lg p-4 transition-all ${
        isCompleted
          ? 'border-green-300 bg-green-50'
          : exercise.is_non_negotiable
          ? 'border-blue-300'
          : exercise.injury_warning
          ? 'border-amber-300'
          : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {exercise.exercise_name}
            </h3>
            {exercise.is_non_negotiable && (
              <span className="text-blue-600" title="Non-negotiable - PT priority">
                🔒
              </span>
            )}
            {exercise.injury_warning && (
              <span className="text-amber-600" title="Monitor for injury">
                ⚠️
              </span>
            )}
          </div>

          <div className="text-sm text-gray-600 mb-1">
            <span className="font-medium">{formatTarget()}</span>
            <span className="text-xs text-gray-500 ml-2">({getRestPeriod()})</span>
          </div>

          {exercise.equipment && (
            <div className="text-xs text-gray-500">
              Equipment: {exercise.equipment}
            </div>
          )}
        </div>
      </div>

      {exercise.notes && (
        <div className="text-sm text-gray-700 bg-gray-50 rounded p-2 mb-3">
          <span className="font-medium">Note:</span> {exercise.notes}
        </div>
      )}

      {/* Workout Notes - Always visible when completed */}
      {isCompleted && (
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Workout Notes
          </label>
          <div className="relative">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this workout (optional)"
              rows={2}
              style={{ fontSize: '16px' }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            {showSaved && (
              <div className="absolute right-2 top-2 text-xs text-green-600 font-medium bg-white px-2 py-1 rounded shadow-sm">
                Saved ✓
              </div>
            )}
          </div>
        </div>
      )}

      {!isCompleted && !isStarted && (
        <button
          onClick={handleStart}
          disabled={isLoading}
          className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors min-h-[44px]"
        >
          {isLoading ? 'Loading...' : 'Start Exercise'}
        </button>
      )}

      <AnimatePresence>
        {isStarted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SetLogger exercise={exercise} onComplete={handleComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {isCompleted && (
        <button
          onClick={handleUndo}
          className="w-full py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 border border-red-300 transition-colors min-h-[44px]"
        >
          Undo Workout
        </button>
      )}

      {isCompleted && logs.length > 0 && (
        <div className="mt-3 pt-3 border-t border-green-200">
          <div className="text-xs text-gray-600 mb-1">Today's performance:</div>
          <div className="text-sm text-gray-700">
            {logs[0].reps_per_set.length > 1 ? (
              <div>
                L: {logs[0].reps_per_set[0]} reps, R: {logs[0].reps_per_set[1]}{' '}
                reps
              </div>
            ) : (
              <div>
                {logs[0].sets_completed} sets × {logs[0].reps_per_set.join(', ')}{' '}
                {logs[0].weight_used && (
                  <>
                    @ {logs[0].weight_used}
                    {logs[0].weight_unit}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
