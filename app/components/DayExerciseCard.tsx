import { FunctionComponent } from 'react';
import styles from './DayExerciseCard.module.css';

interface DayExerciseCardProps {
  exerciseName: string; // e.g., "Trap Bar Deadlift"
  sets?: number; // e.g., 3
  reps?: number; // e.g., 8
  weight?: string; // e.g., "#165"
  exerciseNote?: string; // e.g., "60% RPE"
}

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.06836 12.9323L9.00033 9.00034M9.00033 9.00034L12.9323 5.06836M9.00033 9.00034L5.06836 5.06836M9.00033 9.00034L12.9323 12.9323" stroke="white" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DayExerciseCard: FunctionComponent<DayExerciseCardProps> = ({
  exerciseName,
  sets,
  reps,
  weight,
  exerciseNote
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.exerciseName}>{exerciseName}</div>
      <div className={styles.badgesRow}>
        {sets !== undefined && (
          <>
            <div className={styles.badge}>
              <div className={styles.badgeText}>{sets}</div>
            </div>
            <div className={styles.xSeparator}>
              <XIcon />
            </div>
          </>
        )}
        {reps !== undefined && (
          <>
            <div className={styles.badge}>
              <div className={styles.badgeText}>{reps}</div>
            </div>
            {weight && (
              <>
                <div className={styles.xSeparator}>
                  <XIcon />
                </div>
                <div className={styles.badge}>
                  <div className={styles.badgeText}>{weight}</div>
                </div>
              </>
            )}
          </>
        )}
      </div>
      {exerciseNote && (
        <div className={styles.exerciseNote}>{exerciseNote} RPE</div>
      )}
    </div>
  );
};

export default DayExerciseCard;

