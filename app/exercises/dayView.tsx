'use client'

import { DayHeader } from '../components/DayHeader'
import { RunHeader } from '../components/RunHeader'
import RunNutrition from '../components/RunNutrition'
import DayExerciseCard from '../components/DayExerciseCard'

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

      {/* Exercise Cards */}
      <div style={{ padding: '0 20px', paddingTop: '20px', paddingBottom: '200px' }}>
        <DayExerciseCard
          exerciseName="Trap Bar Deadlift"
          sets={3}
          reps={8}
          weight="#165"
          exerciseNote="60%"
        />
        <div style={{ paddingTop: '13px' }}>
          <DayExerciseCard
            exerciseName="Barbell Back Squat with Pause at Bottom"
            sets={4}
            reps={6}
            exerciseNote="65%"
          />
        </div>
      </div>
    </div>
  );
}

