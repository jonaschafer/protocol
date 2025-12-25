'use client';

import { format, parseISO } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { CalfProgressData } from '@/lib/types';

interface CalfProgressChartProps {
  data: CalfProgressData[];
  isLoading: boolean;
}

const MILESTONE_GOAL = 30;

export default function CalfProgressChart({
  data,
  isLoading,
}: CalfProgressChartProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return null;
  }

  // Transform data for chart
  const chartData = data.map((point) => ({
    date: format(parseISO(point.date), 'MMM dd'),
    fullDate: point.date,
    left: point.leftReps,
    right: point.rightReps,
  }));

  // Get current max values
  const currentLeft = data[data.length - 1]?.leftReps || 0;
  const currentRight = data[data.length - 1]?.rightReps || 0;
  const leftComplete = currentLeft >= MILESTONE_GOAL;
  const rightComplete = currentRight >= MILESTONE_GOAL;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">
          Single-Leg Calf Raise Progress
        </h3>
        <div className="text-sm text-gray-600">
          Goal: {MILESTONE_GOAL} reps
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={[0, 35]}
            label={{
              value: 'Reps',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: '12px', fill: '#6b7280' },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number | undefined) => {
              return value !== undefined ? `${value} reps` : '';
            }}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <ReferenceLine
            y={MILESTONE_GOAL}
            stroke="#6b7280"
            strokeDasharray="5 5"
            label={{
              value: '30 rep milestone',
              position: 'right',
              style: { fontSize: '10px', fill: '#6b7280' },
            }}
          />
          <Line
            type="monotone"
            dataKey="left"
            name="Left Leg"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="right"
            name="Right Leg"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Current Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-3">
          <div
            className={`p-3 rounded-lg border ${
              leftComplete
                ? 'bg-green-50 border-green-300'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="text-xs text-gray-600 mb-1">Left Leg</div>
            <div
              className={`text-2xl font-bold ${
                leftComplete ? 'text-green-600' : 'text-blue-600'
              }`}
            >
              {currentLeft}
              {leftComplete && ' ✓'}
            </div>
          </div>
          <div
            className={`p-3 rounded-lg border ${
              rightComplete
                ? 'bg-green-50 border-green-300'
                : 'bg-green-50/30 border-green-200'
            }`}
          >
            <div className="text-xs text-gray-600 mb-1">Right Leg</div>
            <div
              className={`text-2xl font-bold ${
                rightComplete ? 'text-green-600' : 'text-green-700'
              }`}
            >
              {currentRight}
              {rightComplete && ' ✓'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
