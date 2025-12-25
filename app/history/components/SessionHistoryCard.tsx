'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SessionHistory } from '@/lib/types';
import { formatVolume, calculateExerciseVolume } from '@/lib/historyUtils';

interface SessionHistoryCardProps {
  session: SessionHistory;
  defaultExpanded?: boolean;
}

export default function SessionHistoryCard({
  session,
  defaultExpanded = false,
}: SessionHistoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const router = useRouter();

  const isFullyComplete =
    session.completedExercises === session.totalExercises &&
    session.totalExercises > 0;

  const handleRepeatWorkout = () => {
    router.push(`/today?repeatSession=${session.session.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-lg border-2 transition-all ${
        isFullyComplete
          ? 'border-green-300 bg-green-50/30'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Collapsed Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">
            {session.session.name.split(' - ')[1] || session.session.name}
          </h3>
          <span className="text-gray-400 text-sm">
            {isExpanded ? '▲' : '▼'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span>
            {session.completedExercises}/{session.totalExercises} exercises
          </span>
          {session.totalVolume > 0 && (
            <>
              <span>•</span>
              <span>{formatVolume(session.totalVolume)}</span>
            </>
          )}
          <span>•</span>
          <span>{session.duration} min</span>
        </div>

        <div className="text-xs text-gray-500 mt-1">
          {session.protocol.name}
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-gray-200 pt-4">
              {/* Exercise List */}
              <div className="space-y-3 mb-4">
                {session.exercises.map((exercise) => {
                  const volume = exercise.logs.reduce(
                    (sum, log) => sum + calculateExerciseVolume(log),
                    0
                  );

                  return (
                    <div
                      key={exercise.id}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span className="font-medium text-gray-900">
                            {exercise.exercise_name}
                          </span>
                        </div>
                      </div>

                      {exercise.logs.map((log, logIndex) => {
                        const repsDisplay = log.reps_per_set.join(', ');
                        return (
                          <div key={logIndex} className="text-sm text-gray-600 ml-6">
                            {log.sets_completed} × {repsDisplay}
                            {log.weight_used && log.weight_used > 0 && (
                              <span>
                                {' '}
                                @ {log.weight_used}
                                {log.weight_unit || 'lbs'}
                              </span>
                            )}
                          </div>
                        );
                      })}

                      {volume > 0 && (
                        <div className="text-xs text-gray-500 ml-6 mt-1">
                          Volume: {formatVolume(volume)}
                        </div>
                      )}

                      {exercise.logs.some((log) => log.rpe) && (
                        <div className="text-xs text-gray-500 ml-6">
                          RPE: {exercise.logs.find((log) => log.rpe)?.rpe}
                        </div>
                      )}

                      {exercise.logs.some((log) => log.notes) && (
                        <div className="text-xs text-gray-600 ml-6 mt-1 italic">
                          {exercise.logs.find((log) => log.notes)?.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Repeat Workout Button */}
              <button
                onClick={handleRepeatWorkout}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                Repeat This Workout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
