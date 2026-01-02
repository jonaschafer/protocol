'use client'

import { DayHeader } from '../components/DayHeader'
import { RunHeader } from '../components/RunHeader'

interface DayViewProps {
  date: string;
  dayNumber: number | string;
  category?: string;
}

export function DayView({ date, dayNumber, category }: DayViewProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
      data-name="dayView"
    >
      {/* Day Header */}
      <DayHeader 
        date={date}
        dayNumber={dayNumber}
        category={category}
      />

      {/* Run Header */}
      <div style={{ padding: '0 20px', paddingTop: '20px' }}>
        <RunHeader
          helper="Long run"
          miles={18}
          vert={5200}
          zone={2}
          rpe="6-7"
          route="Wildwood out and back, or a double Nasty"
        />
      </div>

      {/* TODO: Add runNutrition, exerciseList components */}
    </div>
  );
}

