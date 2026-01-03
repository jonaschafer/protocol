'use client'

import { FunctionComponent, useState } from 'react';
import styles from './ExerciseList.module.css';
import DayExerciseCard from './DayExerciseCard';
import { ExerciseListLogButton } from './ExerciseListLogButton';

interface Exercise {
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

  const handleLogButtonClick = () => {
    setAllExercisesDone(prev => !prev);
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
            key={index}
            exerciseName={exercise.exerciseName}
            sets={exercise.sets}
            reps={exercise.reps}
            weight={exercise.weight}
            exerciseNote={exercise.exerciseNote}
            isCompleted={allExercisesDone}
          />
        ))}
      </div>
    </div>
  );
};

export default ExerciseList;

