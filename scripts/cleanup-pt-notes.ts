import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function cleanupWeekNotes(weekNumber: number) {
  console.log(`\nCleaning up Week ${weekNumber} notes...`);

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
    .eq('weekly_plan_id', weekPlan.id);

  if (workoutsError || !workouts) {
    console.error(`Error fetching workouts:`, workoutsError);
    return;
  }

  console.log(`Found ${workouts.length} workouts`);

  // Clean up each workout's notes
  for (const workout of workouts) {
    if (!workout.workout_notes) {
      continue;
    }

    let notes = workout.workout_notes;
    let updated = false;

    // Remove "Post-workout PT: [long list]" pattern
    if (notes.includes('Post-workout PT:')) {
      const postWorkoutPTIndex = notes.indexOf('Post-workout PT:');

      // Find the end of the PT list (either end of string or double newline)
      let endIndex = notes.length;
      const doubleNewlineIndex = notes.indexOf('\n\n', postWorkoutPTIndex);
      if (doubleNewlineIndex !== -1) {
        endIndex = doubleNewlineIndex;
      }

      // Remove the PT section and clean up extra whitespace
      notes = notes.substring(0, postWorkoutPTIndex) + notes.substring(endIndex);
      notes = notes.trim();
      updated = true;
    }

    // Remove "PT Foundation (15-20min): [long list]" pattern for rest days
    if (notes.includes('PT Foundation')) {
      // For rest days, if the entire note is just PT Foundation, set to null
      if (notes.startsWith('PT Foundation')) {
        notes = '';
        updated = true;
      }
    }

    if (updated) {
      const { error: updateError } = await supabase
        .from('daily_workouts')
        .update({ workout_notes: notes || null })
        .eq('id', workout.id);

      if (updateError) {
        console.error(`  Error updating ${workout.day_of_week}:`, updateError);
      } else {
        console.log(`  ✓ Cleaned ${workout.day_of_week}`);
      }
    }
  }

  console.log(`Week ${weekNumber} cleanup complete!`);
}

async function cleanupAllFoundationWeeks() {
  console.log('Cleaning up PT notes for all Foundation weeks (1-12)...\n');

  for (let week = 1; week <= 12; week++) {
    await cleanupWeekNotes(week);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n✅ All Foundation weeks cleaned up!');
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: tsx scripts/cleanup-pt-notes.ts [week_number|all]');
    console.log('Examples:');
    console.log('  tsx scripts/cleanup-pt-notes.ts 1     # Clean Week 1');
    console.log('  tsx scripts/cleanup-pt-notes.ts all   # Clean all Foundation weeks (1-12)');
    return;
  }

  const arg = args[0];

  if (arg === 'all') {
    await cleanupAllFoundationWeeks();
  } else {
    const weekNumber = parseInt(arg);
    if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 36) {
      console.error('Invalid week number. Must be between 1 and 36.');
      return;
    }
    await cleanupWeekNotes(weekNumber);
  }
}

main();
