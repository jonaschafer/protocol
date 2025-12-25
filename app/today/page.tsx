'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { format, parse } from 'date-fns';
import { Session, SessionExercise, Protocol } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import SessionHeader from '@/app/components/SessionHeader';
import ExerciseCard from '@/app/components/ExerciseCard';
import Navigation from '@/app/components/Navigation';
import CalfMilestoneWidget from '@/app/components/CalfMilestoneWidget';
import DayNavigator from '@/app/components/DayNavigator';
import WeekView from '@/app/components/WeekView';

function TodayPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showWeekView, setShowWeekView] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [exercises, setExercises] = useState<SessionExercise[]>([]);
  const [allSessions, setAllSessions] = useState<(Session & { exerciseCount: number })[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse date from URL on mount
  useEffect(() => {
    const dateParam = searchParams?.get('date');
    const viewParam = searchParams?.get('view');

    if (dateParam) {
      try {
        const parsedDate = parse(dateParam, 'yyyy-MM-dd', new Date());
        setSelectedDate(parsedDate);
      } catch (e) {
        console.error('Invalid date parameter');
      }
    }

    if (viewParam === 'week') {
      setShowWeekView(true);
    }
  }, [searchParams]);

  // Fetch workout when date changes
  useEffect(() => {
    fetchWorkout(selectedDate);
    fetchAllSessions();
  }, [selectedDate]);

  const fetchWorkout = async (date: Date) => {
    setIsLoading(true);
    setError(null);

    try {
      const dayOfWeek = date.getDay();

      // Fetch active protocol
      const { data: activeProtocol, error: protocolError } = await supabase
        .from('protocols')
        .select('*')
        .eq('active', true)
        .single();

      if (protocolError) throw protocolError;
      setProtocol(activeProtocol);

      // Fetch session for this day
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('protocol_id', activeProtocol.id)
        .eq('day_of_week', dayOfWeek)
        .single();

      if (sessionError) {
        if (sessionError.code === 'PGRST116') {
          setError('No workout scheduled for this day');
          setSession(null);
          setExercises([]);
          setIsLoading(false);
          return;
        }
        throw sessionError;
      }

      setSession(sessionData);

      // Fetch exercises for this session
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('session_exercises')
        .select('*')
        .eq('session_id', sessionData.id)
        .order('order_index', { ascending: true });

      if (exercisesError) throw exercisesError;

      setExercises(exercisesData || []);

      // Check completion status
      await checkCompletionStatus(exercisesData || [], date);
    } catch (err) {
      console.error('Error fetching workout:', err);
      setError('Failed to load workout');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllSessions = async () => {
    try {
      const { data: activeProtocol } = await supabase
        .from('protocols')
        .select('*')
        .eq('active', true)
        .single();

      if (!activeProtocol) return;

      const { data: sessions } = await supabase
        .from('sessions')
        .select('*')
        .eq('protocol_id', activeProtocol.id);

      if (!sessions) return;

      // Get exercise counts for each session
      const sessionsWithCounts = await Promise.all(
        sessions.map(async (session) => {
          const { data: exercises } = await supabase
            .from('session_exercises')
            .select('id')
            .eq('session_id', session.id);

          return {
            ...session,
            exerciseCount: exercises?.length || 0,
          };
        })
      );

      setAllSessions(sessionsWithCounts);
    } catch (err) {
      console.error('Error fetching all sessions:', err);
    }
  };

  const checkCompletionStatus = async (exercisesList: SessionExercise[], date: Date) => {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const exerciseIds = exercisesList.map((e) => e.id);

      const { data, error } = await supabase
        .from('exercise_logs')
        .select('session_exercise_id')
        .in('session_exercise_id', exerciseIds)
        .gte('logged_at', startOfDay.toISOString())
        .lte('logged_at', endOfDay.toISOString());

      if (error) throw error;

      const uniqueExercises = new Set(data?.map((log) => log.session_exercise_id));
      setCompletedCount(uniqueExercises.size);
    } catch (err) {
      console.error('Error checking completion status:', err);
    }
  };

  const handleExerciseComplete = (exerciseName: string) => {
    setCompletedCount((prev) => prev + 1);

    if (exerciseName.includes('Calf Raise')) {
      window.dispatchEvent(new Event('calfProgressUpdate'));
    }
  };

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    const dateStr = format(newDate, 'yyyy-MM-dd');
    router.push(`/today?date=${dateStr}`);
  };

  const handleToggleWeekView = () => {
    const newShowWeek = !showWeekView;
    setShowWeekView(newShowWeek);

    if (newShowWeek) {
      router.push('/today?view=week');
    } else {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      router.push(`/today?date=${dateStr}`);
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowWeekView(false);
    const dateStr = format(date, 'yyyy-MM-dd');
    router.push(`/today?date=${dateStr}`);
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <DayNavigator
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        protocolName={protocol?.name || 'Protocol'}
        onToggleWeekView={handleToggleWeekView}
        showWeekView={showWeekView}
      />

      {showWeekView ? (
        <WeekView
          selectedDate={selectedDate}
          sessions={allSessions}
          onDayClick={handleDayClick}
        />
      ) : (
        <>
          {!error && session && (
            <>
              <div className="max-w-2xl mx-auto p-4">
                <CalfMilestoneWidget />
              </div>

              <SessionHeader
                session={session}
                protocol={protocol!}
                completedCount={completedCount}
                totalCount={exercises.length}
              />

              <div className="max-w-2xl mx-auto p-4 space-y-3">
                {exercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onComplete={() => handleExerciseComplete(exercise.exercise_name)}
                  />
                ))}

                {completedCount === exercises.length && exercises.length > 0 && (
                  <div className="bg-green-100 border border-green-300 rounded-lg p-6 text-center mt-6">
                    <div className="text-4xl mb-2">🎉</div>
                    <h3 className="text-xl font-bold text-green-900 mb-1">
                      Workout Complete!
                    </h3>
                    <p className="text-green-700">
                      Great job on completing {session.name}!
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {error && (
            <div className="max-w-2xl mx-auto p-4 pt-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <div className="text-4xl mb-4">💤</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {error}
                </h2>
                <p className="text-gray-600">
                  Enjoy your rest day!
                </p>
              </div>
            </div>
          )}
        </>
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
