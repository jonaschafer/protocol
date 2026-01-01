'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Protocol, Session, SessionExercise } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface SessionWithExercises extends Session {
  exercises: SessionExercise[];
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ProtocolDetailPage() {
  const params = useParams();
  const protocolId = params?.id as string;

  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [sessions, setSessions] = useState<SessionWithExercises[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (protocolId) {
      fetchProtocolDetails();
    }
  }, [protocolId]);

  const fetchProtocolDetails = async () => {
    setIsLoading(true);
    try {
      // Fetch protocol
      const { data: protocolData, error: protocolError } = await supabase
        .from('protocols')
        .select('*')
        .eq('id', protocolId)
        .single();

      if (protocolError) throw protocolError;
      setProtocol(protocolData);

      // Fetch sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select('*')
        .eq('protocol_id', protocolId)
        .order('day_of_week', { ascending: true });

      if (sessionsError) throw sessionsError;

      // Fetch exercises for each session
      const sessionsWithExercises: SessionWithExercises[] = await Promise.all(
        (sessionsData || []).map(async (session) => {
          const { data: exercisesData, error: exercisesError } = await supabase
            .from('session_exercises')
            .select('*')
            .eq('session_id', session.id)
            .order('order_index', { ascending: true });

          if (exercisesError) throw exercisesError;

          return {
            ...session,
            exercises: exercisesData || [],
          };
        })
      );

      setSessions(sessionsWithExercises);
    } catch (error) {
      console.error('Error fetching protocol details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateWeeklyCommitment = () => {
    const totalMinutes = sessions.reduce((sum, session) => sum + session.duration_minutes, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}min`;
  };

  const getUniqueEquipment = () => {
    const equipment = new Set<string>();
    sessions.forEach((session) => {
      session.exercises.forEach((exercise) => {
        if (exercise.equipment) {
          equipment.add(exercise.equipment);
        }
      });
    });
    return Array.from(equipment).join(', ');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading protocol details...</p>
        </div>
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <p className="text-gray-600">Protocol not found</p>
            <Link
              href="/protocols"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Protocols
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const mainSessions = sessions.filter((s) => s.session_type === 'main');
  const microSessions = sessions.filter((s) => s.session_type === 'micro');
  const restDays = sessions.filter((s) => s.session_type === 'rest');

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/protocols"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-2"
          >
            <span>←</span>
            <span>Back to Protocols</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{protocol.name}</h1>
          <p className="text-sm text-gray-600 mt-1">{protocol.description}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {/* Weekly Commitment Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">📊 Weekly Commitment</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div>
              <strong>Total Time:</strong> {calculateWeeklyCommitment()}
            </div>
            {mainSessions.length > 0 && (
              <div>
                • {mainSessions.length} main sessions ({mainSessions[0].duration_minutes}min each)
              </div>
            )}
            {microSessions.length > 0 && (
              <div>
                • {microSessions.length} micro sessions ({microSessions[0].duration_minutes}min each)
              </div>
            )}
            {restDays.length > 0 && (
              <div>
                • {restDays.length} rest days (active recovery)
              </div>
            )}
          </div>

          {getUniqueEquipment() && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">🔧 Equipment Needed:</h3>
              <p className="text-sm text-gray-700">{getUniqueEquipment()}</p>
            </div>
          )}
        </div>

        {/* Sessions */}
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {DAY_NAMES[session.day_of_week]} - {session.name.split(' - ')[1] || session.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.session_type === 'main'
                          ? 'bg-blue-100 text-blue-800'
                          : session.session_type === 'micro'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {session.session_type.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600">
                      {session.duration_minutes} min
                    </span>
                  </div>
                </div>
              </div>

              {/* Exercises */}
              {session.exercises.length > 0 ? (
                <div className="space-y-2">
                  {session.exercises.map((exercise, index) => (
                    <div
                      key={exercise.id}
                      className="flex items-start gap-3 p-2 rounded hover:bg-gray-50"
                    >
                      <div className="text-sm font-medium text-gray-500 w-6">
                        {index + 1}.
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {exercise.exercise_name}
                          </span>
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
                        <div className="text-sm text-gray-600 mt-1">
                          {exercise.sets}×{exercise.target_reps}
                          {exercise.target_weight && (
                            <> @ {exercise.target_weight}{exercise.weight_unit}</>
                          )}
                          {exercise.equipment && (
                            <span className="text-gray-500 ml-2">
                              • {exercise.equipment}
                            </span>
                          )}
                        </div>
                        {exercise.notes && (
                          <div className="text-xs text-gray-500 mt-1 italic">
                            {exercise.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">
                  No exercises defined yet
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
