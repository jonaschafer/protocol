'use client'

import { useState, useEffect } from 'react'
import { SetRow } from '../components/SetRow'
import { Notes } from '../components/Notes'
import { ExerciseHeader } from '../components/ExerciseHeader'
import { CloseButtonWithGradient } from '../components/CloseButtonWithGradient'

interface Set {
  id: number;
  setNumber: number;
  reps: string;
  weight: string;
  isTimed: boolean;
}

interface ExerciseData {
  id: string;
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
}

interface ExerciseCardProps {
  exercises: ExerciseData[];
  onDismiss?: () => void;
}

export function ExerciseCard({
  exercises,
  onDismiss
}: ExerciseCardProps) {
  const [isDismissing, setIsDismissing] = useState(false);
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

  // Handle close button click
  const handleClose = () => {
    if (onDismiss) {
      setIsDismissing(true);
      const dismissDelay = prefersReducedMotion ? 0 : 200;
      setTimeout(() => {
        onDismiss();
      }, dismissDelay);
    }
  };

  // Calculate transform for card
  const cardTranslateY = isDismissing 
    ? window.innerHeight // Move off screen
    : 0;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 20px)',
        backgroundColor: '#000',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderTopLeftRadius: '30px',
        borderTopRightRadius: '30px',
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
        overflow: 'hidden',
        transform: `translateY(${cardTranslateY}px)`,
        transition: isDismissing
          ? 'none'
          : prefersReducedMotion
          ? 'transform 0.1s linear'
          : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        display: 'flex',
        flexDirection: 'column'
      }}
      data-name="exerciseCard"
    >

      {/* Scrollable Card Content */}
      <div
        style={{
          padding: '20px',
          paddingBottom: '120px', // Space for fixed close button
          display: 'flex',
          flexDirection: 'column',
          gap: '60px',
          overflowY: 'auto',
          flex: 1,
          minHeight: 0
        }}
      >
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            data-name="exerciseDeets"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {/* Exercise Header */}
            <ExerciseHeader
              exerciseName={exercise.exerciseName}
              restNote={exercise.restNote}
              cues={exercise.cues}
            />

            {/* Sets */}
            {exercise.sets.map((set) => (
              <SetRow
                key={set.id}
                setNumber={set.setNumber}
                reps={set.reps}
                weight={set.weight}
                onDelete={() => exercise.onDelete(set.id)}
                onRepsChange={(value) => exercise.onRepsChange(set.id, value)}
                onWeightChange={(value) => exercise.onWeightChange(set.id, value)}
                opacity={exercise.isLogged ? 0.6 : 1}
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
                onClick={exercise.onAddSet}
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
                onClick={exercise.onLog}
                style={{
                  backgroundColor: exercise.isLogged ? '#059F00' : 'white',
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
                    color: exercise.isLogged ? '#ffffff' : '#1e1e1e',
                    margin: 0,
                    padding: 0
                  }}
                >
                  {exercise.isLogged ? 'Done' : 'Log'}
                </p>
              </button>
            </div>

            {/* Notes Field */}
            <Notes onSave={exercise.onNotesSave || ((value) => console.log('Notes saved:', value))} />
          </div>
        ))}
      </div>

      {/* Fixed Close Button with Gradient Overlay */}
      <CloseButtonWithGradient onClick={handleClose} />
    </div>
  );
}
