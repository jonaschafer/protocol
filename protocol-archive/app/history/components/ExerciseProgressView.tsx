'use client';

import { useEffect, useState } from 'react';
import { ExerciseLogWithContext } from '@/lib/types';
import { getExerciseHistory } from '@/lib/supabase';
import { getDateRangeBounds } from '@/lib/historyUtils';
import ExerciseProgressChart from './ExerciseProgressChart';

interface ExerciseProgressViewProps {
  exerciseName: string;
  dateRange: 'week' | 'month' | 'quarter' | 'all';
}

export default function ExerciseProgressView({
  exerciseName,
  dateRange,
}: ExerciseProgressViewProps) {
  const [logs, setLogs] = useState<ExerciseLogWithContext[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExerciseData = async () => {
      setIsLoading(true);
      try {
        const { start, end } = getDateRangeBounds(dateRange);
        const exerciseLogs = await getExerciseHistory(exerciseName, start, end);
        setLogs(exerciseLogs);
      } catch (error) {
        console.error('Error fetching exercise history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExerciseData();
  }, [exerciseName, dateRange]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
      </div>
    );
  }

  return (
    <div>
      <ExerciseProgressChart logs={logs} exerciseName={exerciseName} />
    </div>
  );
}
