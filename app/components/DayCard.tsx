'use client'

import { FunctionComponent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './DayCard.module.css';

export interface Tag {
  text: string;
  variant: 'outlined' | 'filled';
  showSeparatorAfter?: boolean; // Whether to show X icon after this tag
}

export interface DayCardProps {
  dayName: string;
  dayLabel?: string; // e.g., "Rest", "TTT", "60% RPE", or date for phase variant
  tags: Tag[];
  isCompleted: boolean;
  onToggleComplete: () => void;
  weekNumber?: number | string;
  category?: string;
  onClick?: () => void; // Optional custom click handler
  variant?: 'default' | 'week' | 'phase' | 'milestoneCard'; // Variant for different background colors and layouts
  phaseColor?: string; // Phase color for milestoneCard variant border
  style?: React.CSSProperties; // Optional inline styles for custom styling
}

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.06836 12.9323L9.00033 9.00034M9.00033 9.00034L12.9323 5.06836M9.00033 9.00034L5.06836 5.06836M9.00033 9.00034L12.9323 12.9323" stroke="white" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


const DayCard: FunctionComponent<DayCardProps> = ({
  dayName,
  dayLabel,
  tags,
  isCompleted,
  onToggleComplete: _onToggleComplete,
  weekNumber: _weekNumber,
  category: _category,
  onClick,
  variant = 'default',
  phaseColor,
  style
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior: navigate to day route
      const dayRoute = dayName.toLowerCase();
      router.push(`/day/${dayRoute}`);
    }
  };

  const cardClasses = [
    styles.card,
    isCompleted ? styles.completed : '',
    variant === 'week' ? styles.weekVariant : '',
    variant === 'phase' ? styles.phaseVariant : '',
    variant === 'milestoneCard' ? styles.milestoneCardVariant : ''
  ].filter(Boolean).join(' ');

  // For phase variant, extract week number from dayName (e.g., "Week 3" -> "3")
  const weekNumberText = variant === 'phase' && dayName ? dayName.replace(/Week\s+/i, '') : null;

  // Apply phase color border for milestoneCard variant
  const milestoneCardStyle = variant === 'milestoneCard' && phaseColor ? {
    borderLeft: `1px solid ${phaseColor}`,
    borderTop: `1px solid ${phaseColor}`,
    borderRight: `1px solid ${phaseColor}`,
    borderBottom: `10px solid ${phaseColor}`
  } : {};

  return (
    <div 
      className={cardClasses}
      onClick={handleClick}
      style={{ ...style, ...milestoneCardStyle, cursor: 'pointer' }}
    >
      {/* Header Row */}
      <div className={styles.headerRow}>
        {variant === 'phase' && weekNumberText ? (
          <>
            <div className={styles.weekNumber}>Week {weekNumberText}</div>
            {dayLabel && (
              <div className={styles.dayLabel}>{dayLabel}</div>
            )}
          </>
        ) : (
          <>
            <div className={styles.dayName}>{dayName}</div>
            {dayLabel && (
              <div className={styles.dayLabel}>{dayLabel}</div>
            )}
          </>
        )}
      </div>

      {/* Tags Row */}
      <div className={styles.tagsRow}>
        {tags.map((tag, index) => (
          <div key={index} className={styles.tagWrapper}>
            <div 
              className={`${styles.tag} ${tag.variant === 'filled' ? styles.tagFilled : styles.tagOutlined}`}
            >
              <div className={styles.tagText}>{tag.text}</div>
            </div>
            {/* X Icon separator - only if showSeparatorAfter is true (defaults to true for backward compatibility) */}
            {(tag.showSeparatorAfter !== false) && index < tags.length - 1 && (
              <div className={styles.xSeparator}>
                <XIcon />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayCard;

