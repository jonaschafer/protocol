'use client';

import { useState } from 'react';
import { HistoryFilters } from '@/lib/types';

interface FilterBarProps {
  filters: HistoryFilters;
  onFiltersChange: (filters: HistoryFilters) => void;
  exerciseNames: string[];
}

export default function FilterBar({
  filters,
  onFiltersChange,
  exerciseNames,
}: FilterBarProps) {
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showExerciseMenu, setShowExerciseMenu] = useState(false);

  const dateRangeOptions = [
    { value: 'week' as const, label: 'Last 7 days' },
    { value: 'month' as const, label: 'Last 30 days' },
    { value: 'quarter' as const, label: 'Last 90 days' },
    { value: 'all' as const, label: 'All time' },
  ];

  const selectedDateLabel =
    dateRangeOptions.find((opt) => opt.value === filters.dateRange)?.label ||
    'Last 30 days';

  const selectedExerciseLabel = filters.exerciseName || 'All exercises';

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex gap-3">
          {/* Date Range Dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() => {
                setShowDateMenu(!showDateMenu);
                setShowExerciseMenu(false);
              }}
              className="w-full py-2 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-between"
            >
              <span>{selectedDateLabel}</span>
              <span className="text-xs">▼</span>
            </button>

            {showDateMenu && (
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                {dateRangeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onFiltersChange({
                        ...filters,
                        dateRange: option.value,
                      });
                      setShowDateMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      filters.dateRange === option.value
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Exercise Filter Dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() => {
                setShowExerciseMenu(!showExerciseMenu);
                setShowDateMenu(false);
              }}
              className="w-full py-2 px-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium flex items-center justify-between"
            >
              <span className="truncate">{selectedExerciseLabel}</span>
              <span className="text-xs ml-2">▼</span>
            </button>

            {showExerciseMenu && (
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                <button
                  onClick={() => {
                    onFiltersChange({
                      ...filters,
                      exerciseName: null,
                    });
                    setShowExerciseMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-t-lg ${
                    filters.exerciseName === null
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  All exercises
                </button>
                {exerciseNames.map((name) => (
                  <button
                    key={name}
                    onClick={() => {
                      onFiltersChange({
                        ...filters,
                        exerciseName: name,
                      });
                      setShowExerciseMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 last:rounded-b-lg ${
                      filters.exerciseName === name
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      {(showDateMenu || showExerciseMenu) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowDateMenu(false);
            setShowExerciseMenu(false);
          }}
        />
      )}
    </div>
  );
}
