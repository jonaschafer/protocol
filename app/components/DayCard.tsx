import { FunctionComponent } from 'react';
import styles from './DayCard.module.css';

export interface Tag {
  text: string;
  variant: 'outlined' | 'filled';
  showSeparatorAfter?: boolean; // Whether to show X icon after this tag
}

export interface DayCardProps {
  dayName: string;
  dayLabel?: string; // e.g., "Rest", "TTT", "60% RPE"
  tags: Tag[];
  isCompleted: boolean;
  onToggleComplete: () => void;
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
  onToggleComplete
}) => {
  return (
    <div 
      className={`${styles.card} ${isCompleted ? styles.completed : ''}`}
      onClick={onToggleComplete}
      style={{ cursor: 'pointer' }}
    >
      {/* Header Row */}
      <div className={styles.headerRow}>
        <div className={styles.dayName}>{dayName}</div>
        {dayLabel && (
          <div className={styles.dayLabel}>{dayLabel}</div>
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

