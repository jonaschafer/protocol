'use client'

import { useState } from 'react'

interface ExerciseListLogButtonProps {
  onClick?: () => void
  initialDone?: boolean
}

export function ExerciseListLogButton({ onClick, initialDone = false }: ExerciseListLogButtonProps) {
  const [isDone, setIsDone] = useState(initialDone)

  const handleClick = () => {
    if (isDone) {
      // Undo the done state
      setIsDone(false)
    } else {
      // Set to done state
      setIsDone(true)
    }
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      style={{
        background: isDone ? '#059F00' : 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        width: '140px',
        height: '41px',
        position: 'relative',
        borderRadius: '20px',
        flexShrink: 0,
        border: 'none',
        cursor: 'pointer'
      }}
    >
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          lineHeight: 'normal',
          fontStyle: 'normal',
          position: 'relative',
          flexShrink: 0,
          fontSize: '15px',
          color: isDone ? 'white' : '#1e1e1e',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          margin: 0,
          padding: 0
        }}
      >
        {isDone ? 'Done' : 'Log'}
      </p>
    </button>
  )
}

