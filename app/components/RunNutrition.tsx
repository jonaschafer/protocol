import { FunctionComponent } from 'react';
import styles from './RunNutrition.module.css';
import { NutritionSection } from './NutritionSection';

const RunNutrition = () => {
  return (
    <div className={styles.runnutrition}>
      <div className={styles.header}>
        <div className={styles.exerciseTitle}>Nutrition</div>
      </div>
      <div className={styles.headerParent}>
        <div className={styles.header2}>
          <NutritionSection
            label="Before run"
            content="Toast + jam, water 30min before"
          />
        </div>
        <div className={styles.header2}>
          <NutritionSection
            label="During run"
            content="No flask needed for <90min effort"
          />
        </div>
        <div className={styles.header2}>
          <NutritionSection
            label="After run"
            content="3:1 carbs to protein, try 3x sourdough toast (30g/slice), greek yogurt (18g serving)"
          />
        </div>
      </div>
    </div>
  );
};

export default RunNutrition as FunctionComponent;

