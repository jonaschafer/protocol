'use client'

interface CloseButtonWithGradientProps {
  onClick: () => void;
  buttonText?: string;
  buttonBackgroundColor?: string;
  gradientHeight?: string;
  buttonBottom?: string;
  zIndex?: number;
}

export function CloseButtonWithGradient({
  onClick,
  buttonText = 'Close',
  buttonBackgroundColor = '#165DFC',
  gradientHeight = '150px',
  buttonBottom = '40px',
  zIndex = 20
}: CloseButtonWithGradientProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: gradientHeight,
        pointerEvents: 'none',
        zIndex: zIndex
      }}
      data-name="close"
      data-node-id="243:4866"
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, black 100%)'
        }}
      >
        <button
          onClick={onClick}
          style={{
            width: '140px',
            height: '40px',
            left: '50%',
            bottom: buttonBottom,
            transform: 'translateX(-50%)',
            position: 'absolute',
            background: buttonBackgroundColor,
            overflow: 'hidden',
            borderRadius: '20px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            display: 'inline-flex',
            border: 'none',
            cursor: 'pointer',
            pointerEvents: 'auto',
            padding: 0
          }}
          data-name="Done Container"
          data-node-id="243:4867"
        >
          <div
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: '15px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '400',
              lineHeight: 'normal',
              wordWrap: 'break-word',
              margin: 0,
              padding: 0
            }}
          >
            {buttonText}
          </div>
        </button>
      </div>
    </div>
  );
}
