'use client'

import { FunctionComponent, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './ExerciseList.module.css';
import DayExerciseCard from './DayExerciseCard';
import { ExerciseListLogButton } from './ExerciseListLogButton';

interface Exercise {
  id?: string;
  exerciseName: string;
  sets?: number;
  reps?: number | string; // Can be number (e.g., 8) or string (e.g., "30 sec")
  weight?: string;
  exerciseNote?: string;
}

interface ExerciseListProps {
  exercises: Exercise[];
}

const ExerciseList: FunctionComponent<ExerciseListProps> = ({ exercises }) => {
  const [allExercisesDone, setAllExercisesDone] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogButtonClick = () => {
    setAllExercisesDone(prev => !prev);
  };

  // Helper function to encode exercise name for URL
  const encodeExerciseName = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleExerciseClick = (exercise: Exercise) => {
    // Use exercise ID if available, otherwise encode the exercise name
    const exerciseIdentifier = exercise.id || encodeExerciseName(exercise.exerciseName);
    
    // Extract day name from current path if we're on a day page
    const dayMatch = pathname?.match(/\/day\/([^/]+)/);
    const dayName = dayMatch ? dayMatch[1] : null;
    
    // Build URL with day as query parameter if available
    const exerciseUrl = dayName 
      ? `/exercises/${exerciseIdentifier}?day=${dayName}`
      : `/exercises/${exerciseIdentifier}`;
    
    router.push(exerciseUrl);
  };

  return (
    <div className={styles.exerciseList}>
      {/* Divider Line */}
      <div className={styles.dividerContainer}>
        <div className={styles.divider} />
      </div>

      {/* Header */}
      <div className={styles.header}>
        <p className={styles.title}>PT</p>
        <div className={styles.logButtonContainer}>
          <ExerciseListLogButton 
            onClick={handleLogButtonClick}
            initialDone={allExercisesDone}
          />
        </div>
      </div>

      {/* Exercise Cards */}
      <div className={styles.exercisesContainer}>
        {exercises.map((exercise, index) => (
          <DayExerciseCard
            key={exercise.id || index}
            exerciseName={exercise.exerciseName}
            sets={exercise.sets}
            reps={exercise.reps}
            weight={exercise.weight}
            exerciseNote={exercise.exerciseNote}
            isCompleted={allExercisesDone}
            onClick={() => handleExerciseClick(exercise)}
          />
        ))}
      </div>
    </div>
  );
};

export default ExerciseList;

