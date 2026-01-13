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
  onClick?: () => void; // Optional click handler for navigation
}

const DayExerciseCard: FunctionComponent<DayExerciseCardProps> = ({
  exerciseName,
  sets,
  reps,
  weight,
  exerciseNote,
  isCompleted = false,
  onToggleComplete = () => {},
  onClick
}) => {
  // Build tags array from sets, reps, weight
  const tags: Tag[] = useMemo(() => {
    const tagArray: Tag[] = [];
    if (sets !== undefined) {
      tagArray.push({ text: String(sets), variant: 'outlined' });
    }
    if (reps !== undefined) {
      // Format reps: extract just the number, remove "each", etc.
      const repsStr = String(reps)
      // Check if it's AMRAP
      if (repsStr.toUpperCase().includes('AMRAP')) {
        tagArray.push({ text: 'AMRAP', variant: 'amrap' });
      } else {
        // Extract first number if it's a range like "15-20"
        const numberMatch = repsStr.match(/^(\d+)/)
        const formattedReps = numberMatch ? numberMatch[1] : repsStr
        tagArray.push({ text: formattedReps, variant: 'outlined' });
      }
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
      onClick={onClick}
    />
  );
};

export default DayExerciseCard;
