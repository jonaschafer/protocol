'use client'

import { useState, useRef, useEffect } from 'react'
import { SetRow } from '../components/SetRow'
import { Notes } from '../components/Notes'
import { ExerciseHeader } from '../components/ExerciseHeader'

interface Set {
  id: number;
  setNumber: number;
  reps: string;
  weight: string;
  isTimed: boolean;
}

interface ExerciseCardProps {
  exerciseName: string;
  restNote: string;
  cues: string;
  sets: Set[];
  isLogged: boolean;
  onDelete: (id: number) => void;
  onAddSet: () => void;
  onLog: () => void;
  onRepsChange: (id: number, value: string) => void;
  onWeightChange: (id: number, value: string) => void;
  onNotesSave?: (value: string) => void;
  onDismiss?: () => void;
}

export function ExerciseCard({
  exerciseName,
  restNote,
  cues,
  sets,
  isLogged,
  onDelete,
  onAddSet,
  onLog,
  onRepsChange,
  onWeightChange,
  onNotesSave,
  onDismiss
}: ExerciseCardProps) {
  const [dragDistance, setDragDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const [isAnimatingBack, setIsAnimatingBack] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const cardHeightRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const DISMISS_THRESHOLD = 0.3; // 30% of card height

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

  // Update card height ref when card is rendered
  useEffect(() => {
    if (cardRef.current) {
      cardHeightRef.current = cardRef.current.offsetHeight;
    }
  }, [sets, isLogged]);

  const handleStart = (clientY: number, pointerId?: number) => {
    if (cardRef.current) {
      cardHeightRef.current = cardRef.current.offsetHeight;
      startYRef.current = clientY;
      setIsDragging(true);
      setIsDismissing(false);
      setIsAnimatingBack(false);
      setDragDistance(0);
      
      if (pointerId !== undefined && cardRef.current) {
        pointerIdRef.current = pointerId;
        try {
          cardRef.current.setPointerCapture(pointerId);
        } catch (e) {
          // Pointer capture not supported
        }
      }
    }
  };

  const handleMove = (clientY: number) => {
    if (!isDragging) return;

    const diff = clientY - startYRef.current; // Positive = downward drag
    
    // Only allow downward drag
    if (diff > 0) {
      setDragDistance(diff);
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;

    // Release pointer capture
    if (pointerIdRef.current !== null && cardRef.current) {
      try {
        cardRef.current.releasePointerCapture(pointerIdRef.current);
      } catch (e) {
        // Ignore errors
      }
      pointerIdRef.current = null;
    }
    
    const threshold = cardHeightRef.current * DISMISS_THRESHOLD;
    
    if (dragDistance >= threshold && onDismiss) {
      // Dismiss the card
      setIsDismissing(true);
      setIsDragging(false);
      
      // Animate out
      const dismissDelay = prefersReducedMotion ? 0 : 200;
      setTimeout(() => {
        onDismiss();
      }, dismissDelay);
    } else {
      // Snap back
      setIsAnimatingBack(true);
      setDragDistance(0);
      setIsDragging(false);
    }
  };

  // Pointer event handlers
  const handlePointerDownCapture = (e: React.PointerEvent) => {
    // Only handle primary pointer
    if (e.isPrimary && !isDragging) {
      const target = e.target as HTMLElement;
      // Don't interfere with SetRow swipe-to-delete or input interactions
      if (target.closest('[data-name="set-row"]') || 
          target.tagName === 'INPUT' || 
          target.tagName === 'TEXTAREA' ||
          target.closest('button')) {
        return;
      }
      
      // Allow drag from top area (first 200px) or drag indicator
      const cardTop = cardRef.current?.getBoundingClientRect().top || 0;
      const relativeY = e.clientY - cardTop;
      
      if (target.closest('[data-drag-handle]') || relativeY < 200) {
        handleStart(e.clientY, e.pointerId);
        e.preventDefault();
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging && e.isPrimary) {
      e.preventDefault();
      handleMove(e.clientY);
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

  // Calculate transform for card
  const cardTranslateY = isDismissing 
    ? window.innerHeight // Move off screen
    : dragDistance;

  return (
    <div
      ref={cardRef}
      onPointerDownCapture={handlePointerDownCapture}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#000',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderTopLeftRadius: '30px',
        borderTopRightRadius: '30px',
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
        overflow: 'hidden',
        transform: `translateY(${cardTranslateY}px)`,
        transition: isDragging || isDismissing
          ? 'none'
          : isAnimatingBack
          ? prefersReducedMotion
            ? 'transform 0.1s linear'
            : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' // Spring animation
          : 'none',
        touchAction: 'pan-y',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      data-name="exerciseCard"
    >
      {/* Top Drag Indicator */}
      <div
        data-drag-handle
        style={{
          position: 'absolute',
          top: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40px',
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '2px',
          zIndex: 10,
          pointerEvents: 'auto'
        }}
        aria-label="Drag down to dismiss"
      />

      {/* Card Content */}
      <div
        style={{
          padding: '20px',
          paddingTop: '40px', // Extra space for drag indicator
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {/* Exercise Header */}
        <ExerciseHeader
          exerciseName={exerciseName}
          restNote={restNote}
          cues={cues}
        />

        {/* Sets */}
        {sets.map((set) => (
          <SetRow
            key={set.id}
            setNumber={set.setNumber}
            reps={set.reps}
            weight={set.weight}
            onDelete={() => onDelete(set.id)}
            onRepsChange={(value) => onRepsChange(set.id, value)}
            onWeightChange={(value) => onWeightChange(set.id, value)}
            opacity={isLogged ? 0.6 : 1}
            isTimed={set.isTimed}
          />
        ))}

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '10px',
            width: '100%'
          }}
          data-name="action"
        >
          {/* Add Set Button */}
          <button
            onClick={onAddSet}
            style={{
              border: '1px solid white',
              display: 'flex',
              height: '68px',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: '20px',
              paddingBottom: '20px',
              position: 'relative',
              borderRadius: '20px',
              flexShrink: 0,
              width: '100%',
              boxSizing: 'border-box',
              background: 'transparent',
              cursor: 'pointer'
            }}
            data-name="add set"
          >
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                lineHeight: '61.102px',
                fontStyle: 'normal',
                position: 'relative',
                flexShrink: 0,
                fontSize: '15px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                color: 'white',
                margin: 0,
                padding: 0
              }}
            >
              Add set
            </p>
          </button>

          {/* Log / Done Button */}
          <button
            onClick={onLog}
            style={{
              backgroundColor: isLogged ? '#059F00' : 'white',
              display: 'flex',
              height: '68px',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: '20px',
              paddingBottom: '20px',
              position: 'relative',
              borderRadius: '20px',
              flexShrink: 0,
              width: '100%',
              boxSizing: 'border-box',
              border: 'none',
              cursor: 'pointer'
            }}
            data-name="log"
          >
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                lineHeight: '61.102px',
                fontStyle: 'normal',
                position: 'relative',
                flexShrink: 0,
                fontSize: '15px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                color: isLogged ? '#ffffff' : '#1e1e1e',
                margin: 0,
                padding: 0
              }}
            >
              {isLogged ? 'Done' : 'Log'}
            </p>
          </button>
        </div>

        {/* Notes Field */}
        <Notes onSave={onNotesSave || ((value) => console.log('Notes saved:', value))} />
      </div>
    </div>
  );
}
