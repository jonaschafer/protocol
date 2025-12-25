'use client';

import { motion } from 'framer-motion';
import { HistoryStats } from '@/lib/types';
import { formatVolume, formatNumber } from '@/lib/historyUtils';

interface StatsCardProps {
  stats: HistoryStats | null;
  isLoading: boolean;
}

export default function StatsCard({ stats, isLoading }: StatsCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Workout Stats</h2>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2 w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      label: 'Workouts',
      value: stats.totalWorkouts,
      icon: '🏋️',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Total Volume',
      value: formatVolume(stats.totalVolume),
      icon: '💪',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Current Streak',
      value: `${stats.currentStreak} day${stats.currentStreak !== 1 ? 's' : ''}`,
      icon: '🔥',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Personal Records',
      value: stats.prCount,
      icon: '🏆',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg border border-gray-200 p-4 mb-4"
    >
      <h2 className="text-lg font-bold text-gray-900 mb-3">Workout Stats</h2>
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className={`${stat.bgColor} rounded-lg p-3 border border-gray-200`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600 font-medium">
                {stat.label}
              </span>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
