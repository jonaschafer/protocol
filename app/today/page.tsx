'use client';

import { useEffect, useState } from 'react';
import { Session, SessionExercise, Protocol } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import SessionHeader from '@/app/components/SessionHeader';
import ExerciseCard from '@/app/components/ExerciseCard';
import Navigation from '@/app/components/Navigation';

export default function TodayPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [exercises, setExercises] = useState<SessionExercise[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodayWorkout();
  }, []);

  const fetchTodayWorkout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get today's day of week (0 = Sunday, 1 = Monday, etc.)
      const today = new Date().getDay();

      // Fetch session for today
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('day_of_week', today)
        .single();

      if (sessionError) {
        if (sessionError.code === 'PGRST116') {
          setError('No workout scheduled for today. Enjoy your rest day!');
          setIsLoading(false);
          return;
        }
        throw sessionError;
      }

      setSession(sessionData);

      // Fetch protocol
      const { data: protocolData, error: protocolError } = await supabase
        .from('protocols')
        .select('*')
        .eq('id', sessionData.protocol_id)
        .single();

      if (protocolError) throw protocolError;

      setProtocol(protocolData);

      // Fetch exercises for this session, ordered by order_index
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('session_exercises')
        .select('*')
        .eq('session_id', sessionData.id)
        .order('order_index', { ascending: true });

      if (exercisesError) throw exercisesError;

      setExercises(exercisesData || []);

      // Check completion status
      await checkCompletionStatus(exercisesData || []);
    } catch (err) {
      console.error('Error fetching today\'s workout:', err);
      setError('Failed to load today\'s workout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkCompletionStatus = async (exercisesList: SessionExercise[]) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const exerciseIds = exercisesList.map((e) => e.id);

      const { data, error } = await supabase
        .from('exercise_logs')
        .select('session_exercise_id')
        .in('session_exercise_id', exerciseIds)
        .gte('logged_at', today.toISOString());

      if (error) throw error;

      // Count unique exercises that have been logged today
      const uniqueExercises = new Set(data?.map((log) => log.session_exercise_id));
      setCompletedCount(uniqueExercises.size);
    } catch (err) {
      console.error('Error checking completion status:', err);
    }
  };

  const handleExerciseComplete = () => {
    setCompletedCount((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading today&apos;s workout...</p>
        </div>
      </div>
    );
  }

  if (error || !session || !protocol) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto p-4 pt-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-4">💤</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {error || 'No workout scheduled'}
            </h2>
            <p className="text-gray-600">
              {error || 'Enjoy your rest day!'}
            </p>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <SessionHeader
        session={session}
        protocol={protocol}
        completedCount={completedCount}
        totalCount={exercises.length}
      />

      <div className="max-w-2xl mx-auto p-4 space-y-3">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onComplete={handleExerciseComplete}
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

      <Navigation />
    </div>
  );
}
