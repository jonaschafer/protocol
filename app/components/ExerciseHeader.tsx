'use client'

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
        gap: '12px',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingBottom: '26px',
        paddingTop: '14px',
        paddingLeft: 0,
        paddingRight: 0,
        position: 'relative',
        width: '100%',
        flexShrink: 0
      }}
      data-name="Header"
      data-node-id="232:7356"
    >
      {/* Title */}
      <p
        style={{
          fontFamily: 'Instrument Sans, sans-serif',
          fontWeight: 500,
          lineHeight: 'normal',
          position: 'relative',
          flexShrink: 0,
          fontSize: '26px',
          color: 'white',
          margin: 0,
          padding: 0
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
          padding: 0
        }}
        data-node-id="232:7358"
      >
        {restNote}
      </p>

      {/* Cues Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'flex-start',
          fontStyle: 'normal',
          overflow: 'clip',
          paddingLeft: 0,
          paddingRight: '16px',
          paddingTop: '20px',
          paddingBottom: '20px',
          position: 'relative',
          flexShrink: 0,
          width: '100%',
          boxSizing: 'border-box'
        }}
        data-name="Notes Container"
        data-node-id="232:7359"
      >
        {/* Cues Label */}
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
            width: '100%',
            color: 'white',
            margin: 0,
            padding: 0
          }}
          data-node-id="232:7360"
        >
          Cues
        </p>

        {/* Cues Content */}
        <p
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontWeight: 400,
            lineHeight: 1.49,
            position: 'relative',
            flexShrink: 0,
            fontSize: '13px',
            width: '100%',
            color: 'white',
            margin: 0,
            padding: 0
          }}
          data-node-id="232:7361"
        >
          {cues}
        </p>
      </div>

      {/* Divider Line */}
      <div
        style={{
          position: 'absolute',
          height: '0',
          left: 0,
          top: '82px',
          width: '100%',
          borderTop: '0.5px solid rgba(255, 255, 255, 0.2)'
        }}
        data-node-id="232:7362"
      />
    </div>
  );
}

