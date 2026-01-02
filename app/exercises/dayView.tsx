'use client'

import { DayHeader } from '../components/DayHeader'
import { RunHeader } from '../components/RunHeader'
import RunNutrition from '../components/RunNutrition'

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

      {/* Divider Line */}
      <div style={{ padding: '0 20px', paddingTop: '25px', paddingBottom: '25px' }}>
        <div
          style={{
            height: '0',
            width: '100%',
            borderTop: '0.5px solid rgba(255, 255, 255, 0.2)'
          }}
        />
      </div>

      {/* Run Nutrition */}
      <div style={{ padding: '0 20px', paddingTop: '0' }}>
        <RunNutrition />
      </div>

      {/* TODO: Add exerciseList components */}
    </div>
  );
}

