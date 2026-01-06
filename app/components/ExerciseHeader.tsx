'use client'

import { CuesContent } from './CuesContent'

interface ExerciseHeaderProps {
  exerciseName: string;
  restNote: string;
  cues: string;
}

export function ExerciseHeader({ exerciseName, restNote, cues }: ExerciseHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingBottom: '26px',
        paddingTop: '14px',
        paddingLeft: 0,
        paddingRight: 0,
        position: 'relative',
        width: '100%',
        minWidth: 0,
        flexShrink: 0,
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
      data-name="Header"
      data-node-id="232:7356"
    >
      {/* Title */}
      <p
        style={{
          fontFamily: 'Instrument Sans, sans-serif',
          fontWeight: 500,
          lineHeight: 1.2,
          position: 'relative',
          flexShrink: 0,
          fontSize: '26px',
          color: 'white',
          margin: 0,
          padding: 0,
          width: '100%',
          minWidth: 0,
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          boxSizing: 'border-box'
        }}
        data-node-id="232:7357"
      >
        {exerciseName}
      </p>

      {/* Subhead */}
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          lineHeight: 'normal',
          fontStyle: 'normal',
          opacity: 0.5,
          position: 'relative',
          flexShrink: 0,
          fontSize: '15px',
          color: 'white',
          margin: 0,
          padding: 0,
          paddingBottom: '20px',
          width: '100%',
          minWidth: 0,
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          boxSizing: 'border-box'
        }}
        data-node-id="232:7358"
      >
        {restNote}
      </p>

      {/* Divider Line */}
      <div
        style={{
          height: '0',
          width: '100%',
          marginTop: '10px',
          marginBottom: '0',
          borderTop: '0.5px solid rgba(255, 255, 255, 0.2)'
        }}
        data-node-id="232:7362"
      />

      {/* Cues Section */}
      <CuesContent cues={cues} />
    </div>
  );
}

