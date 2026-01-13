'use client'

import { BaseLabeledContent } from './BaseLabeledContent'

interface CuesContentProps {
  cues: string
}

interface PTExercise {
  category?: string
  name: string
  sets: string
}

function parsePTFoundationExercises(cues: string): PTExercise[] | null {
  if (!cues.includes('PT FOUNDATION PROGRAM')) {
    return null
  }

  const exercises: PTExercise[] = []
  const lines = cues.split('\n')
  let currentCategory: string | undefined

  for (const line of lines) {
    const trimmed = line.trim()
    
    // Skip empty lines and the header
    if (!trimmed || trimmed.includes('PT FOUNDATION PROGRAM')) {
      continue
    }

    // Check if this is a category header (ends with colon)
    if (trimmed.endsWith(':')) {
      currentCategory = trimmed.slice(0, -1) // Remove the colon
      continue
    }

    // Check if this is an exercise (starts with bullet point or dash)
    if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
      const exerciseText = trimmed.replace(/^[•\-]\s*/, '') // Remove bullet/dash
      // Split exercise name and sets/reps (format: "Exercise Name - Sets/Reps")
      const parts = exerciseText.split(' - ')
      if (parts.length >= 2) {
        exercises.push({
          category: currentCategory,
          name: parts[0].trim(),
          sets: parts.slice(1).join(' - ').trim()
        })
      } else {
        // If no dash separator, treat entire line as exercise name
        exercises.push({
          category: currentCategory,
          name: exerciseText.trim(),
          sets: ''
        })
      }
    }
  }

  return exercises.length > 0 ? exercises : null
}

export function CuesContent({ cues }: CuesContentProps) {
  const ptExercises = parsePTFoundationExercises(cues)

  // If PT Foundation exercises are detected, render as scrollable list
  if (ptExercises) {
    let currentCategory: string | undefined

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          alignItems: 'flex-start',
          justifyContent: 'center',
          fontStyle: 'normal',
          paddingTop: '14px',
          paddingBottom: '0',
          paddingLeft: 0,
          paddingRight: '16px',
          position: 'relative',
          flexShrink: 0,
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
          overflow: 'clip'
        }}
      >
        {/* Label */}
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            lineHeight: 'normal',
            fontStyle: 'normal',
            opacity: 0.5,
            position: 'relative',
            flexShrink: 0,
            minWidth: 0,
            fontSize: '15px',
            color: 'white',
            margin: 0,
            padding: 0,
            paddingBottom: '8px'
          }}
        >
          Cues
        </p>

        {/* Scrollable Exercise List */}
        <div
          style={{
            width: '100%',
            maxHeight: '400px',
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {ptExercises.map((exercise, index) => {
            const showCategory = exercise.category && exercise.category !== currentCategory
            if (showCategory) {
              currentCategory = exercise.category
            }

            return (
              <div key={index}>
                {/* Category Header */}
                {showCategory && (
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      fontSize: '15px',
                      color: 'white',
                      margin: 0,
                      padding: 0,
                      paddingBottom: '4px',
                      opacity: 0.7
                    }}
                  >
                    {exercise.category}
                  </p>
                )}

                {/* Exercise Item */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    paddingLeft: showCategory ? '0' : '0',
                    paddingBottom: '8px'
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: '13px',
                      lineHeight: 1.49,
                      fontWeight: 400,
                      color: 'white',
                      margin: 0,
                      padding: 0
                    }}
                  >
                    {exercise.name}
                    {exercise.sets && (
                      <span style={{ opacity: 0.7 }}> - {exercise.sets}</span>
                    )}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Default: render as normal paragraph
  return (
    <BaseLabeledContent
      label="Cues"
      content={cues}
      variant="read-only"
      contentFont="mono"
      paddingTop="14px"
      paddingBottom="0"
      containerStyle={{
        overflow: 'clip',
        paddingRight: '16px'
      }}
    />
  )
}



