'use client';

import { format, startOfWeek, addDays } from 'date-fns';
import { Session } from '@/lib/types';

interface WeekViewProps {
  selectedDate: Date;
  sessions: (Session & { exerciseCount: number })[];
  onDayClick: (date: Date) => void;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function WeekView({ selectedDate, sessions, onDayClick }: WeekViewProps) {
  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = format(new Date(), 'yyyy-MM-dd');

  const getSessionForDay = (date: Date) => {
    const dayOfWeek = date.getDay();
    return sessions.find((s) => s.day_of_week === dayOfWeek);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Week of {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d')}
      </h2>

      <div className="space-y-2">
        {weekDays.map((date) => {
          const session = getSessionForDay(date);
          const isToday = format(date, 'yyyy-MM-dd') === today;
          const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

          return (
            <button
              key={date.toISOString()}
              onClick={() => onDayClick(date)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : isToday
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="font-semibold text-gray-900">
                    {DAY_NAMES[date.getDay()]} {format(date, 'M/d')}
                  </span>
                  {isToday && <span className="ml-2 text-green-600 text-sm">← Today</span>}
                </div>
                {session && (
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      session.session_type === 'main'
                        ? 'bg-blue-100 text-blue-800'
                        : session.session_type === 'micro'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {session.duration_minutes}min
                  </span>
                )}
              </div>

              {session ? (
                <div className="text-sm text-gray-700">
                  <div className="font-medium">{session.name.split(' - ')[1] || session.name}</div>
                  <div className="text-gray-500 mt-1">{session.exerciseCount} exercises</div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">No workout scheduled</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
