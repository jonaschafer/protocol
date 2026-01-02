import { FunctionComponent, useMemo } from 'react';
import DayCard, { Tag } from './DayCard';

interface DayExerciseCardProps {
  exerciseName: string; // e.g., "Trap Bar Deadlift"
  sets?: number; // e.g., 3
  reps?: number | string; // e.g., 8 or "30 sec"
  weight?: string; // e.g., "#165"
  exerciseNote?: string; // e.g., "60% RPE"
  isCompleted?: boolean;
  onToggleComplete?: () => void;
}

const DayExerciseCard: FunctionComponent<DayExerciseCardProps> = ({
  exerciseName,
  sets,
  reps,
  weight,
  exerciseNote,
  isCompleted = false,
  onToggleComplete = () => {}
}) => {
  // Build tags array from sets, reps, weight
  const tags: Tag[] = useMemo(() => {
    const tagArray: Tag[] = [];
    if (sets !== undefined) {
      tagArray.push({ text: String(sets), variant: 'outlined' });
    }
    if (reps !== undefined) {
      tagArray.push({ text: String(reps), variant: 'outlined' });
    }
    if (weight) {
      tagArray.push({ text: weight, variant: 'outlined' });
    }
    return tagArray;
  }, [sets, reps, weight]);

  return (
    <DayCard
      dayName={exerciseName}
      dayLabel={exerciseNote ? `${exerciseNote} RPE` : undefined}
      tags={tags}
      isCompleted={isCompleted}
      onToggleComplete={onToggleComplete}
    />
  );
};

export default DayExerciseCard;
