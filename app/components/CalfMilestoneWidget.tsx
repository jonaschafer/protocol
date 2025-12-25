'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCalfProgress, CalfProgress } from '@/lib/supabase';

const MILESTONE_GOAL = 30;

export default function CalfMilestoneWidget() {
  const [progress, setProgress] = useState<CalfProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    setIsLoading(true);
    const data = await getCalfProgress();
    setProgress(data);
    setIsLoading(false);

    // Show celebration if both legs achieved milestone
    if (data.leftMax >= MILESTONE_GOAL && data.rightMax >= MILESTONE_GOAL) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }
  };

  // Allow external refresh (called after logging calf raises)
  useEffect(() => {
    const handleRefresh = () => fetchProgress();
    window.addEventListener('calfProgressUpdate', handleRefresh);
    return () => window.removeEventListener('calfProgressUpdate', handleRefresh);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="animate-pulse text-2xl">🎯</div>
          <div className="text-sm text-gray-600">Loading calf progress...</div>
        </div>
      </div>
    );
  }

  if (!progress) return null;

  const leftProgress = Math.min((progress.leftMax / MILESTONE_GOAL) * 100, 100);
  const rightProgress = Math.min((progress.rightMax / MILESTONE_GOAL) * 100, 100);

  const leftComplete = progress.leftMax >= MILESTONE_GOAL;
  const rightComplete = progress.rightMax >= MILESTONE_GOAL;
  const bothComplete = leftComplete && rightComplete;

  // Estimate days until maintenance
  const calculateDaysToMilestone = () => {
    if (bothComplete) return 0;

    const slowerLeg = Math.min(progress.leftMax, progress.rightMax);
    const repsNeeded = MILESTONE_GOAL - slowerLeg;

    if (progress.averageImprovement <= 0) {
      return null; // Can't estimate
    }

    const sessionsNeeded = Math.ceil(repsNeeded / progress.averageImprovement);
    const daysNeeded = Math.ceil(sessionsNeeded); // Assume daily sessions

    return daysNeeded;
  };

  const daysToMilestone = calculateDaysToMilestone();

  // Determine state message
  const getStateMessage = () => {
    const notStarted = progress.leftMax < 5 && progress.rightMax < 5;

    if (notStarted) {
      return {
        message: "Just getting started! 💪",
        color: "text-gray-600",
      };
    }

    if (bothComplete) {
      return {
        message: "🎉 Milestone Achieved! Switching to maintenance mode",
        color: "text-green-700",
      };
    }

    if (leftComplete || rightComplete) {
      const completedLeg = leftComplete ? 'Left' : 'Right';
      const remainingLeg = leftComplete ? 'right' : 'left';
      return {
        message: `${completedLeg} leg achieved! Keep pushing ${remainingLeg} leg!`,
        color: "text-blue-700",
      };
    }

    // In progress
    const weakerLeg = progress.leftMax < progress.rightMax ? 'left' : 'right';
    const weakerReps = Math.min(progress.leftMax, progress.rightMax);
    const percentToHalf = (weakerReps / 15) * 100;

    if (percentToHalf < 100) {
      return {
        message: `Focus on ${weakerLeg} leg - ${Math.round(percentToHalf)}% to halfway!`,
        color: "text-blue-700",
      };
    }

    return {
      message: `Great progress! Keep the momentum going!`,
      color: "text-blue-700",
    };
  };

  const stateMessage = getStateMessage();

  return (
    <div className="sticky top-0 z-10 mb-4">
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-90 rounded-lg z-20"
          >
            <div className="text-center text-white">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-6xl mb-2"
              >
                🎉
              </motion.div>
              <div className="text-2xl font-bold">Milestone Achieved!</div>
              <div className="text-sm mt-1">Both legs hit 30 reps!</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${
          bothComplete
            ? 'from-green-50 to-emerald-50 border-green-300'
            : 'from-blue-50 to-indigo-50 border-blue-200'
        } border rounded-lg p-4 shadow-sm`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <h3 className="font-semibold text-gray-900">Calf Raise Milestone</h3>
          </div>
          {bothComplete && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-2xl"
            >
              ✓
            </motion.div>
          )}
        </div>

        {/* Left Leg Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-700 font-medium">Left Leg</span>
            <span className="text-gray-600">
              {progress.leftMax}/{MILESTONE_GOAL} {leftComplete && '✓'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${leftProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-3 rounded-full ${
                leftComplete
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500'
              }`}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">{Math.round(leftProgress)}%</div>
        </div>

        {/* Right Leg Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-700 font-medium">Right Leg</span>
            <span className="text-gray-600">
              {progress.rightMax}/{MILESTONE_GOAL} {rightComplete && '✓'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${rightProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className={`h-3 rounded-full ${
                rightComplete
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500'
              }`}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">{Math.round(rightProgress)}%</div>
        </div>

        {/* Status Message */}
        <div className="pt-2 border-t border-gray-200">
          <p className={`text-sm font-medium ${stateMessage.color}`}>
            {stateMessage.message}
          </p>
          {!bothComplete && daysToMilestone !== null && daysToMilestone > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Est. {daysToMilestone < 7 ? `~${daysToMilestone} days` : `~${Math.ceil(daysToMilestone / 7)} weeks`} until maintenance
              {progress.totalSessions > 0 && ` (based on +${progress.averageImprovement.toFixed(1)} reps/session)`}
            </p>
          )}
          {bothComplete && (
            <button
              className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => alert('Protocol update feature coming soon!')}
            >
              Update Protocol
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
