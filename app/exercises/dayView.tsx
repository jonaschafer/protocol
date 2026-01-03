'use client'

import { DayHeader } from '../components/DayHeader'
import { RunHeader } from '../components/RunHeader'
import RunNutrition from '../components/RunNutrition'
import ExerciseList from '../components/ExerciseList'

type Phase = 'durability' | 'specificity' | 'foundation'

interface DayViewProps {
  date: string;
  dayNumber: number | string;
  category?: string;
  phase?: Phase;
}

export function DayView({ date, dayNumber, category, phase = 'durability' }: DayViewProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#272727',
        borderRadius: '30px',
        overflow: 'hidden'
      }}
      data-name="dayView"
    >
      {/* Day Header */}
      <DayHeader 
        date={date}
        dayNumber={dayNumber}
        category={category}
        phase={phase}
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

      {/* Exercise List */}
      <div style={{ padding: '0 20px', paddingBottom: '200px' }}>
        <ExerciseList
          exercises={[
            {
              exerciseName: "Trap Bar Deadlift",
              sets: 3,
              reps: 8,
              weight: "#165",
              exerciseNote: "60%"
            },
            {
              exerciseName: "Barbell Back Squat with Pause at Bottom",
              sets: 4,
              reps: 6,
              exerciseNote: "65%"
            }
          ]}
        />
      </div>
    </div>
  );
}

