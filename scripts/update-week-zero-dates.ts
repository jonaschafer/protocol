import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function updateWeekZeroDates() {
  console.log('Updating Week 0 dates to current week...\n');

  // Get current date and find the start of this week (Sunday)
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const weekStartStr = startOfWeek.toISOString().split('T')[0];
  const weekEndStr = endOfWeek.toISOString().split('T')[0];

  console.log(`Current week: ${weekStartStr} to ${weekEndStr}`);

  // Update weekly_plan
  const { data: weekPlan, error: weekError } = await supabase
    .from('weekly_plans')
    .update({
      week_start_date: weekStartStr,
      end_date: weekEndStr,
    })
    .eq('week_number', 0)
    .select()
    .single();

  if (weekError) {
    console.error('Error updating weekly plan:', weekError);
    return;
  }

  console.log('✓ Updated weekly plan dates');

  // Update daily workout dates
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (let i = 0; i < 7; i++) {
    const workoutDate = new Date(startOfWeek);
    workoutDate.setDate(startOfWeek.getDate() + i);
    const dateStr = workoutDate.toISOString().split('T')[0];

    const { error: updateError } = await supabase
      .from('daily_workouts')
      .update({ workout_date: dateStr })
      .eq('weekly_plan_id', weekPlan.id)
      .eq('day_of_week', days[i]);

    if (updateError) {
      console.error(`Error updating ${days[i]}:`, updateError);
    } else {
      console.log(`  ✓ ${days[i]}: ${dateStr}`);
    }
  }

  console.log('\n✅ Week 0 dates updated to current week!');
  console.log(`Week 0 is now: ${weekStartStr} to ${weekEndStr}`);
}

updateWeekZeroDates();
