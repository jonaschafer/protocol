'use client'

import { DayHeader } from '../components/DayHeader'
import { RunHeader } from '../components/RunHeader'
import RunNutrition from '../components/RunNutrition'
import ExerciseList from '../components/ExerciseList'

type Phase = 'durability' | 'specificity' | 'foundation'

interface RunData {
  variant?: 'run' | 'row';
  helper?: string;
  miles: number | string;
  vert?: number | string;
  zone?: number | string;
  rpe?: string;
  route?: string;
  // Row-specific fields
  pace?: number | string;
  spm?: number | string;
  cues?: string;
}

interface Exercise {
  id?: string;
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
  noTopMargin?: boolean;
}

export function DayView({ 
  date, 
  dayNumber, 
  category, 
  phase = 'durability',
  runData,
  exercises = [],
  noTopMargin = false
}: DayViewProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '402px',
        height: '100%',
        backgroundColor: '#272727',
        borderRadius: '30px',
        overflow: 'hidden',
        marginTop: noTopMargin ? '0' : '20px',
        marginLeft: 'auto',
        marginRight: 'auto'
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
              variant={runData.variant || (runData.miles === 'Row' ? 'row' : 'run')}
              helper={runData.helper}
              miles={runData.miles}
              vert={runData.vert}
              zone={runData.zone}
              rpe={runData.rpe}
              route={runData.route}
              pace={runData.pace}
              spm={runData.spm}
              cues={runData.cues}
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
