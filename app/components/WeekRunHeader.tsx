'use client'

interface WeekRunHeaderProps {
  milesCurrent: number | string;
  milesTotal: number | string;
  vert: number | string;
  notes?: string;
}

const SlashIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.0003 5.3335L10.667 26.6668" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function WeekRunHeader({ milesCurrent, milesTotal, vert, notes }: WeekRunHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        position: 'relative',
        width: '100%',
        flexShrink: 0
      }}
      data-name="weekRunHeader"
    >
      {/* Stats Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          position: 'relative',
          flexShrink: 0,
          width: '100%'
        }}
      >
        {/* Miles Box */}
        <div
          style={{
            backgroundColor: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            overflow: 'hidden',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '18px',
            paddingBottom: '18px',
            borderRadius: '20px',
            position: 'relative',
            flexShrink: 0,
            width: '100%',
            height: '68px',
            boxSizing: 'border-box'
          }}
        >
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
          >
            Miles
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <p
              style={{
                fontFamily: 'Inter Tight, sans-serif',
                fontWeight: 500,
                lineHeight: '61.102px',
                position: 'relative',
                flexShrink: 0,
                fontSize: '44px',
                color: 'white',
                margin: 0,
                padding: 0
              }}
            >
              {milesCurrent}
            </p>
            <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SlashIcon />
            </div>
            <p
              style={{
                fontFamily: 'Inter Tight, sans-serif',
                fontWeight: 500,
                lineHeight: '61.102px',
                position: 'relative',
                flexShrink: 0,
                fontSize: '44px',
                color: 'white',
                margin: 0,
                padding: 0
              }}
            >
              {milesTotal}
            </p>
          </div>
        </div>

        {/* Vert Box */}
        <div
          style={{
            backgroundColor: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            overflow: 'hidden',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '18px',
            paddingBottom: '18px',
            borderRadius: '20px',
            position: 'relative',
            flexShrink: 0,
            width: '100%',
            height: '68px',
            boxSizing: 'border-box'
          }}
        >
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
          >
            Vert
          </p>
          <p
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontWeight: 500,
              lineHeight: '61.102px',
              position: 'relative',
              flexShrink: 0,
              fontSize: '44px',
              color: 'white',
              margin: 0,
              padding: 0
            }}
          >
            {vert}
          </p>
        </div>
      </div>

      {/* Notes Section */}
      {notes && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            alignItems: 'flex-start',
            justifyContent: 'center',
            fontStyle: 'normal',
            paddingBottom: '26px',
            paddingTop: '14px',
            paddingLeft: 0,
            paddingRight: 0,
            position: 'relative',
            flexShrink: 0,
            width: '100%',
            height: '80px',
            boxSizing: 'border-box'
          }}
        >
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
              width: '100%'
            }}
          >
            Notes
          </p>
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
          >
            {notes}
          </p>
        </div>
      )}
    </div>
  );
}

