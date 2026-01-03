'use client'

import { useState } from 'react'
import { SetRow } from '../components/SetRow'
import { ExerciseHeader } from '../components/ExerciseHeader'
import { Notes } from '../components/Notes'
import DayCard from '../components/DayCard'
import DayExerciseCard from '../components/DayExerciseCard'
import WeekDayCard from '../components/WeekDayCard'
import { CloseButtonWithGradient } from '../components/CloseButtonWithGradient'
import { BaseButton } from '../components/BaseButton'
import { AddSetButton } from '../components/AddSetButton'
import { LogButton } from '../components/LogButton'
import { ExerciseCard } from '../exercises/exerciseCard'
import { DayView } from '../exercises/dayView'
import { WeekView } from '../components/WeekView'

export default function OverviewPage() {
  const [dayCardCompleted, setDayCardCompleted] = useState(false)
  const [dayExerciseCardCompleted, setDayExerciseCardCompleted] = useState(false)
  const [weekDayCardCompleted, setWeekDayCardCompleted] = useState(false)
  const [isLogged, setIsLogged] = useState(false)

  return (
    <div
      style={{
        backgroundColor: '#272727',
        minHeight: '100vh',
        padding: '40px 20px',
        width: '100%'
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}
      >
        {/* Page Title */}
        <h1
          style={{
            fontFamily: 'Instrument Sans, sans-serif',
            fontSize: '32px',
            fontWeight: 500,
            color: 'white',
            marginBottom: '40px',
            textAlign: 'center'
          }}
        >
          Component Overview
        </h1>

        {/* Individual Components Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2
            style={{
              fontFamily: 'Instrument Sans, sans-serif',
              fontSize: '24px',
              fontWeight: 500,
              color: 'white',
              marginBottom: '30px',
              opacity: 0.8
            }}
          >
            Individual Components
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(402px, 1fr))',
              gap: '30px',
              justifyContent: 'start'
            }}
          >
            {/* SetRow */}
            <div
              style={{
                width: '402px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '5px'
                }}
              >
                SetRow
              </div>
              <div style={{ width: '402px' }}>
                <SetRow
                  setNumber={1}
                  reps="15"
                  weight="0"
                  onRepsChange={(value) => console.log('Reps:', value)}
                  onWeightChange={(value) => console.log('Weight:', value)}
                  onDelete={() => console.log('Delete set')}
                  isTimed={false}
                />
              </div>
            </div>

            {/* ExerciseHeader */}
            <div
              style={{
                width: '402px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '5px'
                }}
              >
                ExerciseHeader
              </div>
              <div style={{ width: '402px' }}>
                <ExerciseHeader
                  exerciseName="Seated Banded Hip Flexor March"
                  restNote="30 seconds rest between sets"
                  cues="Loop band around foot and anchor it to stable object at ankle height, then sit tall and drive knee toward chest with controlled tempo."
                />
              </div>
            </div>

            {/* Notes */}
            <div
              style={{
                width: '402px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '5px'
                }}
              >
                Notes
              </div>
              <div style={{ width: '402px' }}>
                <Notes
                  onSave={(value) => console.log('Notes saved:', value)}
                />
              </div>
            </div>

            {/* Component Relationship Note */}
            <div
              style={{
                gridColumn: '1 / -1',
                backgroundColor: 'rgba(22, 93, 252, 0.1)',
                border: '1px solid rgba(22, 93, 252, 0.3)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '10px'
              }}
            >
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: '1.5'
                }}
              >
                <strong style={{ color: '#165DFC' }}>Component Hierarchy:</strong> <span style={{ color: '#165DFC' }}>DayCard</span> is the base reusable component. <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>DayExerciseCard</span> and <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>WeekDayCard</span> are wrapper components that use DayCard internally.
              </div>
            </div>

            {/* DayCard - Base Component */}
            <div
              style={{
                width: '402px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                border: '2px solid #165DFC',
                borderRadius: '12px',
                padding: '12px',
                boxSizing: 'border-box'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '5px'
                }}
              >
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#165DFC'
                  }}
                >
                  DayCard
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    backgroundColor: 'rgba(22, 93, 252, 0.2)',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}
                >
                  BASE COMPONENT
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <DayCard
                  dayName="Monday"
                  dayLabel="Rest"
                  tags={[
                    { text: '3 miles', variant: 'outlined' },
                    { text: '1500', variant: 'outlined' },
                    { text: 'PT', variant: 'filled' }
                  ]}
                  isCompleted={dayCardCompleted}
                  onToggleComplete={() => setDayCardCompleted(!dayCardCompleted)}
                />
              </div>
            </div>

            {/* DayExerciseCard - Uses DayCard */}
            <div
              style={{
                width: '402px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px',
                boxSizing: 'border-box',
                position: 'relative'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '5px'
                }}
              >
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginBottom: '0'
                  }}
                >
                  DayExerciseCard
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#165DFC' }}>uses DayCard</span>
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <DayExerciseCard
                  exerciseName="Trap Bar Deadlift"
                  sets={3}
                  reps={8}
                  weight="#165"
                  exerciseNote="60%"
                  isCompleted={dayExerciseCardCompleted}
                  onToggleComplete={() => setDayExerciseCardCompleted(!dayExerciseCardCompleted)}
                />
              </div>
            </div>

            {/* WeekDayCard - Uses DayCard */}
            <div
              style={{
                width: '402px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px',
                boxSizing: 'border-box',
                position: 'relative'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '5px'
                }}
              >
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginBottom: '0'
                  }}
                >
                  WeekDayCard
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#165DFC' }}>uses DayCard</span>
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <WeekDayCard
                  dayName="Tuesday"
                  runInfo="6 miles"
                  vert="1500"
                  hasPT={true}
                  ptType="Heavy"
                  intensity="TTT"
                  isCompleted={weekDayCardCompleted}
                  onToggleComplete={() => setWeekDayCardCompleted(!weekDayCardCompleted)}
                />
              </div>
            </div>

            {/* CloseButtonWithGradient */}
            <div
              style={{
                width: '402px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                position: 'relative',
                height: '200px'
              }}
            >
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '5px'
                }}
              >
                CloseButtonWithGradient
              </div>
              <div
                style={{
                  width: '402px',
                  height: '150px',
                  position: 'relative',
                  backgroundColor: '#1e1e1e',
                  borderRadius: '20px',
                  overflow: 'hidden'
                }}
              >
                <CloseButtonWithGradient
                  onClick={() => console.log('Close clicked')}
                />
              </div>
            </div>

            {/* Button Relationship Note */}
            <div
              style={{
                gridColumn: '1 / -1',
                backgroundColor: 'rgba(22, 93, 252, 0.1)',
                border: '1px solid rgba(22, 93, 252, 0.3)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '10px',
                marginTop: '10px'
              }}
            >
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: '1.5'
                }}
              >
                <strong style={{ color: '#165DFC' }}>Button Hierarchy:</strong> <span style={{ color: '#165DFC' }}>BaseButton</span> is a single base reusable button component (with 'outlined' and 'filled' variants). <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>AddSetButton</span> and <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>LogButton</span> are wrapper components that use BaseButton internally.
              </div>
            </div>

            {/* BaseButton - Base Component */}
            <div
              style={{
                width: '402px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                border: '2px solid #165DFC',
                borderRadius: '12px',
                padding: '12px',
                boxSizing: 'border-box'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '5px'
                }}
              >
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#165DFC'
                  }}
                >
                  BaseButton
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    backgroundColor: 'rgba(22, 93, 252, 0.2)',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}
                >
                  BASE COMPONENT
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <BaseButton variant="filled" onClick={() => console.log('BaseButton clicked')}>
                  BaseButton Component
                </BaseButton>
              </div>
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.4)',
                  textAlign: 'center',
                  marginTop: '5px',
                  fontStyle: 'italic'
                }}
              >
                (Single component with 'outlined' and 'filled' variants)
              </div>
            </div>

            {/* AddSetButton - Uses BaseButton */}
            <div
              style={{
                width: '402px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px',
                boxSizing: 'border-box',
                position: 'relative'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '5px'
                }}
              >
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginBottom: '0'
                  }}
                >
                  AddSetButton
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#165DFC' }}>uses BaseButton</span>
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <AddSetButton onClick={() => console.log('Add set clicked')} />
              </div>
            </div>

            {/* LogButton - Uses BaseButton */}
            <div
              style={{
                width: '402px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px',
                boxSizing: 'border-box',
                position: 'relative'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '5px'
                }}
              >
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginBottom: '0'
                  }}
                >
                  LogButton
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#165DFC' }}>uses BaseButton</span>
                </div>
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <LogButton 
                  onClick={() => setIsLogged(!isLogged)} 
                  isLogged={isLogged}
                />
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    textAlign: 'center',
                    marginTop: '-5px'
                  }}
                >
                  Click to toggle logged state
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compiled Pages/Views Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2
            style={{
              fontFamily: 'Instrument Sans, sans-serif',
              fontSize: '24px',
              fontWeight: 500,
              color: 'white',
              marginBottom: '30px',
              opacity: 0.8
            }}
          >
            Compiled Pages/Views
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(402px, 1fr))',
              gap: '30px',
              justifyContent: 'start'
            }}
          >
            {/* ExerciseCard */}
            <div
              style={{
                width: '402px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '5px'
                }}
              >
                ExerciseCard
              </div>
              <div
                style={{
                  width: '402px',
                  position: 'relative',
                  backgroundColor: '#1e1e1e',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  minHeight: '400px'
                }}
              >
                <ExerciseCard
                  exercises={[
                    {
                      id: 'sample-1',
                      exerciseName: 'Seated Banded Hip Flexor March',
                      restNote: '30 seconds rest between sets',
                      cues: 'Loop band around foot and anchor it to stable object at ankle height.',
                      sets: [
                        { id: 1, setNumber: 1, reps: '15', weight: '0', isTimed: false },
                        { id: 2, setNumber: 2, reps: '15', weight: '0', isTimed: false },
                        { id: 3, setNumber: 3, reps: '15', weight: '0', isTimed: false }
                      ],
                      isLogged: false,
                      onDelete: (id) => console.log('Delete set', id),
                      onAddSet: () => console.log('Add set'),
                      onLog: () => console.log('Log exercise'),
                      onRepsChange: (id, value) => console.log('Reps change', id, value),
                      onWeightChange: (id, value) => console.log('Weight change', id, value),
                      onNotesSave: (value) => console.log('Notes save', value)
                    }
                  ]}
                  onDismiss={() => console.log('Dismiss')}
                />
              </div>
            </div>

            {/* DayView */}
            <div
              style={{
                width: '402px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '5px'
                }}
              >
                DayView
              </div>
              <div
                style={{
                  width: '402px',
                  position: 'relative',
                  borderRadius: '30px',
                  overflow: 'hidden',
                  minHeight: '600px'
                }}
              >
                <DayView
                  date="Sunday, Apr 4"
                  dayNumber={13}
                  category="Durability"
                />
              </div>
            </div>

            {/* WeekView */}
            <div
              style={{
                width: '402px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '5px'
                }}
              >
                WeekView
              </div>
              <div
                style={{
                  width: '402px',
                  position: 'relative',
                  minHeight: '800px'
                }}
              >
                <WeekView
                  weekNumber={13}
                  category="Durability"
                  phase="durability"
                  milesCurrent={0}
                  milesTotal={18}
                  vert={2500}
                  notes="Start conservative, establish PT habit"
                  days={[
                    {
                      dayName: 'Monday',
                      runInfo: '3 miles',
                      hasPT: true,
                      ptType: 'PT',
                      intensity: 'Rest'
                    },
                    {
                      dayName: 'Tuesday',
                      runInfo: '6 miles',
                      vert: '1500',
                      hasPT: true,
                      ptType: 'Heavy',
                      intensity: 'TTT'
                    },
                    {
                      dayName: 'Wednesday',
                      runInfo: '4 miles',
                      hasPT: true,
                      ptType: 'PT',
                      intensity: 'Easy'
                    }
                  ]}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

