import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

async function checkAndFixWeek(weekNumber: number) {
  console.log(`\nChecking Week ${weekNumber}...`);

  // Get the weekly plan
  const { data: weekPlan, error: weekError } = await supabase
    .from('weekly_plans')
    .select('*')
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
    .order('workout_date');

  if (workoutsError || !workouts) {
    console.error(`Error fetching workouts:`, workoutsError);
    return;
  }

  console.log(`Current order for Week ${weekNumber}:`);
  workouts.forEach((w, i) => {
    console.log(`  ${i + 1}. ${w.day_of_week} - ${w.workout_date}`);
  });

  // Check if dates are in correct order
  const startDate = new Date(weekPlan.start_date);
  const correctDates: Record<string, string> = {};

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    correctDates[DAY_ORDER[i]] = dateStr;
  }

  console.log(`\nCorrect dates should be:`);
  DAY_ORDER.forEach((day, i) => {
    console.log(`  ${i + 1}. ${day} - ${correctDates[day]}`);
  });

  // Check if any dates are wrong
  let needsUpdate = false;
  for (const workout of workouts) {
    if (workout.workout_date !== correctDates[workout.day_of_week]) {
      needsUpdate = true;
      console.log(`  ❌ ${workout.day_of_week}: ${workout.workout_date} should be ${correctDates[workout.day_of_week]}`);
    }
  }

  if (!needsUpdate) {
    console.log(`✓ Week ${weekNumber} dates are correct!`);
    return;
  }

  console.log(`\nFixing Week ${weekNumber} dates...`);

  // Update each workout with correct date
  for (const workout of workouts) {
    const correctDate = correctDates[workout.day_of_week];

    const { error: updateError } = await supabase
      .from('daily_workouts')
      .update({ workout_date: correctDate })
      .eq('id', workout.id);

    if (updateError) {
      console.error(`  Error updating ${workout.day_of_week}:`, updateError);
    } else {
      console.log(`  ✓ Updated ${workout.day_of_week}: ${workout.workout_date} → ${correctDate}`);
    }
  }

  console.log(`Week ${weekNumber} fixed!`);
}

async function checkAllWeeks() {
  console.log('Checking all weeks...\n');

  for (let week = 1; week <= 36; week++) {
    await checkAndFixWeek(week);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n✅ All weeks checked and fixed!');
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: tsx scripts/fix-week-dates.ts [week_number|all]');
    console.log('Examples:');
    console.log('  tsx scripts/fix-week-dates.ts 1     # Check/fix Week 1');
    console.log('  tsx scripts/fix-week-dates.ts all   # Check/fix all weeks');
    return;
  }

  const arg = args[0];

  if (arg === 'all') {
    await checkAllWeeks();
  } else {
    const weekNumber = parseInt(arg);
    if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 36) {
      console.error('Invalid week number. Must be between 1 and 36.');
      return;
    }
    await checkAndFixWeek(weekNumber);
  }
}

main();
