'use client'

import { WeekHeader } from './WeekHeader';
import { WeekRunHeader } from './WeekRunHeader';
import WeekExerciseList from './WeekExerciseList';

interface DayData {
  dayName: string;
  runInfo?: string;
  vert?: string;
  zone?: string;
  hasPT?: boolean;
  ptType?: string;
  intensity?: string;
}

interface WeekViewProps {
  weekNumber: number | string;
  category?: string;
  phase?: 'durability' | 'specificity' | 'foundation';
  milesCurrent: number | string;
  milesTotal: number | string;
  vert: number | string;
  notes?: string;
  days: DayData[];
}

export function WeekView({
  weekNumber,
  category,
  phase = 'durability',
  milesCurrent,
  milesTotal,
  vert,
  notes,
  days
}: WeekViewProps) {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: '#272727',
        borderRadius: '30px',
        overflow: 'hidden'
      }}
      data-name="weekView"
    >
      {/* Week Header */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%' }}>
        <WeekHeader weekNumber={weekNumber} category={category} phase={phase} />
      </div>

      {/* Content Section */}
      <div
        style={{
          padding: '0 20px',
          paddingTop: '140px',
          paddingBottom: '200px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}
      >
        {/* Run Header Section */}
        <WeekRunHeader
          milesCurrent={milesCurrent}
          milesTotal={milesTotal}
          vert={vert}
          notes={notes}
        />

        {/* Exercise List (Days) */}
        <WeekExerciseList days={days} />
      </div>
    </div>
  );
}

