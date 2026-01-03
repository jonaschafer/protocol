'use client'

import { DayHeader } from '../components/DayHeader'
import { RunHeader } from '../components/RunHeader'
import RunNutrition from '../components/RunNutrition'
import ExerciseList from '../components/ExerciseList'

type Phase = 'durability' | 'specificity' | 'foundation'

interface RunData {
  helper?: string;
  miles: number | string;
  vert?: number | string;
  zone?: number | string;
  rpe?: string;
  route?: string;
}

interface Exercise {
  exerciseName: string;
  sets?: number;
  reps?: number | string;
  weight?: string;
  exerciseNote?: string;
}

interface DayViewProps {
  date: string;
  dayNumber: number | string;
  category?: string;
  phase?: Phase;
  runData?: RunData;
  exercises?: Exercise[];
}

export function DayView({ 
  date, 
  dayNumber, 
  category, 
  phase = 'durability',
  runData,
  exercises = []
}: DayViewProps) {
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
      {runData && (
        <>
          <div style={{ padding: '0 20px', paddingTop: '20px' }}>
            <RunHeader
              helper={runData.helper}
              miles={runData.miles}
              vert={runData.vert || 0}
              zone={runData.zone || 0}
              rpe={runData.rpe || ''}
              route={runData.route || ''}
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
        </>
      )}

      {/* Exercise List */}
      {exercises.length > 0 && (
        <div style={{ padding: '0 20px', paddingBottom: '200px', paddingTop: runData ? '0' : '20px' }}>
          <ExerciseList exercises={exercises} />
        </div>
      )}
    </div>
  );
}

