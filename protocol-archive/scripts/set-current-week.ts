import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function setCurrentWeek(weekNumber: number) {
  console.log(`Setting current week to ${weekNumber}...`);

  const { error } = await supabase
    .from('training_plans')
    .update({ current_week: weekNumber })
    .eq('is_active', true);

  if (error) {
    console.error('Error updating current week:', error);
    return;
  }

  console.log(`✅ Current week set to ${weekNumber}`);
}

const weekArg = process.argv[2];
if (!weekArg) {
  console.log('Usage: tsx scripts/set-current-week.ts <week_number>');
  console.log('Example: tsx scripts/set-current-week.ts 0');
  process.exit(1);
}

const weekNumber = parseInt(weekArg);
if (isNaN(weekNumber) || weekNumber < 0 || weekNumber > 36) {
  console.error('Invalid week number. Must be between 0 and 36.');
  process.exit(1);
}

setCurrentWeek(weekNumber);
