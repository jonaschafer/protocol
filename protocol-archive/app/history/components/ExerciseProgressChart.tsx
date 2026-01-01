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
} from 'recharts';
import { ExerciseLogWithContext } from '@/lib/types';
import { calculateExerciseVolume } from '@/lib/historyUtils';

interface ExerciseProgressChartProps {
  logs: ExerciseLogWithContext[];
  exerciseName: string;
}

export default function ExerciseProgressChart({
  logs,
  exerciseName,
}: ExerciseProgressChartProps) {
  if (logs.length === 0) {
    return null;
  }

  // Transform logs into chart data
  const chartData = logs
    .map((log) => {
      const volume = calculateExerciseVolume(log);
      const totalReps = log.reps_per_set.reduce(
        (sum, r) => sum + parseInt(r),
        0
      );

      return {
        date: format(parseISO(log.date), 'MMM dd'),
        fullDate: log.date,
        weight: log.weight_used || 0,
        volume,
        reps: totalReps,
        repsDisplay: log.reps_per_set.join(','),
      };
    })
    .reverse(); // Reverse to show oldest to newest

  // Check if exercise has weight data
  const hasWeightData = chartData.some((d) => d.weight > 0);

  if (!hasWeightData) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200 mb-4">
        <p className="text-gray-600 text-sm">
          No weight progression data available for {exerciseName}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <h3 className="font-semibold text-gray-900 mb-4">
        {exerciseName} Progression
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            yAxisId="left"
            stroke="#3b82f6"
            style={{ fontSize: '12px' }}
            label={{
              value: 'Weight (lbs)',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: '12px', fill: '#6b7280' },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#10b981"
            style={{ fontSize: '12px' }}
            label={{
              value: 'Volume (lbs)',
              angle: 90,
              position: 'insideRight',
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
            formatter={(value: number | undefined, name: string | undefined) => {
              if (value === undefined) return '';
              if (name === 'Weight') return `${value} lbs`;
              if (name === 'Volume') return `${Math.round(value)} lbs`;
              return value;
            }}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="weight"
            name="Weight"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="volume"
            name="Volume"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
