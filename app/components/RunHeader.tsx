'use client'

interface RunHeaderProps {
  helper?: string; // e.g., "Long run"
  miles: number | string;
  vert: number | string;
  zone: number | string;
  rpe: string;
  route: string;
}

export function RunHeader({ helper, miles, vert, zone, rpe, route }: RunHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        position: 'relative',
        width: '100%',
        flexShrink: 0
      }}
      data-name="runHeader"
    >
      {/* Header Section */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          paddingBottom: '20px',
          paddingTop: '30px',
          paddingLeft: 0,
          paddingRight: 0,
          position: 'relative',
          flexShrink: 0,
          width: '100%',
          boxSizing: 'border-box'
        }}
        data-name="Header"
      >
        {/* Title */}
        <p
          style={{
            fontFamily: 'Instrument Sans, sans-serif',
            fontWeight: 500,
            lineHeight: 1,
            position: 'relative',
            flexShrink: 0,
            fontSize: '26px',
            color: 'white',
            margin: 0,
            padding: 0
          }}
        >
          Run
        </p>
        
        {/* Helper Text */}
        {helper && (
          <p
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontWeight: 400,
              lineHeight: 1.49,
              fontStyle: 'normal',
              position: 'relative',
              flexShrink: 0,
              fontSize: '13px',
              color: 'white',
              textAlign: 'right',
              margin: 0,
              padding: 0
            }}
          >
            {helper}
          </p>
        )}
      </div>

      {/* Stats and Route Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          position: 'relative',
          flexShrink: 0,
          width: '100%'
        }}
      >
        {/* Stats Grid */}
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
          {/* Top Row: Miles and Vert */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
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
                width: '130px',
                height: '68px',
                boxSizing: 'border-box'
              }}
              data-name="Sets Container"
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
                {miles}
              </p>
            </div>

            {/* Vert Box */}
            <div
              style={{
                backgroundColor: 'black',
                display: 'flex',
                flex: '1 1 0',
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
                minWidth: 0,
                height: '68px',
                boxSizing: 'border-box'
              }}
              data-name="Sets Container"
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

          {/* Bottom Row: Zone and RPE */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              justifyContent: 'flex-start',
              position: 'relative',
              flexShrink: 0,
              width: '100%'
            }}
          >
            {/* Zone Box */}
            <div
              style={{
                backgroundColor: 'black',
                display: 'flex',
                flex: '1 1 0',
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
                minWidth: 0,
                height: '68px',
                boxSizing: 'border-box'
              }}
              data-name="Sets Container"
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
                Zone
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
                {zone}
              </p>
            </div>

            {/* RPE Box */}
            <div
              style={{
                backgroundColor: 'black',
                display: 'flex',
                flex: '1 1 0',
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
                minWidth: 0,
                height: '68px',
                boxSizing: 'border-box'
              }}
              data-name="Sets Container"
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
                RPE
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
                {rpe}
              </p>
            </div>
          </div>
        </div>

        {/* Route Section */}
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
            boxSizing: 'border-box'
          }}
          data-name="Header"
        >
          {/* Route Label */}
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
            Route
          </p>

          {/* Route Description */}
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
            {route}
          </p>
        </div>
      </div>
    </div>
  );
}

