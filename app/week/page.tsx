import { WeekView } from '../components/WeekView';
import { BottomNav } from '../components/BottomNav';
import { fetchWeek } from '../../lib/supabase-data';

function transformWorkoutToDay(workout: any) {
  const day: any = {
    dayName: workout.day_of_week,
    intensity: 'Easy'
  };

  // Determine workout type and info
  if (workout.workout_type === 'rest') {
    day.intensity = 'Rest';
    day.runInfo = 'Rest';
  } else if (workout.workout_type === 'rowing') {
    day.intensity = 'Rest';
    day.runInfo = workout.rowing_duration_minutes ? `${workout.rowing_duration_minutes}min row` : 'Row';
  } else if (workout.workout_type === 'run' || workout.workout_type === 'run+strength') {
    if (workout.run_distance_miles) {
      day.runInfo = `${workout.run_distance_miles} miles`;
    }
    if (workout.run_vert_feet) {
      day.vert = workout.run_vert_feet.toString();
    }
    if (workout.run_effort) {
      const effort = workout.run_effort.toLowerCase();
      if (effort.includes('long')) day.intensity = 'Long';
      else if (effort.includes('tempo') || effort.includes('hard')) day.intensity = 'Hard';
      else if (effort.includes('easy') || effort.includes('recovery')) day.intensity = 'Easy';
      else if (effort.includes('z2') || effort.includes('conversational')) day.intensity = 'Easy';
    }
    if (workout.run_effort?.includes('Z3') || workout.run_effort?.includes('tempo')) {
      day.zone = 'Z3';
    }
  }

  // Check for PT/Strength
  const hasPT = workout.workout_notes?.includes('PT FOUNDATION') || workout.strength_session_type
  if (hasPT) {
    day.hasPT = true;
    if (workout.strength_session_type) {
      day.ptType = workout.strength_session_type.includes('Heavy') ? 'Heavy' : 'PT';
    } else {
      day.ptType = 'PT';
    }
  }

  return day;
}

export default async function WeekPage({ searchParams }: { searchParams: { week?: string } }) {
  const weekNumber = parseInt(searchParams?.week || '1');
  
  let weekData;
  let days: any[] = [];
  let category = 'Foundation';
  let phase: 'foundation' | 'durability' | 'specificity' = 'foundation';
  
  try {
    weekData = await fetchWeek(weekNumber);
    
    // Determine phase
    if (weekNumber >= 1 && weekNumber <= 9) {
      category = 'Foundation';
      phase = 'foundation';
    } else if (weekNumber >= 10 && weekNumber <= 20) {
      category = 'Durability';
      phase = 'durability';
    } else if (weekNumber >= 21 && weekNumber <= 27) {
      category = 'Specificity';
      phase = 'specificity';
    }
    
    // Transform workouts to days
    if (weekData.daily_workouts) {
      const sortedWorkouts = [...weekData.daily_workouts].sort((a: any, b: any) => {
        // Monday-first week order
        const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return dayOrder.indexOf(a.day_of_week) - dayOrder.indexOf(b.day_of_week);
      });
      days = sortedWorkouts.map(transformWorkoutToDay);
    }
  } catch (error) {
    console.error('Error fetching week data:', error);
  }

  return (
    <div 
      style={{ 
        background: '#000000', 
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        paddingBottom: '100px' // Extra padding for bottom nav
      }}
    >
      <WeekView
        weekNumber={weekNumber}
        category={category}
        phase={phase}
        milesCurrent={0}
        milesTotal={weekData?.target_miles || 0}
        vert={weekData?.target_vert || 0}
        notes={weekData?.week_theme || weekData?.notes || ''}
        days={days}
      />
      <BottomNav />
    </div>
  );
}

