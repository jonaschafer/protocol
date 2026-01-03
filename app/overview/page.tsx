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
import { BaseHeader } from '../components/BaseHeader'
import { DayHeader } from '../components/DayHeader'
import { WeekHeader } from '../components/WeekHeader'
import { RunHeader } from '../components/RunHeader'
import { WeekRunHeader } from '../components/WeekRunHeader'
import RunNutrition from '../components/RunNutrition'
import ExerciseList from '../components/ExerciseList'
import { ExerciseListLogButton } from '../components/ExerciseListLogButton'
import { StatBox } from '../components/StatBox'
import { SetRowStatBox } from '../components/SetRowStatBox'
import { RunHeaderStatBox } from '../components/RunHeaderStatBox'
import { BaseLabeledContent } from '../components/BaseLabeledContent'
import { CuesContent } from '../components/CuesContent'
import { NutritionSection } from '../components/NutritionSection'
import { WeekNotes } from '../components/WeekNotes'
import { ExerciseCard } from '../exercises/exerciseCard'
import { DayView } from '../exercises/dayView'
import { WeekView } from '../components/WeekView'

export default function OverviewPage() {
  const [dayCardCompleted, setDayCardCompleted] = useState(false)
  const [dayExerciseCardCompleted, setDayExerciseCardCompleted] = useState(false)
  const [weekDayCardCompleted, setWeekDayCardCompleted] = useState(false)
  const [isLogged, setIsLogged] = useState(false)
  const [closeButtonClicked, setCloseButtonClicked] = useState(false)

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
                  marginBottom: '5px',
                  flexWrap: 'wrap'
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
                  ExerciseHeader
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexWrap: 'wrap'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#165DFC' }}>uses CuesContent (→BaseLabeledContent)</span>
                </div>
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
                  marginBottom: '5px',
                  flexWrap: 'wrap'
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
                    gap: '4px',
                    flexWrap: 'wrap'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#165DFC' }}>uses DayCard</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
                  <span style={{ color: '#AC47FF' }}>used by ExerciseList</span>
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
                gridColumn: '1 / -1',
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
                CloseButtonWithGradient
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '20px',
                  maxWidth: '824px'
                }}
              >
                {/* Idle State */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center'
                    }}
                  >
                    Idle State
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '150px',
                      position: 'relative',
                      backgroundColor: '#1e1e1e',
                      borderRadius: '20px',
                      overflow: 'hidden'
                    }}
                  >
                    <CloseButtonWithGradient
                      onClick={() => {
                        setCloseButtonClicked(true)
                        console.log('Close clicked')
                        setTimeout(() => setCloseButtonClicked(false), 2000)
                      }}
                    />
                  </div>
                </div>

                {/* Clicked State */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center'
                    }}
                  >
                    Clicked State
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '150px',
                      position: 'relative',
                      backgroundColor: '#1e1e1e',
                      borderRadius: '20px',
                      overflow: 'hidden'
                    }}
                  >
                    <CloseButtonWithGradient
                      onClick={() => {}}
                      demoPressed={true}
                    />
                  </div>
                </div>
              </div>
              {closeButtonClicked && (
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    color: '#165DFC',
                    textAlign: 'center',
                    marginTop: '5px',
                    opacity: 1,
                    transition: 'opacity 0.2s ease-in'
                  }}
                >
                  ✓ Button clicked! (State updated)
                </div>
              )}
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

            {/* Header Relationship Note */}
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
                <strong style={{ color: '#165DFC' }}>Header Hierarchy:</strong> <span style={{ color: '#165DFC' }}>BaseHeader</span> is the base reusable component for headers with phase colors and badges. <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>DayHeader</span> and <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>WeekHeader</span> are wrapper components that use BaseHeader internally.
              </div>
            </div>

            {/* BaseHeader - Base Component */}
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
                  BaseHeader
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
                <BaseHeader phase="durability" category="Durability">
                  <div className="flex justify-between items-center">
                    <div className="text-white text-[26px] font-medium leading-[26px]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      Sample Header
                    </div>
                  </div>
                </BaseHeader>
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
                (Single component with phase variants: durability, specificity, foundation)
              </div>
            </div>

            {/* DayHeader - Uses BaseHeader */}
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
                  marginBottom: '5px',
                  flexWrap: 'wrap'
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
                  DayHeader
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexWrap: 'wrap'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#165DFC' }}>uses BaseHeader</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
                  <span style={{ color: '#AC47FF' }}>used by DayView</span>
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <DayHeader
                  date="Sunday, Apr 4"
                  dayNumber={13}
                  category="Durability"
                />
              </div>
            </div>

            {/* WeekHeader - Uses BaseHeader */}
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
                  marginBottom: '5px',
                  flexWrap: 'wrap'
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
                  WeekHeader
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexWrap: 'wrap'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#165DFC' }}>uses BaseHeader</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
                  <span style={{ color: '#AC47FF' }}>used by WeekView</span>
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <WeekHeader
                  weekNumber={13}
                  category="Durability"
                />
              </div>
            </div>

            {/* DayView Components Relationship Note */}
            <div
              style={{
                gridColumn: '1 / -1',
                backgroundColor: 'rgba(172, 71, 255, 0.1)',
                border: '1px solid rgba(172, 71, 255, 0.3)',
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
                <strong style={{ color: '#AC47FF' }}>DayView Components:</strong> The following components are used by <span style={{ color: '#AC47FF' }}>DayView</span> to compose the full day view.
              </div>
            </div>

            {/* DayHeader - Used by DayView */}
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
                  DayHeader
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
                  <span style={{ color: '#AC47FF' }}>used by DayView</span>
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <DayHeader
                  date="Sunday, Apr 4"
                  dayNumber={13}
                  category="Durability"
                />
              </div>
            </div>

            {/* RunHeader - Used by DayView */}
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
                  marginBottom: '5px',
                  flexWrap: 'wrap'
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
                  RunHeader
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexWrap: 'wrap'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#AC47FF' }}>used by DayView</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
                  <span style={{ color: '#165DFC' }}>uses RunHeaderStatBox</span>
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <RunHeader
                  helper="Long run"
                  miles={18}
                  vert={5200}
                  zone={2}
                  rpe="6-7"
                  route="Wildwood out and back, or a double Nasty"
                />
              </div>
            </div>

            {/* WeekRunHeader - Used by WeekView */}
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
                  marginBottom: '5px',
                  flexWrap: 'wrap'
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
                  WeekRunHeader
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexWrap: 'wrap'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#AC47FF' }}>used by WeekView</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
                  <span style={{ color: '#165DFC' }}>uses RunHeaderStatBox</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
                  <span style={{ color: '#165DFC' }}>uses WeekNotes (→BaseLabeledContent)</span>
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <WeekRunHeader
                  milesCurrent={0}
                  milesTotal={18}
                  vert={2500}
                  notes="Start conservative, establish PT habit"
                />
              </div>
            </div>

            {/* RunNutrition - Used by DayView */}
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
                  RunNutrition
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexWrap: 'wrap'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#AC47FF' }}>used by DayView</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
                  <span style={{ color: '#165DFC' }}>uses NutritionSection (→BaseLabeledContent)</span>
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <RunNutrition />
              </div>
            </div>

            {/* ExerciseList - Used by DayView */}
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
                  ExerciseList
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexWrap: 'wrap'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#AC47FF' }}>used by DayView</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
                  <span style={{ color: '#AC47FF' }}>uses DayExerciseCard</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
                  <span style={{ color: '#AC47FF' }}>uses ExerciseListLogButton</span>
                </div>
              </div>
              <div style={{ width: '100%' }}>
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

            {/* ExerciseListLogButton - Used by ExerciseList */}
            <div
              style={{
                gridColumn: '1 / -1',
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
                  ExerciseListLogButton
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
                  <span style={{ color: '#AC47FF' }}>used by ExerciseList</span>
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '20px',
                  maxWidth: '824px'
                }}
              >
                {/* Default State */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center'
                    }}
                  >
                    Default State
                  </div>
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      padding: '10px'
                    }}
                  >
                    <ExerciseListLogButton onClick={() => console.log('ExerciseListLogButton clicked')} />
                  </div>
                </div>

                {/* Done State */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center'
                    }}
                  >
                    Done State
                  </div>
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      padding: '10px'
                    }}
                  >
                    <ExerciseListLogButton 
                      onClick={() => console.log('ExerciseListLogButton clicked')} 
                      initialDone={true}
                    />
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.4)',
                  textAlign: 'center',
                  marginTop: '5px'
                }}
              >
                Click to toggle between states
              </div>
            </div>

            {/* StatBox Relationship Note */}
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
                <strong style={{ color: '#165DFC' }}>StatBox Hierarchy:</strong> <span style={{ color: '#165DFC' }}>StatBox</span> is the base reusable component for stat boxes (label + value). <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>SetRowStatBox</span> (editable, dark background) and <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>RunHeaderStatBox</span> (read-only, black background) are wrapper components that use StatBox internally.
              </div>
            </div>

            {/* StatBox - Base Component */}
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
                  StatBox
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
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <StatBox
                  label="Miles"
                  value={18}
                  variant="black"
                  width="fixed"
                  fixedWidth="130px"
                />
                <StatBox
                  label="Reps"
                  value="15"
                  variant="dark"
                  width="flex"
                />
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
                (Single component with 'dark' and 'black' variants, editable/read-only modes)
              </div>
            </div>

            {/* SetRowStatBox - Uses StatBox */}
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
                  SetRowStatBox
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
                  <span style={{ color: '#165DFC' }}>uses StatBox</span>
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <SetRowStatBox
                  label="Reps"
                  value="15"
                  onValueChange={(value) => console.log('Reps changed:', value)}
                />
              </div>
            </div>

            {/* RunHeaderStatBox - Uses StatBox */}
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
                  RunHeaderStatBox
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
                  <span style={{ color: '#165DFC' }}>uses StatBox</span>
                </div>
              </div>
              <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
                <RunHeaderStatBox
                  label="Miles"
                  value={18}
                  width="fixed"
                  fixedWidth="130px"
                />
                <RunHeaderStatBox
                  label="Vert"
                  value={5200}
                  width="flex"
                />
              </div>
            </div>

            {/* BaseLabeledContent Relationship Note */}
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
                <strong style={{ color: '#165DFC' }}>LabeledContent Hierarchy:</strong> <span style={{ color: '#165DFC' }}>BaseLabeledContent</span> is the base reusable component for label + content sections. <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Notes</span> (editable), <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>CuesContent</span>, <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>NutritionSection</span>, and <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>WeekNotes</span> are wrapper components that use BaseLabeledContent internally.
              </div>
            </div>

            {/* BaseLabeledContent - Base Component */}
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
                  BaseLabeledContent
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
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#1e1e1e', padding: '12px', borderRadius: '8px' }}>
                <BaseLabeledContent
                  label="Read-only Example"
                  content="This is read-only content with mono font"
                  variant="read-only"
                  contentFont="mono"
                />
                <BaseLabeledContent
                  label="Editable Example"
                  content=""
                  variant="editable"
                  contentFont="inter"
                  placeholder="Type something..."
                />
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
                (Single component with 'editable'/'read-only' variants, 'inter'/'mono' font options)
              </div>
            </div>

            {/* Notes - Uses BaseLabeledContent */}
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
                  Notes
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
                  <span style={{ color: '#165DFC' }}>uses BaseLabeledContent</span>
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <Notes onSave={(value) => console.log('Notes saved:', value)} />
              </div>
            </div>

            {/* CuesContent - Uses BaseLabeledContent */}
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
                  marginBottom: '5px',
                  flexWrap: 'wrap'
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
                  CuesContent
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexWrap: 'wrap'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#165DFC' }}>uses BaseLabeledContent</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
                  <span style={{ color: '#AC47FF' }}>used by ExerciseHeader</span>
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <CuesContent cues="Loop band around foot and anchor it to stable object at ankle height, then sit tall and drive knee toward chest with controlled tempo." />
              </div>
            </div>

            {/* NutritionSection - Uses BaseLabeledContent */}
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
                  marginBottom: '5px',
                  flexWrap: 'wrap'
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
                  NutritionSection
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexWrap: 'wrap'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#165DFC' }}>uses BaseLabeledContent</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
                  <span style={{ color: '#AC47FF' }}>used by RunNutrition</span>
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <NutritionSection
                  label="Before run"
                  content="Toast + jam, water 30min before"
                />
              </div>
            </div>

            {/* WeekNotes - Uses BaseLabeledContent */}
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
                  marginBottom: '5px',
                  flexWrap: 'wrap'
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
                  WeekNotes
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexWrap: 'wrap'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#165DFC' }}>uses BaseLabeledContent</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
                  <span style={{ color: '#AC47FF' }}>used by WeekRunHeader</span>
                </div>
              </div>
              <div style={{ width: '100%' }}>
                <WeekNotes notes="Start conservative, establish PT habit" />
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

            {/* DayView Component Composition Note */}
            <div
              style={{
                gridColumn: '1 / -1',
                backgroundColor: 'rgba(172, 71, 255, 0.1)',
                border: '1px solid rgba(172, 71, 255, 0.3)',
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
                <strong style={{ color: '#AC47FF' }}>DayView Composition:</strong> DayView is composed of <span style={{ color: '#AC47FF' }}>DayHeader</span> (uses <span style={{ color: '#165DFC' }}>BaseHeader</span>), <span style={{ color: '#AC47FF' }}>RunHeader</span> (uses <span style={{ color: '#165DFC' }}>RunHeaderStatBox</span>), <span style={{ color: '#AC47FF' }}>RunNutrition</span> (uses <span style={{ color: '#165DFC' }}>NutritionSection</span>), <span style={{ color: '#AC47FF' }}>ExerciseHeader</span> (uses <span style={{ color: '#165DFC' }}>CuesContent</span>), and <span style={{ color: '#AC47FF' }}>ExerciseList</span> (which includes its own log button component).
              </div>
            </div>

            {/* DayView - Durability Phase */}
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
                  DayView
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexWrap: 'wrap'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#AC47FF' }}>uses DayHeader, RunHeader, RunNutrition, ExerciseList</span>
                </div>
              </div>
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: '#165DFC',
                  marginBottom: '5px',
                  fontWeight: 500
                }}
              >
                Durability Phase (#165DFC)
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
                  phase="durability"
                />
              </div>
            </div>

            {/* DayView - Specificity Phase */}
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
                  DayView
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexWrap: 'wrap'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#AC47FF' }}>uses DayHeader, RunHeader, RunNutrition, ExerciseList</span>
                </div>
              </div>
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: '#AC47FF',
                  marginBottom: '5px',
                  fontWeight: 500
                }}
              >
                Specificity Phase (#AC47FF)
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
                  date="Monday, Apr 5"
                  dayNumber={14}
                  category="Specificity"
                  phase="specificity"
                />
              </div>
            </div>

            {/* DayView - Foundation Phase */}
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
                  DayView
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexWrap: 'wrap'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#AC47FF' }}>uses DayHeader, RunHeader, RunNutrition, ExerciseList</span>
                </div>
              </div>
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: '#FF474A',
                  marginBottom: '5px',
                  fontWeight: 500
                }}
              >
                Foundation Phase (#FF474A)
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
                  date="Tuesday, Apr 6"
                  dayNumber={15}
                  category="Foundation"
                  phase="foundation"
                />
              </div>
            </div>

            {/* WeekView - Durability Phase */}
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '5px',
                  flexWrap: 'wrap'
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
                  WeekView
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexWrap: 'wrap'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#AC47FF' }}>uses WeekHeader (→BaseHeader), WeekRunHeader (→RunHeaderStatBox), WeekExerciseList</span>
                </div>
              </div>
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: '#165DFC',
                  marginBottom: '5px',
                  fontWeight: 500
                }}
              >
                Durability Phase (#165DFC)
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

            {/* WeekView - Specificity Phase */}
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '5px',
                  flexWrap: 'wrap'
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
                  WeekView
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexWrap: 'wrap'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#AC47FF' }}>uses WeekHeader (→BaseHeader), WeekRunHeader (→RunHeaderStatBox), WeekExerciseList</span>
                </div>
              </div>
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: '#AC47FF',
                  marginBottom: '5px',
                  fontWeight: 500
                }}
              >
                Specificity Phase (#AC47FF)
              </div>
              <div
                style={{
                  width: '402px',
                  position: 'relative',
                  minHeight: '800px'
                }}
              >
                <WeekView
                  weekNumber={14}
                  category="Specificity"
                  phase="specificity"
                  milesCurrent={0}
                  milesTotal={20}
                  vert={3000}
                  notes="Focus on race-specific training"
                  days={[
                    {
                      dayName: 'Monday',
                      runInfo: '4 miles',
                      hasPT: true,
                      ptType: 'PT',
                      intensity: 'Rest'
                    },
                    {
                      dayName: 'Tuesday',
                      runInfo: '8 miles',
                      vert: '2000',
                      hasPT: true,
                      ptType: 'Heavy',
                      intensity: 'TTT'
                    },
                    {
                      dayName: 'Wednesday',
                      runInfo: '5 miles',
                      hasPT: true,
                      ptType: 'PT',
                      intensity: 'Easy'
                    }
                  ]}
                />
              </div>
            </div>

            {/* WeekView - Foundation Phase */}
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '5px',
                  flexWrap: 'wrap'
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
                  WeekView
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexWrap: 'wrap'
                  }}
                >
                  <span>→</span>
                  <span style={{ color: '#AC47FF' }}>uses WeekHeader (→BaseHeader), WeekRunHeader (→RunHeaderStatBox), WeekExerciseList</span>
                </div>
              </div>
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: '#FF474A',
                  marginBottom: '5px',
                  fontWeight: 500
                }}
              >
                Foundation Phase (#FF474A)
              </div>
              <div
                style={{
                  width: '402px',
                  position: 'relative',
                  minHeight: '800px'
                }}
              >
                <WeekView
                  weekNumber={15}
                  category="Foundation"
                  phase="foundation"
                  milesCurrent={0}
                  milesTotal={15}
                  vert={1800}
                  notes="Build base fitness and strength"
                  days={[
                    {
                      dayName: 'Monday',
                      runInfo: '2 miles',
                      hasPT: true,
                      ptType: 'PT',
                      intensity: 'Rest'
                    },
                    {
                      dayName: 'Tuesday',
                      runInfo: '5 miles',
                      vert: '1000',
                      hasPT: true,
                      ptType: 'Heavy',
                      intensity: 'Easy'
                    },
                    {
                      dayName: 'Wednesday',
                      runInfo: '3 miles',
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

        {/* Design System Section */}
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
            Design System
          </h2>

          {/* Colors */}
          <div style={{ marginBottom: '40px' }}>
            <h3
              style={{
                fontFamily: 'Instrument Sans, sans-serif',
                fontSize: '20px',
                fontWeight: 500,
                color: 'white',
                marginBottom: '20px'
              }}
            >
              Colors
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px'
              }}
            >
              {/* Background Colors */}
              <div>
                <div
                  style={{
                    backgroundColor: '#272727',
                    height: '80px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px'
                  }}
                >
                  #272727
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <strong>Background</strong><br />
                  Main page background
                </div>
              </div>

              <div>
                <div
                  style={{
                    backgroundColor: '#1e1e1e',
                    height: '80px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px'
                  }}
                >
                  #1e1e1e
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <strong>Container BG</strong><br />
                  Notes, SetRow containers
                </div>
              </div>

              <div>
                <div
                  style={{
                    backgroundColor: '#000',
                    height: '80px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px'
                  }}
                >
                  #000 / black
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <strong>Black</strong><br />
                  DayCard, stat boxes
                </div>
              </div>

              {/* Phase Colors */}
              <div>
                <div
                  style={{
                    backgroundColor: '#165DFC',
                    height: '80px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px'
                  }}
                >
                  #165DFC
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <strong>Durability</strong><br />
                  Phase color, buttons
                </div>
              </div>

              <div>
                <div
                  style={{
                    backgroundColor: '#AC47FF',
                    height: '80px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px'
                  }}
                >
                  #AC47FF
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <strong>Specificity</strong><br />
                  Phase color
                </div>
              </div>

              <div>
                <div
                  style={{
                    backgroundColor: '#FF474A',
                    height: '80px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px'
                  }}
                >
                  #FF474A
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <strong>Foundation</strong><br />
                  Phase color
                </div>
              </div>

              {/* State Colors */}
              <div>
                <div
                  style={{
                    backgroundColor: '#059F00',
                    height: '80px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px'
                  }}
                >
                  #059F00
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <strong>Success/Logged</strong><br />
                  LogButton active state
                </div>
              </div>

              <div>
                <div
                  style={{
                    backgroundColor: '#046D00',
                    height: '80px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px'
                  }}
                >
                  #046D00
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <strong>Completed</strong><br />
                  DayCard completed state
                </div>
              </div>

              <div>
                <div
                  style={{
                    backgroundColor: '#d51c1c',
                    height: '80px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px'
                  }}
                >
                  #d51c1c
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <strong>Delete</strong><br />
                  SetRow delete action
                </div>
              </div>

              <div>
                <div
                  style={{
                    backgroundColor: 'white',
                    height: '80px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1e1e1e',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px'
                  }}
                >
                  white / #ffffff
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <strong>White</strong><br />
                  Text, button backgrounds
                </div>
              </div>

              {/* Opacity Colors */}
              <div>
                <div
                  style={{
                    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(30, 30, 30, 0.6) 100%)',
                    height: '80px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    textAlign: 'center',
                    padding: '8px'
                  }}
                >
                  rgba values
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <strong>Opacity Colors</strong><br />
                  rgba(255,255,255,0.5) - labels<br />
                  rgba(255,255,255,0.2) - dividers<br />
                  rgba(30,30,30,0.6) - SetRow set number
                </div>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div style={{ marginBottom: '40px' }}>
            <h3
              style={{
                fontFamily: 'Instrument Sans, sans-serif',
                fontSize: '20px',
                fontWeight: 500,
                color: 'white',
                marginBottom: '20px'
              }}
            >
              Typography
            </h3>

            {/* Font Families */}
            <div style={{ marginBottom: '30px' }}>
              <h4
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: 'white',
                  marginBottom: '15px'
                }}
              >
                Font Families
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '15px'
                }}
              >
                <div
                  style={{
                    backgroundColor: '#1e1e1e',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Instrument Sans, sans-serif',
                      fontSize: '18px',
                      fontWeight: 500,
                      color: 'white',
                      marginBottom: '8px'
                    }}
                  >
                    Instrument Sans
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Weights: 400, 500<br />
                    Used for: Headings, titles (26px)
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#1e1e1e',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '18px',
                      fontWeight: 400,
                      color: 'white',
                      marginBottom: '8px'
                    }}
                  >
                    Inter
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Weight: 400<br />
                    Used for: Body text, labels (15px)
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#1e1e1e',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Inter Tight, sans-serif',
                      fontSize: '18px',
                      fontWeight: 500,
                      color: 'white',
                      marginBottom: '8px'
                    }}
                  >
                    Inter Tight
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Weights: 400, 500<br />
                    Used for: Large numbers (44px)
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#1e1e1e',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: '18px',
                      fontWeight: 400,
                      color: 'white',
                      marginBottom: '8px'
                    }}
                  >
                    IBM Plex Mono
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Weight: 400<br />
                    Used for: Small text, cues, routes (13px)
                  </div>
                </div>
              </div>
            </div>

            {/* Font Sizes */}
            <div style={{ marginBottom: '30px' }}>
              <h4
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: 'white',
                  marginBottom: '15px'
                }}
              >
                Font Sizes & Line Heights
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '15px'
                }}
              >
                <div
                  style={{
                    backgroundColor: '#1e1e1e',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Inter Tight, sans-serif',
                      fontSize: '44px',
                      fontWeight: 500,
                      lineHeight: '61.102px',
                      color: 'white',
                      marginBottom: '8px'
                    }}
                  >
                    44px
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Line height: 61.102px<br />
                    Weight: 500<br />
                    Used for: Large numbers (reps, weight, stats)
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#1e1e1e',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Instrument Sans, sans-serif',
                      fontSize: '26px',
                      fontWeight: 500,
                      lineHeight: 1.2,
                      color: 'white',
                      marginBottom: '8px'
                    }}
                  >
                    26px
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Line height: 1.2<br />
                    Weight: 500<br />
                    Used for: Headings, titles
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#1e1e1e',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '15px',
                      fontWeight: 400,
                      lineHeight: 'normal',
                      color: 'white',
                      marginBottom: '8px'
                    }}
                  >
                    15px
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Line height: normal<br />
                    Weight: 400<br />
                    Used for: Body text, labels, buttons
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#1e1e1e',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: '13px',
                      fontWeight: 400,
                      lineHeight: 1.49,
                      color: 'white',
                      marginBottom: '8px'
                    }}
                  >
                    13px
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Line height: 1.49 (19.37px)<br />
                    Weight: 400<br />
                    Used for: Small text, cues, routes
                  </div>
                </div>
              </div>
            </div>

            {/* Font Weights */}
            <div>
              <h4
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: 'white',
                  marginBottom: '15px'
                }}
              >
                Font Weights
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '15px'
                }}
              >
                <div
                  style={{
                    backgroundColor: '#1e1e1e',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '18px',
                      fontWeight: 400,
                      color: 'white',
                      marginBottom: '8px'
                    }}
                  >
                    400 (Regular)
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Most body text, labels
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#1e1e1e',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '18px',
                      fontWeight: 500,
                      color: 'white',
                      marginBottom: '8px'
                    }}
                  >
                    500 (Medium)
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Headings, titles, large numbers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

