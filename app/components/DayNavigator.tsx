'use client';

import { format, addDays, subDays } from 'date-fns';

interface DayNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  protocolName: string;
  onToggleWeekView: () => void;
  showWeekView: boolean;
}

export default function DayNavigator({
  selectedDate,
  onDateChange,
  protocolName,
  onToggleWeekView,
  showWeekView,
}: DayNavigatorProps) {
  const handlePrevDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-2xl mx-auto p-4">
        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={handlePrevDay}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Previous day"
          >
            <span className="text-xl">←</span>
          </button>

          <div className="text-center flex-1">
            <div className="text-lg font-bold text-gray-900">
              {format(selectedDate, 'EEE, MMM d')}
              {isToday && <span className="text-blue-600 ml-2">• Today</span>}
            </div>
            <div className="text-sm text-gray-600">{protocolName}</div>
          </div>

          <button
            onClick={handleNextDay}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Next day"
          >
            <span className="text-xl">→</span>
          </button>
        </div>

        {/* Week View Toggle */}
        <button
          onClick={onToggleWeekView}
          className="w-full py-2 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
        >
          {showWeekView ? '📅 Day View' : '📅 Week View'}
        </button>
      </div>
    </div>
  );
}
