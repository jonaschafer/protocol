'use client';

import { format, parseISO } from 'date-fns';
import { SessionHistory } from '@/lib/types';
import SessionHistoryCard from './SessionHistoryCard';

interface TimelineViewProps {
  sessions: SessionHistory[];
  isLoading: boolean;
}

export default function TimelineView({ sessions, isLoading }: TimelineViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No workout history yet
        </h3>
        <p className="text-gray-600">
          Start logging workouts on the Today tab to see your progress here!
        </p>
      </div>
    );
  }

  // Group sessions by date
  const sessionsByDate = sessions.reduce((acc, session) => {
    const date = session.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {} as Record<string, SessionHistory[]>);

  // Sort dates in reverse chronological order
  const sortedDates = Object.keys(sessionsByDate).sort((a, b) =>
    b.localeCompare(a)
  );

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => {
        const dateSessions = sessionsByDate[date];
        const parsedDate = parseISO(date);
        const isToday = format(new Date(), 'yyyy-MM-dd') === date;

        return (
          <div key={date}>
            {/* Date Header */}
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-bold text-gray-900">
                {format(parsedDate, 'EEEE, MMMM d, yyyy')}
              </h3>
              {isToday && (
                <span className="text-sm text-blue-600 font-medium">
                  • Today
                </span>
              )}
            </div>

            {/* Sessions for this date */}
            <div className="space-y-3">
              {dateSessions.map((session) => (
                <SessionHistoryCard key={session.id} session={session} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
