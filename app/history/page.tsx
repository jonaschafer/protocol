'use client';

import { useEffect, useState, Suspense } from 'react';
import Navigation from '@/app/components/Navigation';
import StatsCard from './components/StatsCard';
import FilterBar from './components/FilterBar';
import TimelineView from './components/TimelineView';
import ExerciseProgressView from './components/ExerciseProgressView';
import CalfProgressChart from './components/CalfProgressChart';
import {
  HistoryFilters,
  HistoryStats,
  SessionHistory,
  CalfProgressData,
} from '@/lib/types';
import {
  getWorkoutHistory,
  getHistoryStats,
  getExerciseNames,
  getCalfProgressHistory,
} from '@/lib/supabase';
import { getDateRangeBounds } from '@/lib/historyUtils';

function HistoryPageContent() {
  const [filters, setFilters] = useState<HistoryFilters>({
    dateRange: 'month',
    exerciseName: null,
  });

  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [sessions, setSessions] = useState<SessionHistory[]>([]);
  const [exerciseNames, setExerciseNames] = useState<string[]>([]);
  const [calfProgressData, setCalfProgressData] = useState<CalfProgressData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data when filters change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const { start, end } = getDateRangeBounds(filters.dateRange);

        // Fetch in parallel
        const [statsData, sessionsData, names, calfData] = await Promise.all([
          getHistoryStats(start, end),
          getWorkoutHistory(start, end),
          getExerciseNames(),
          getCalfProgressHistory(start, end),
        ]);

        setStats(statsData);
        setSessions(sessionsData);
        setExerciseNames(names);
        setCalfProgressData(calfData);
      } catch (error) {
        console.error('Error fetching history data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  // Filter sessions by exercise if selected
  const filteredSessions = filters.exerciseName
    ? sessions.filter((session) =>
        session.exercises.some((ex) => ex.exercise_name === filters.exerciseName)
      )
    : sessions;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        exerciseNames={exerciseNames}
      />

      <div className="max-w-2xl mx-auto p-4">
        <StatsCard stats={stats} isLoading={isLoading} />

        {/* Calf Progress Chart - always show if data exists */}
        {!filters.exerciseName && calfProgressData.length > 0 && (
          <CalfProgressChart
            data={calfProgressData}
            isLoading={isLoading}
          />
        )}

        {filters.exerciseName ? (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {filters.exerciseName} History
              </h2>
              <p className="text-sm text-gray-600">
                Showing {filteredSessions.length} workout
                {filteredSessions.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Exercise-specific progression chart */}
            <ExerciseProgressView
              exerciseName={filters.exerciseName}
              dateRange={filters.dateRange}
            />

            <TimelineView sessions={filteredSessions} isLoading={isLoading} />
          </>
        ) : (
          <TimelineView sessions={sessions} isLoading={isLoading} />
        )}
      </div>

      <Navigation />
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading history...</p>
          </div>
        </div>
      }
    >
      <HistoryPageContent />
    </Suspense>
  );
}
