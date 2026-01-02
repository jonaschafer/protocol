import { FunctionComponent } from 'react';
import styles from './WeekExerciseList.module.css';
import WeekDayCard from './WeekDayCard';

interface DayData {
  dayName: string;
  runInfo?: string;
  vert?: string;
  zone?: string;
  hasPT?: boolean;
  ptType?: string;
  intensity?: string;
}

interface WeekExerciseListProps {
  days: DayData[];
}

const WeekExerciseList: FunctionComponent<WeekExerciseListProps> = ({ days }) => {
  return (
    <div className={styles.weekExerciseList}>
      {/* Divider Line */}
      <div className={styles.dividerContainer}>
        <div className={styles.divider} />
      </div>

      {/* Days List */}
      <div className={styles.daysContainer}>
        {days.map((day, index) => (
          <WeekDayCard
            key={index}
            dayName={day.dayName}
            runInfo={day.runInfo}
            vert={day.vert}
            zone={day.zone}
            hasPT={day.hasPT}
            ptType={day.ptType}
            intensity={day.intensity}
          />
        ))}
      </div>
    </div>
  );
};

export default WeekExerciseList;

