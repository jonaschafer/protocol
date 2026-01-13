'use client'

import { useState, useRef, useEffect } from "react";

interface SetRowProps {
  setNumber: number;
  reps: string;
  weight: string;
  onRepsChange?: (value: string) => void;
  onWeightChange?: (value: string) => void;
  onDelete?: () => void;
  opacity?: number;
  isTimed?: boolean;
}

export function SetRow({ 
  setNumber, 
  reps, 
  weight, 
  onRepsChange, 
  onWeightChange,
  onDelete,
  opacity = 1,
  isTimed = false
}: SetRowProps) {
  const [localReps, setLocalReps] = useState(reps);
  const [localWeight, setLocalWeight] = useState(weight);
  const [dragDistance, setDragDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasHapticked, setHasHapticked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCommitted, setIsCommitted] = useState(false);
  const [isAnimatingBack, setIsAnimatingBack] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const rowWidthRef = useRef(0);
  const velocityHistoryRef = useRef<Array<{ x: number; time: number }>>([]);
  const pointerIdRef = useRef<number | null>(null);
  const GAP = 10; // 10px gap between red box and row content
  const TRASH_ICON_SIZE = 68; // When red box reaches 68px, show trash icon
  const VELOCITY_THRESHOLD = -0.5; // px/ms (negative = left swipe)
  const VELOCITY_WINDOW_MS = 100; // Measure velocity over last 100ms

  // Refs for measuring container and label widths
  const repsContainerRef = useRef<HTMLDivElement>(null);
  const repsLabelMeasureRef = useRef<HTMLSpanElement>(null);
  const weightContainerRef = useRef<HTMLDivElement>(null);
  const weightLabelMeasureRef = useRef<HTMLSpanElement>(null);

  // State for dynamic label visibility
  const [showRepsLabel, setShowRepsLabel] = useState(true);
  const [showWeightLabel, setShowWeightLabel] = useState(true);

  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleReducedMotionChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  // Measure and update label visibility based on available space
  useEffect(() => {
    const MIN_GAP = 6; // Minimum gap before hiding label
    const PADDING_LEFT = 16;
    const PADDING_RIGHT = 16;

    const checkLabelVisibility = () => {
      // Check Reps container
      if (repsContainerRef.current && repsLabelMeasureRef.current) {
        const containerWidth = repsContainerRef.current.offsetWidth;
        const labelWidth = repsLabelMeasureRef.current.offsetWidth;
        // Calculate actual input width based on content
        const inputWidth = Math.max(localReps.length * 28, 44); // Match getInputWidth logic
        const availableWidth = containerWidth - PADDING_LEFT - PADDING_RIGHT;
        const requiredWidth = labelWidth + MIN_GAP + inputWidth;
        setShowRepsLabel(availableWidth >= requiredWidth);
      }

      // Check Weight container
      if (weightContainerRef.current && weightLabelMeasureRef.current) {
        const containerWidth = weightContainerRef.current.offsetWidth;
        const labelWidth = weightLabelMeasureRef.current.offsetWidth;
        // Calculate actual input width based on content
        const inputWidth = Math.max(localWeight.length * 28, 44); // Match getInputWidth logic
        const availableWidth = containerWidth - PADDING_LEFT - PADDING_RIGHT;
        const requiredWidth = labelWidth + MIN_GAP + inputWidth;
        setShowWeightLabel(availableWidth >= requiredWidth);
      }
    };

    // Initial check after a brief delay to ensure DOM is ready
    const initialTimeout = setTimeout(checkLabelVisibility, 0);

    // Use ResizeObserver for efficient measurement
    const resizeObserver = new ResizeObserver(() => {
      checkLabelVisibility();
    });

    if (repsContainerRef.current) {
      resizeObserver.observe(repsContainerRef.current);
    }
    if (weightContainerRef.current) {
      resizeObserver.observe(weightContainerRef.current);
    }

    // Also check when values change (affects input width)
    const valueChangeTimeout = setTimeout(checkLabelVisibility, 0);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(initialTimeout);
      clearTimeout(valueChangeTimeout);
    };
  }, [localReps, localWeight, isTimed]);

  // Haptic feedback helper
  const triggerHaptic = () => {
    if (hasHapticked) return;
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
      setHasHapticked(true);
    }
  };

  // Calculate velocity from history
  const calculateVelocity = (): number => {
    const history = velocityHistoryRef.current;
    if (history.length < 2) return 0;

    const now = Date.now();
    const windowStart = now - VELOCITY_WINDOW_MS;
    
    // Filter to recent points
    const recentPoints = history.filter(point => point.time >= windowStart);
    if (recentPoints.length < 2) return 0;

    const first = recentPoints[0];
    const last = recentPoints[recentPoints.length - 1];
    const timeDelta = last.time - first.time;
    
    if (timeDelta === 0) return 0;
    
    return (last.x - first.x) / timeDelta; // px/ms
  };

  // Handle drag start
  const handleStart = (clientX: number, pointerId?: number) => {
    if (containerRef.current) {
      rowWidthRef.current = containerRef.current.offsetWidth;
      startXRef.current = clientX; // Anchor to initial pointer position
      setIsDragging(true);
      setHasHapticked(false);
      setIsCommitted(false);
      setIsAnimatingBack(false);
      velocityHistoryRef.current = [{ x: clientX, time: Date.now() }];
      setDragDistance(0); // Reset for new drag
      
      // Capture pointer if pointerId provided
      if (pointerId !== undefined && containerRef.current) {
        pointerIdRef.current = pointerId;
        try {
          containerRef.current.setPointerCapture(pointerId);
        } catch (e) {
          // Pointer capture not supported, continue without it
        }
      }
    }
  };

  // Handle drag move
  const handleMove = (clientX: number) => {
    if (!isDragging) return;

    const now = Date.now();
    const diff = startXRef.current - clientX; // Positive = left swipe
    
    // Only allow left swipe
    if (diff > 0) {
      // Track velocity (before committing)
      if (!isCommitted) {
        velocityHistoryRef.current.push({ x: clientX, time: now });
        // Keep only recent history (last 200ms)
        velocityHistoryRef.current = velocityHistoryRef.current.filter(
          point => now - point.time < 200
        );
      }

      // Calculate max red box width (row width - gap)
      const maxRedBoxWidth = rowWidthRef.current - GAP;
      const redBoxWidth = Math.min(diff, maxRedBoxWidth);
      
      // 40% threshold - auto-commit when dragged past 40% of row width
      const threshold40Percent = rowWidthRef.current * 0.4;
      
      // When drag past 40%, commit to delete and continue swiping
      if (diff >= threshold40Percent && !isCommitted) {
        setIsCommitted(true);
        // Continue to full delete position
        setDragDistance(Math.max(diff, maxRedBoxWidth));
      } else if (isCommitted) {
        // After committing, continue to full delete position
        setDragDistance(Math.max(diff, maxRedBoxWidth));
      } else {
        // Before 40%, normal drag
        setDragDistance(diff);
      }

      // When red box reaches 68px, trigger haptic and show trash icon
      if (redBoxWidth >= TRASH_ICON_SIZE && !hasHapticked) {
        triggerHaptic();
      }
    }
  };

  // Check delete intent (distance OR velocity)
  const hasDeleteIntent = (): boolean => {
    const maxRedBoxWidth = rowWidthRef.current > 0 ? rowWidthRef.current - GAP : 0;
    const distanceThreshold = maxRedBoxWidth;
    
    // Delete if distance threshold reached
    if (dragDistance >= distanceThreshold) {
      return true;
    }
    
    // OR delete if velocity threshold reached (quick flick)
    const velocity = calculateVelocity();
    if (velocity <= VELOCITY_THRESHOLD) {
      return true;
    }
    
    return false;
  };

  // Handle drag end
  const handleEnd = () => {
    if (!isDragging) return;

    // Release pointer capture
    if (pointerIdRef.current !== null && containerRef.current) {
      try {
        containerRef.current.releasePointerCapture(pointerIdRef.current);
      } catch (e) {
        // Ignore errors
      }
      pointerIdRef.current = null;
    }
    
    // If already committed (past 40%), proceed with deletion
    const deleteIntent = isCommitted || hasDeleteIntent();
    
    if (deleteIntent && onDelete) {
      // Continue motion smoothly in same direction
      setIsCommitted(true);
      setIsDeleting(true);
      
      // Continue translating offscreen
      const maxRedBoxWidth = rowWidthRef.current > 0 ? rowWidthRef.current - GAP : 0;
      const finalDistance = Math.max(dragDistance, maxRedBoxWidth);
      setDragDistance(finalDistance);
      
      const deleteDelay = prefersReducedMotion ? 0 : 300;
      const pauseDelay = prefersReducedMotion ? 0 : 100;
      
      setTimeout(() => {
        // Brief pause before removal
        setTimeout(() => {
          onDelete();
        }, pauseDelay);
      }, deleteDelay);
    } else {
      // Ease back to rest position
      setIsAnimatingBack(true);
      setDragDistance(0);
    }
    
    setIsDragging(false);
    setHasHapticked(false);
    velocityHistoryRef.current = [];
  };

  // Pointer event handlers (unified for mouse and touch)
  // Use capture phase to intercept events before children can capture them
  const handlePointerDownCapture = (e: React.PointerEvent) => {
    // Only handle primary pointer (left mouse button or first touch)
    if (e.isPrimary && !isDragging) {
      // Capture pointer immediately to ensure we get all events
      handleStart(e.clientX, e.pointerId);
      // Prevent default to stop text selection/scrolling
      e.preventDefault();
      // Don't stop propagation - let events continue to bubble for pointer capture to work
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging && e.isPrimary) {
      e.preventDefault();
      handleMove(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging && e.isPrimary) {
      handleEnd();
    }
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    if (isDragging && e.isPrimary) {
      handleEnd();
    }
  };

  // Keyboard handlers
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && onDelete) {
      e.preventDefault();
      onDelete();
    }
  };

  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalReps(value);
    onRepsChange?.(value);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalWeight(value);
    onWeightChange?.(value);
  };

  // Calculate input width based on content (for shrink-wrapping)
  const getInputWidth = (value: string): string => {
    // For 44px font, each character is roughly 28px wide
    // Add some padding and ensure minimum touch target
    const charWidth = 28;
    const minWidth = 44; // Minimum touch target
    const calculatedWidth = Math.max(value.length * charWidth, minWidth);
    return `${calculatedWidth}px`;
  };

  // Calculate red box dimensions and positions
  const maxRedBoxWidth = rowWidthRef.current > 0 ? rowWidthRef.current - GAP : 0;
  
  // During drag: red box expands (clamped to max), row moves unbounded with gap
  // When committed: red box stops expanding, both translate left together
  const redBoxWidth = isCommitted 
    ? maxRedBoxWidth // Red box stops expanding
    : Math.min(dragDistance, maxRedBoxWidth);
  
  // Row can translate fully offscreen - unbounded drag
  const rowContentTranslateX = isCommitted
    ? rowWidthRef.current + GAP // Row fully exits
    : dragDistance > 0 
      ? dragDistance + GAP // Row moves with drag + gap (unbounded)
      : 0; // At rest, no translation
  
  // Trash icon appears when red box reaches 68px
  const showTrashIcon = redBoxWidth >= TRASH_ICON_SIZE;
  const trashIconOpacity = showTrashIcon ? 1 : 0;
  
  // Red box translate when committed
  const redBoxTranslateX = isCommitted ? -(rowWidthRef.current - maxRedBoxWidth) : 0;

  return (
    <div
      ref={containerRef}
      onPointerDownCapture={handlePointerDownCapture}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={{
        position: 'relative',
        width: '100%',
        height: '68px',
        overflow: 'hidden',
        touchAction: 'none', // Take full control of touch gestures to allow horizontal dragging
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: opacity
      }}
      data-name="set-row"
      data-node-id="226:6013"
    >
      {/* Red Delete Box - Expands from right, then translates left */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: `${redBoxWidth}px`,
          height: '68px',
          backgroundColor: '#d51c1c',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateX(${redBoxTranslateX}px)`,
          transition: isDragging || isCommitted
            ? 'none'
            : isAnimatingBack
            ? prefersReducedMotion
              ? 'width 0.1s linear, transform 0.1s linear'
              : 'width 0.25s ease-out, transform 0.25s ease-out'
            : prefersReducedMotion
            ? 'width 0.1s linear, transform 0.1s linear'
            : 'width 0.2s ease-out, transform 0.2s ease-out',
          zIndex: 1,
          overflow: 'hidden'
        }}
        aria-hidden="true"
      >
        {/* Trash Icon - Fades in at 68px */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            opacity: trashIconOpacity,
            transition: prefersReducedMotion ? 'none' : 'opacity 0.15s ease-out',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <path
            d="M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9"
            fill="white"
          />
          <path
            d="M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9H20Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 6H15.375M15.375 6V4C15.375 2.89543 14.4796 2 13.375 2H10.625C9.52043 2 8.625 2.89543 8.625 4V6M15.375 6H8.625M3 6H8.625"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Sliding Content */}
      <div
        tabIndex={0}
        role="button"
        aria-label={`Set ${setNumber}, swipe left to delete. Press Delete or Backspace to remove.`}
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          position: 'relative',
          width: '100%',
          height: '68px',
          paddingLeft: '0',
          paddingRight: '0',
          boxSizing: 'border-box',
          transform: `translateX(-${rowContentTranslateX}px)`,
          transition: isDragging || isCommitted
            ? 'none'
            : isAnimatingBack
            ? prefersReducedMotion
              ? 'transform 0.1s linear'
              : 'transform 0.25s ease-out'
            : prefersReducedMotion
            ? 'transform 0.1s linear'
            : 'transform 0.2s ease-out',
          userSelect: 'none',
          zIndex: 2,
          backgroundColor: isDeleting ? 'transparent' : undefined,
          pointerEvents: isDragging ? 'none' : 'auto' // Disable pointer events on children during drag
        }}
      >
      {/* Set Number Container */}
      <div
        style={{
          backgroundColor: 'rgba(30, 30, 30, 0.6)',
          display: 'flex',
          height: '68px',
          alignItems: 'center',
          justifyContent: 'flex-start',
          overflow: 'hidden',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingTop: '18px',
          paddingBottom: '18px',
          position: 'relative',
          borderRadius: '10px',
          flexShrink: 1,
          flexGrow: 0,
          minWidth: '20px',
          boxSizing: 'border-box'
        }}
        data-name="Sets Container"
        data-node-id="226:6014"
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
            whiteSpace: 'nowrap',
            color: 'white',
            margin: 0,
            padding: 0
          }}
          data-node-id="226:6015"
        >
          {setNumber}
        </p>
      </div>

      {/* Reps Container */}
      <div
        ref={repsContainerRef}
        style={{
          backgroundColor: '#1e1e1e',
          display: localReps.toUpperCase().includes('AMRAP') ? 'inline-flex' : 'flex',
          height: '68px',
          alignItems: 'center',
          justifyContent: localReps.toUpperCase().includes('AMRAP') ? 'center' : 'flex-start',
          minWidth: '110px',
          overflow: 'hidden',
          paddingLeft: localReps.toUpperCase().includes('AMRAP') ? '0' : '16px',
          paddingRight: localReps.toUpperCase().includes('AMRAP') ? '0' : '16px',
          paddingTop: '18px',
          paddingBottom: '18px',
          position: 'relative',
          borderRadius: '20px',
          flex: 1,
          whiteSpace: 'nowrap',
          color: 'white',
          boxSizing: 'border-box'
        }}
        data-name="Sets Container"
        data-node-id="226:6016"
      >
        {(() => {
          const isAMRAP = localReps.toUpperCase().includes('AMRAP');
          
          if (isAMRAP) {
            return (
              <div
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontSize: '30px',
                  fontFamily: 'Inter Tight, sans-serif',
                  fontWeight: 500,
                  wordWrap: 'break-word',
                  margin: 0,
                  padding: 0
                }}
              >
                AMRAP
              </div>
            );
          }
          
          return (
            <>
              {/* Hidden measurement element - always rendered for width calculation */}
              <span
                ref={repsLabelMeasureRef}
                style={{
                  position: 'absolute',
                  visibility: 'hidden',
                  height: 'auto',
                  width: 'auto',
                  whiteSpace: 'nowrap',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: '15px'
                }}
                aria-hidden="true"
              >
                {isTimed ? 'Dur' : 'Reps'}
              </span>
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
                  marginRight: '8px',
                  padding: 0,
                  display: showRepsLabel ? 'block' : 'none'
                }}
                data-node-id="226:6017"
              >
                {isTimed ? 'Dur' : 'Reps'}
              </p>
              <input
                type="tel"
                inputMode="numeric"
                value={localReps}
                onChange={handleRepsChange}
                onFocus={(e) => e.target.select()}
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontWeight: 500,
                  lineHeight: '61.102px',
                  position: 'relative',
                  width: getInputWidth(localReps),
                  fontSize: '44px',
                  textAlign: 'right',
                  color: 'white',
                  WebkitTextFillColor: 'white',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  padding: 0,
                  margin: 0,
                  marginLeft: 'auto',
                  minWidth: '44px'
                }}
                data-node-id="226:6018"
              />
            </>
          );
        })()}
      </div>

      {/* Weight Container */}
      <div
        ref={weightContainerRef}
        style={{
          backgroundColor: '#1e1e1e',
          display: 'flex',
          height: '68px',
          alignItems: 'center',
          minWidth: '110px',
          overflow: 'hidden',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingTop: '18px',
          paddingBottom: '18px',
          position: 'relative',
          borderRadius: '20px',
          flex: 1,
          whiteSpace: 'nowrap',
          color: 'white',
          boxSizing: 'border-box'
        }}
        data-name="Sets Container"
        data-node-id="226:6019"
      >
        {/* Hidden measurement element - always rendered for width calculation */}
        <span
          ref={weightLabelMeasureRef}
          style={{
            position: 'absolute',
            visibility: 'hidden',
            height: 'auto',
            width: 'auto',
            whiteSpace: 'nowrap',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '15px'
          }}
          aria-hidden="true"
        >
          #
        </span>
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
            marginRight: '8px',
            padding: 0,
            display: showWeightLabel ? 'block' : 'none'
          }}
          data-node-id="226:6020"
        >
          #
        </p>
        <input
          type="tel"
          inputMode="decimal"
          value={localWeight}
          onChange={handleWeightChange}
          onFocus={(e) => e.target.select()}
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontWeight: 500,
            lineHeight: '61.102px',
            position: 'relative',
            width: getInputWidth(localWeight),
            fontSize: '44px',
            textAlign: 'right',
            color: 'white',
            WebkitTextFillColor: 'white',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: 0,
            margin: 0,
            marginLeft: 'auto',
            minWidth: '44px'
          }}
          data-node-id="226:6021"
        />
      </div>
      </div>
    </div>
  );
}

