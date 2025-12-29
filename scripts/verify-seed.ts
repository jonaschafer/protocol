import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function verify() {
  const { data: weeks } = await supabase
    .from('weekly_plans')
    .select('week_number, phase, target_miles, target_vert')
    .order('week_number');

  const { data: workouts } = await supabase
    .from('daily_workouts')
    .select('workout_type');

  console.log('\nVERIFICATION RESULTS:');
  console.log('Weekly Plans:', weeks?.length || 0);
  console.log('Daily Workouts:', workouts?.length || 0);
  
  const runs = workouts?.filter(w => w.workout_type === 'run').length || 0;
  const rowing = workouts?.filter(w => w.workout_type === 'rowing').length || 0;
  const rest = workouts?.filter(w => w.workout_type === 'rest').length || 0;
  
  console.log('  Runs:', runs);
  console.log('  Rowing:', rowing);
  console.log('  Rest:', rest);
  
  const firstWeek = weeks?.[0];
  const lastWeek = weeks?.[weeks.length - 1];
  
  console.log('\nWeek 1:', firstWeek?.phase, '-', firstWeek?.target_miles + 'mi');
  console.log('Week 36:', lastWeek?.phase, '-', (lastWeek?.target_miles || '?') + 'mi');
}

verify();
