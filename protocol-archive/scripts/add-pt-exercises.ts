import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// PT Foundation exercises as structured JSONB objects
const PT_EXERCISES = [
  // Core
  { exercise: 'Hip marches', sets: '2', reps: '15', note: '' },
  { exercise: 'SL glute bridge', sets: '4', reps: '8 each', note: '' },
  { exercise: 'Calf raises', sets: '3', reps: 'AMRAP', note: '' },
  { exercise: 'Copenhagen plank', sets: '3', reps: '20sec', note: '' },
  { exercise: 'Standing clamshells', sets: '2', reps: '15', note: '' },

  // Hip Flexor Strengthening
  { exercise: 'Seated banded hip flexor march', sets: '3', reps: '15-20', note: '' },
  { exercise: 'Psoas plank', sets: '3', reps: '30sec', note: '' },
  { exercise: 'Standing hip flexor march with pause', sets: '3', reps: '12-15', note: '' },

  // Knee/ITB Work
  { exercise: 'VMO dips', sets: '3', reps: '12 each', note: '' },
  { exercise: 'Terminal knee extensions', sets: '3', reps: '15', note: '' },
  { exercise: 'Wall sits with ball squeeze', sets: '3', reps: '30sec', note: '' },
  { exercise: 'Side-lying leg raises', sets: '3', reps: '15', note: '' },

  // Stretches
  { exercise: 'Lying hip flexor stretch', sets: '1', reps: '30sec each', note: '' },
  { exercise: 'Kneeling with band hip flexor stretch', sets: '1', reps: '30sec each', note: '' }
];

async function updateWeekPTExercises(weekNumber: number) {
  console.log(`\nUpdating PT exercises for Week ${weekNumber}...`);

  // Get the weekly plan
  const { data: weekPlan, error: weekError } = await supabase
    .from('weekly_plans')
    .select('id')
    .eq('week_number', weekNumber)
    .single();

  if (weekError || !weekPlan) {
    console.error(`Error fetching week ${weekNumber}:`, weekError);
    return;
  }

  // Get all workouts for this week
  const { data: workouts, error: workoutsError } = await supabase
    .from('daily_workouts')
    .select('*')
    .eq('weekly_plan_id', weekPlan.id)
    .order('workout_date');  // Order by date, not day_of_week

  if (workoutsError || !workouts) {
    console.error(`Error fetching workouts for week ${weekNumber}:`, workoutsError);
    return;
  }

  console.log(`Found ${workouts.length} workouts for week ${weekNumber}`);

  // Update each workout
  for (const workout of workouts) {
    const isRestDay = workout.workout_type === 'rest';
    const isStrengthDay = workout.workout_type === 'strength';

    let updatedData: any = {};

    if (isRestDay) {
      // For rest days: Set strength_exercises to PT exercises, session type to "PT Foundation"
      updatedData = {
        strength_exercises: JSON.stringify(PT_EXERCISES),
        strength_session_type: 'PT Foundation',
        strength_duration_minutes: 20
      };
    } else if (isStrengthDay) {
      // For strength days: Append PT exercises to existing strength_exercises
      try {
        const existingExercises = workout.strength_exercises
          ? JSON.parse(workout.strength_exercises)
          : [];
        const combinedExercises = [...existingExercises, ...PT_EXERCISES];

        updatedData = {
          strength_exercises: JSON.stringify(combinedExercises)
        };
      } catch (e) {
        console.error(`Error parsing strength_exercises for ${workout.day_of_week}:`, e);
        continue;
      }
    } else {
      // For run/rowing days: Add PT exercises as separate strength component
      updatedData = {
        strength_exercises: JSON.stringify(PT_EXERCISES),
        strength_session_type: 'PT Foundation (post-run)',
        strength_duration_minutes: 20
      };
    }

    const { error: updateError } = await supabase
      .from('daily_workouts')
      .update(updatedData)
      .eq('id', workout.id);

    if (updateError) {
      console.error(`Error updating workout ${workout.id}:`, updateError);
    } else {
      console.log(`✓ Updated ${workout.day_of_week} (${workout.workout_type})`);
    }
  }

  console.log(`Week ${weekNumber} updated successfully!`);
}

async function updateAllFoundationWeeks() {
  console.log('Updating PT exercises for all Foundation weeks (1-12)...\n');

  for (let week = 1; week <= 12; week++) {
    await updateWeekPTExercises(week);
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n✅ All Foundation weeks updated!');
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: tsx scripts/add-pt-exercises.ts [week_number|all]');
    console.log('Examples:');
    console.log('  tsx scripts/add-pt-exercises.ts 1     # Update Week 1');
    console.log('  tsx scripts/add-pt-exercises.ts all   # Update all Foundation weeks (1-12)');
    return;
  }

  const arg = args[0];

  if (arg === 'all') {
    await updateAllFoundationWeeks();
  } else {
    const weekNumber = parseInt(arg);
    if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 36) {
      console.error('Invalid week number. Must be between 1 and 36.');
      return;
    }
    await updateWeekPTExercises(weekNumber);
  }
}

main();
