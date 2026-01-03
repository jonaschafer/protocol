import { FunctionComponent, useMemo } from 'react';
import DayCard, { Tag } from './DayCard';

interface WeekDayCardProps {
  dayName: string; // e.g., "Monday"
  runInfo?: string; // e.g., "3 miles", "6 miles", "Row", "18 miles"
  vert?: string; // e.g., "1500", "2600"
  zone?: string; // e.g., "Z3"
  hasPT?: boolean; // Whether PT badge should be shown
  ptType?: string; // e.g., "PT", "Heavy"
  intensity?: string; // e.g., "Rest", "Easy", "Hard", "Long", "TTT"
  isCompleted?: boolean;
  onToggleComplete?: () => void;
  weekNumber?: number | string;
  category?: string;
}

const WeekDayCard: FunctionComponent<WeekDayCardProps> = ({
  dayName,
  runInfo,
  vert,
  zone,
  hasPT = false,
  ptType = 'PT',
  intensity,
  isCompleted = false,
  onToggleComplete = () => {},
  weekNumber,
  category
}) => {
  // Build tags array from runInfo, vert, zone, and PT
  const tags: Tag[] = useMemo(() => {
    const tagArray: Tag[] = [];
    if (runInfo) {
      tagArray.push({ text: runInfo, variant: 'outlined', showSeparatorAfter: false });
    }
    if (vert) {
      tagArray.push({ text: vert, variant: 'outlined', showSeparatorAfter: !!zone || hasPT });
    }
    if (zone) {
      tagArray.push({ text: zone, variant: 'outlined', showSeparatorAfter: hasPT });
    }
    if (hasPT) {
      tagArray.push({ text: ptType, variant: 'filled', showSeparatorAfter: false });
    }
    return tagArray;
  }, [runInfo, vert, zone, hasPT, ptType]);

  return (
    <DayCard
      dayName={dayName}
      dayLabel={intensity}
      tags={tags}
      isCompleted={isCompleted}
      onToggleComplete={onToggleComplete}
      weekNumber={weekNumber}
      category={category}
    />
  );
};

export default WeekDayCard;
