'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getTodaysWorkout, getWorkoutByDate, getTodaysLog, type TodaysWorkout } from '@/lib/queries';
import Navigation from '../components/Navigation';
import LogWorkoutModal from '../components/LogWorkoutModal';
import { ArrowLeft, CheckCircle2, Mountain, Gauge, Route, Calendar } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

function TodayPageContent() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  const [workout, setWorkout] = useState<TodaysWorkout | null>(null);
  const [hasLog, setHasLog] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewDate, setViewDate] = useState<string | null>(null);

  useEffect(() => {
    loadWorkout();
  }, [dateParam]);

  const loadWorkout = async () => {
    setIsLoading(true);
    try {
      let data;
      if (dateParam) {
        // View a specific date
        data = await getWorkoutByDate(dateParam);
        setViewDate(dateParam);
      } else {
        // View today's workout
        data = await getTodaysWorkout();
        setViewDate(null);
      }
      setWorkout(data);

      if (data) {
        const log = await getTodaysLog(data.id);
        setHasLog(!!log);
      }
    } catch (error) {
      console.error('Error loading workout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogSuccess = () => {
    setHasLog(true);
    loadWorkout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workout...</p>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center text-blue-600 mb-6 min-h-[44px]">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Week
          </Link>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Workout Today</h2>
            <p className="text-gray-600">There is no workout scheduled for today.</p>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  const getWorkoutTypeColor = (type: string) => {
    switch (type) {
      case 'run': return 'bg-blue-600';
      case 'strength': return 'bg-purple-600';
      case 'rowing': return 'bg-teal-600';
      case 'rest': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getWorkoutTypeBgColor = (type: string) => {
    switch (type) {
      case 'run': return 'bg-blue-50';
      case 'strength': return 'bg-purple-50';
      case 'rowing': return 'bg-teal-50';
      case 'rest': return 'bg-gray-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className={`min-h-screen pb-48 ${getWorkoutTypeBgColor(workout.workout_type)}`}>
      {/* Header */}
      <div className={`${getWorkoutTypeColor(workout.workout_type)} text-white p-6 pb-8`}>
        <div className="max-w-2xl mx-auto">
          <Link
            href={workout.weekly_plan?.week_number !== undefined ? `/?week=${workout.weekly_plan.week_number}` : "/"}
            className="inline-flex items-center text-white/90 hover:text-white mb-4 min-h-[44px]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Week
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">
                {viewDate ? format(new Date(viewDate), 'MMMM d, yyyy').toUpperCase() : "TODAY'S WORKOUT"}
              </p>
              <h1 className="text-2xl font-bold">{workout.day_of_week}</h1>
              {workout.weekly_plan && (
                <p className="text-white/90 text-sm mt-2">
                  Week {workout.weekly_plan.week_number} • {workout.weekly_plan.phase}
                </p>
              )}
            </div>

            {hasLog && (
              <div className="bg-white/20 rounded-full p-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-4 space-y-4">
        {/* Run Workout Details */}
        {workout.workout_type === 'run' && (
          <>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h2 className="text-lg font-bold mb-4">Run Details</h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Route className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-blue-600 font-medium uppercase">Distance</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{workout.run_distance_miles}</p>
                  <p className="text-sm text-blue-600">miles</p>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Mountain className="w-4 h-4 text-orange-600" />
                    <p className="text-xs text-orange-600 font-medium uppercase">Vert</p>
                  </div>
                  <p className="text-2xl font-bold text-orange-900">{workout.run_vert_feet}</p>
                  <p className="text-sm text-orange-600">feet</p>
                </div>
              </div>

              {workout.run_effort && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Gauge className="w-4 h-4 text-gray-600" />
                    <p className="text-sm font-medium text-gray-700">Effort</p>
                  </div>
                  <p className="text-gray-900">{workout.run_effort}</p>
                </div>
              )}

              {workout.run_route && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Route</p>
                  <p className="text-gray-900">{workout.run_route}</p>
                </div>
              )}

              {workout.run_notes && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-1">Notes</p>
                  <p className="text-sm text-blue-800">{workout.run_notes}</p>
                </div>
              )}
            </div>

            {/* Nutrition */}
            {(workout.pre_run_fuel || workout.during_run_nutrition) && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-4">Nutrition</h3>

                {workout.pre_run_fuel && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Pre-run</p>
                    <p className="text-gray-900">{workout.pre_run_fuel}</p>
                  </div>
                )}

                {workout.during_run_nutrition && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">During run</p>
                    <p className="text-gray-900">{workout.during_run_nutrition}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Strength Workout Details */}
        {(workout.workout_type === 'strength' || workout.strength_session_type) && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h2 className="text-lg font-bold mb-4">{workout.strength_session_type || 'Strength Session'}</h2>

            {workout.strength_duration_minutes && (
              <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-700 mb-1">Duration</p>
                <p className="text-2xl font-bold text-purple-900">{workout.strength_duration_minutes} min</p>
              </div>
            )}

            {workout.strength_exercises && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Exercises</p>
                {JSON.parse(workout.strength_exercises).map((ex: any, idx: number) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{ex.exercise}</p>
                    {ex.sets && ex.reps && (
                      <p className="text-sm text-gray-600 mt-1">
                        {ex.sets} × {ex.reps} {ex.note ? `(${ex.note})` : ''}
                      </p>
                    )}
                    {ex.details && <p className="text-sm text-gray-600 mt-1">{ex.details}</p>}
                    {ex.duration && <p className="text-sm text-gray-600 mt-1">{ex.duration}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rowing Workout Details */}
        {workout.workout_type === 'rowing' && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h2 className="text-lg font-bold mb-4">Rowing</h2>

            <div className="grid grid-cols-2 gap-4">
              {workout.rowing_duration_minutes && (
                <div className="bg-teal-50 rounded-lg p-4">
                  <p className="text-xs text-teal-600 font-medium uppercase mb-2">Duration</p>
                  <p className="text-2xl font-bold text-teal-900">{workout.rowing_duration_minutes}</p>
                  <p className="text-sm text-teal-600">minutes</p>
                </div>
              )}

              {workout.rowing_spm_target && (
                <div className="bg-teal-50 rounded-lg p-4">
                  <p className="text-xs text-teal-600 font-medium uppercase mb-2">Target SPM</p>
                  <p className="text-2xl font-bold text-teal-900">{workout.rowing_spm_target}</p>
                  <p className="text-sm text-teal-600">strokes/min</p>
                </div>
              )}
            </div>

            {workout.rowing_effort && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">Effort</p>
                <p className="text-gray-900">{workout.rowing_effort}</p>
              </div>
            )}
          </div>
        )}

        {/* Rest Day */}
        {workout.workout_type === 'rest' && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h2 className="text-lg font-bold mb-4">Rest Day</h2>
            <p className="text-gray-700 mb-4">
              Focus on recovery and PT exercises. Light movement is encouraged.
            </p>

            {workout.workout_notes && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{workout.workout_notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Workout Notes */}
        {workout.workout_notes && workout.workout_type !== 'rest' && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-3">Workout Notes</h3>
            <p className="text-gray-700 whitespace-pre-line">{workout.workout_notes}</p>
          </div>
        )}

        {/* Log Workout Button */}
        {!hasLog && (
          <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
            <button
              onClick={() => setShowLogModal(true)}
              className={`w-full max-w-2xl mx-auto ${getWorkoutTypeColor(workout.workout_type)} text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow min-h-[44px]`}
            >
              Log This Workout
            </button>
          </div>
        )}

        {hasLog && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-900">Workout Logged</p>
              <p className="text-sm text-green-700">Great work today!</p>
            </div>
          </div>
        )}
      </div>

      {/* Log Modal */}
      {showLogModal && workout && (
        <LogWorkoutModal
          workout={workout}
          onClose={() => setShowLogModal(false)}
          onSuccess={handleLogSuccess}
        />
      )}

      <Navigation />
    </div>
  );
}

export default function TodayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workout...</p>
        </div>
      </div>
    }>
      <TodayPageContent />
    </Suspense>
  );
}
