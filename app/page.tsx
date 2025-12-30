'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getWeekWorkouts, getWeekLogs, getCurrentWeekByDate } from '@/lib/queries';
import Navigation from './components/Navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Mountain, Route, Clock, TrendingUp } from 'lucide-react';

function HomePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [weekData, setWeekData] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCurrentWeek();
  }, []);

  useEffect(() => {
    if (weekNumber >= 0) {
      loadWeekData();
    }
  }, [weekNumber]);

  const loadCurrentWeek = async () => {
    const weekParam = searchParams.get('week');
    if (weekParam) {
      setWeekNumber(parseInt(weekParam));
    } else {
      const current = await getCurrentWeekByDate();
      setWeekNumber(current);
    }
  };

  const loadWeekData = async () => {
    setIsLoading(true);
    try {
      const [data, weekLogs] = await Promise.all([
        getWeekWorkouts(weekNumber),
        getWeekLogs(weekNumber)
      ]);

      setWeekData(data);
      setLogs(weekLogs);
    } catch (error) {
      console.error('Error loading week data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = direction === 'prev' ? weekNumber - 1 : weekNumber + 1;
    if (newWeek >= 0 && newWeek <= 36) {
      setWeekNumber(newWeek);
      router.push(`/?week=${newWeek}`);
    }
  };

  const isWorkoutLogged = (workoutId: string) => {
    return logs.some(log => log.daily_workout_id === workoutId && log.workout_completed);
  };

  const isTodaysWorkout = (workoutDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    return workoutDate === today;
  };

  const getWorkoutTypeColor = (type: string, isToday: boolean = false) => {
    const baseColors = {
      'run': 'border-blue-500 bg-blue-50',
      'strength': 'border-purple-500 bg-purple-50',
      'rowing': 'border-teal-500 bg-teal-50',
      'rest': 'border-gray-300 bg-gray-50',
    };

    const todayBorder = isToday ? 'ring-2 ring-blue-400' : '';
    return `${baseColors[type as keyof typeof baseColors] || baseColors.rest} ${todayBorder}`;
  };

  const getWorkoutIcon = (type: string) => {
    switch (type) {
      case 'run': return <Route className="w-5 h-5 text-blue-600" />;
      case 'strength': return <Mountain className="w-5 h-5 text-purple-600" />;
      case 'rowing': return <Clock className="w-5 h-5 text-teal-600" />;
      default: return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading week...</p>
        </div>
        <Navigation />
      </div>
    );
  }

  if (!weekData) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24 px-4 py-6">
        <p className="text-gray-600 text-center">Week not found</p>
        <Navigation />
      </div>
    );
  }

  const workouts = weekData.daily_workouts || [];
  const actualMiles = logs.reduce((sum: number, log: any) => sum + (log.run_distance_miles || 0), 0);
  const actualVert = logs.reduce((sum: number, log: any) => sum + (log.run_vert_feet || 0), 0);
  const completedCount = logs.filter((log: any) => log.workout_completed).length;
  const completionPercentage = workouts.length > 0 ? (completedCount / workouts.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateWeek('prev')}
              disabled={weekNumber <= 0}
              className="p-2 hover:bg-white/20 rounded-full disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h1 className="text-2xl font-bold">Week {weekNumber}</h1>
              <p className="text-blue-100 text-sm">{weekData.phase} Phase</p>
            </div>

            <button
              onClick={() => navigateWeek('next')}
              disabled={weekNumber >= 36}
              className="p-2 hover:bg-white/20 rounded-full disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {weekData.week_theme && (
            <p className="text-center text-blue-100 text-sm mb-6">{weekData.week_theme}</p>
          )}

          {/* Week Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-100" />
                <p className="text-xs text-blue-100">Miles</p>
              </div>
              <p className="text-xl font-bold">{actualMiles.toFixed(1)} <span className="text-sm font-normal">/ {weekData.target_miles || '?'}</span></p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-blue-100" />
                <p className="text-xs text-blue-100">Workouts</p>
              </div>
              <p className="text-xl font-bold">{completedCount} <span className="text-sm font-normal">/ {workouts.length}</span></p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-xs text-blue-100 mt-1 text-center">{completionPercentage.toFixed(0)}% complete</p>
          </div>
        </div>
      </div>

      {/* Workouts List */}
      <div className="max-w-2xl mx-auto px-4 -mt-4 space-y-3">
        {workouts.map((workout: any) => {
          const logged = isWorkoutLogged(workout.id);
          const isToday = isTodaysWorkout(workout.workout_date);
          const workoutDate = new Date(workout.workout_date);
          const formattedDate = workoutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return (
            <Link key={workout.id} href={`/today?date=${workout.workout_date}`}>
              <div className={`bg-white rounded-xl shadow-md border-l-4 p-4 hover:shadow-lg transition-all ${getWorkoutTypeColor(workout.workout_type, isToday)}`}>
                {/* Today Badge */}
                {isToday && (
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                      TODAY
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getWorkoutIcon(workout.workout_type)}
                    <div>
                      <h3 className="font-bold text-gray-900">{workout.day_of_week}</h3>
                      <p className="text-sm text-gray-600">{formattedDate}</p>
                    </div>
                  </div>

                  {logged ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                  )}
                </div>

                {/* Workout Details */}
                {workout.workout_type === 'run' && (
                  <div className="flex items-center space-x-4 text-sm text-gray-700">
                    <span className="font-medium">{workout.run_distance_miles} mi</span>
                    <span className="text-gray-400">•</span>
                    <span className="font-medium">{workout.run_vert_feet} ft</span>
                    {workout.run_effort && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{workout.run_effort}</span>
                      </>
                    )}
                  </div>
                )}

                {workout.strength_session_type && (
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">{workout.strength_session_type}</span>
                    {workout.strength_duration_minutes && (
                      <span className="text-gray-600"> • {workout.strength_duration_minutes} min</span>
                    )}
                  </div>
                )}

                {workout.workout_type === 'rowing' && (
                  <div className="text-sm text-gray-700">
                    {workout.rowing_duration_minutes && (
                      <span className="font-medium">{workout.rowing_duration_minutes} min</span>
                    )}
                    {workout.rowing_effort && (
                      <span className="text-gray-600"> • {workout.rowing_effort}</span>
                    )}
                  </div>
                )}

                {workout.workout_type === 'rest' && (
                  <p className="text-sm text-gray-600">Rest day - Recovery and PT</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <Navigation />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading week...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
