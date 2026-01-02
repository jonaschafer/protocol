import { FunctionComponent } from 'react';
import styles from './RunNutrition.module.css';

const RunNutrition = () => {
  return (
    <div className={styles.runnutrition}>
      <div className={styles.header}>
        <div className={styles.exerciseTitle}>Nutrition</div>
      </div>
      <div className={styles.headerParent}>
        <div className={styles.header2}>
          <div className={styles.exerciseTitle2}>Before run</div>
          <div className={styles.exerciseTitle3}>Toast + jam, water 30min before</div>
        </div>
        <div className={styles.header2}>
          <div className={styles.exerciseTitle2}>During run</div>
          <div className={styles.exerciseTitle3}>{`No flask needed for <90min effort`}</div>
        </div>
        <div className={styles.header2}>
          <div className={styles.exerciseTitle2}>After run</div>
          <div className={styles.exerciseTitle3}>3:1 carbs to protein, try 3x sourdough toast (30g/slice), greek yogurt (18g serving)</div>
        </div>
      </div>
    </div>
  );
};

export default RunNutrition as FunctionComponent;

