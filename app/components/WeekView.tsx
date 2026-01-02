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
        height: '100%',
        position: 'relative',
        background: '#272727',
        overflow: 'hidden',
        borderRadius: 30,
        borderLeft: '1px rgba(255, 255, 255, 0.10) solid',
        borderTop: '1px rgba(255, 255, 255, 0.10) solid',
        borderRight: '1px rgba(255, 255, 255, 0.10) solid'
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
          width: 362,
          left: 20,
          top: 140,
          position: 'absolute',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 20,
          display: 'inline-flex'
        }}
      >
        {/* Run Header Section */}
        <div
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 20,
            display: 'flex',
            width: '100%'
          }}
        >
          <WeekRunHeader
            milesCurrent={milesCurrent}
            milesTotal={milesTotal}
            vert={vert}
            notes={notes}
          />
        </div>

        {/* Exercise List (Days) */}
        <WeekExerciseList days={days} />
      </div>
    </div>
  );
}

