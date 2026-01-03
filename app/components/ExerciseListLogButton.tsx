'use client'

interface ExerciseListLogButtonProps {
  onClick?: () => void
}

export function ExerciseListLogButton({ onClick }: ExerciseListLogButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'white',
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
          color: '#1e1e1e',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          margin: 0,
          padding: 0
        }}
      >
        Log
      </p>
    </button>
  )
}

