'use client'

import { useMemo } from 'react';
import DayCard, { Tag } from './DayCard';
import { formatDateRangeNoYear } from '../phases/phaseData';

interface WeekSummaryCardProps {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  totalMiles: number;
  totalVert: number;
  phaseColor: string;
  onClick?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  hasColoredBorder?: boolean;
}

export function WeekSummaryCard({
  weekNumber,
  startDate,
  endDate,
  totalMiles,
  totalVert,
  phaseColor,
  onClick,
  isFirst = false,
  isLast = false,
  hasColoredBorder = false
}: WeekSummaryCardProps) {
  // Determine padding bottom based on position
  const paddingBottom = isFirst ? '8px' : isLast ? '28px' : '8px';

  // Build tags array from miles and vert
  const tags: Tag[] = useMemo(() => {
    return [
      { text: `${totalMiles} miles`, variant: 'outlined', showSeparatorAfter: false },
      { text: totalVert.toLocaleString(), variant: 'outlined', showSeparatorAfter: false }
    ];
  }, [totalMiles, totalVert]);

  return (
    <div
      style={{
        width: '100%',
        paddingBottom,
        backgroundColor: '#1E1E1E',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center'
      }}
    >
      <DayCard
        dayName={`Week ${weekNumber}`}
        dayLabel={formatDateRangeNoYear(startDate, endDate)}
        tags={tags}
        isCompleted={false}
        onToggleComplete={() => {}}
        onClick={onClick}
        variant="phase"
        style={{
          width: '100%',
          ...(hasColoredBorder ? {
            borderLeft: `1px solid ${phaseColor}`,
            borderTop: `1px solid ${phaseColor}`,
            borderRight: `1px solid ${phaseColor}`,
            borderBottom: `10px solid ${phaseColor}`
          } : {})
        }}
      />
    </div>
  );
}
