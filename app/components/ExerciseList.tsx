'use client'

import { FunctionComponent, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './ExerciseList.module.css';
import DayExerciseCard from './DayExerciseCard';
import { ExerciseListLogButton } from './ExerciseListLogButton';
import { fetchWorkoutCompletion, updateWorkoutCompletion } from '../../lib/supabase-data';

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
  weekNumber?: number | string;
  workoutId?: string;
}

const ExerciseList: FunctionComponent<ExerciseListProps> = ({ exercises, weekNumber, workoutId }) => {
  const [allExercisesDone, setAllExercisesDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch initial completion state from Supabase
  useEffect(() => {
    if (workoutId) {
      fetchWorkoutCompletion(workoutId)
        .then(completed => {
          setAllExercisesDone(completed);
        })
        .catch(error => {
          console.error('Error fetching workout completion:', error);
        });
    }
  }, [workoutId]);

  const handleLogButtonClick = async () => {
    const newState = !allExercisesDone;
    setAllExercisesDone(newState);

    // Update Supabase if workoutId is provided
    if (workoutId) {
      setIsLoading(true);
      try {
        await updateWorkoutCompletion(workoutId, newState);
      } catch (error) {
        console.error('Error updating workout completion:', error);
        // Revert state on error
        setAllExercisesDone(!newState);
      } finally {
        setIsLoading(false);
      }
    }
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
    
    // Build URL with day and week as query parameters if available
    const params = new URLSearchParams();
    if (dayName) params.set('day', dayName);
    if (weekNumber) params.set('week', String(weekNumber));
    const queryString = params.toString();
    const exerciseUrl = `/exercises/${exerciseIdentifier}${queryString ? `?${queryString}` : ''}`;
    
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

