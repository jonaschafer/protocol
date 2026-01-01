import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkWeekZero() {
  const { data, error } = await supabase
    .from('weekly_plans')
    .select('week_number, phase, week_start_date, end_date')
    .order('week_number');

  if (error) {
    console.error('Error:', error);
  } else {
    console.log(`Found ${data.length} weeks total`);
    console.log('\nFirst 3 weeks:');
    data.slice(0, 3).forEach(week => {
      console.log(`  Week ${week.week_number}: ${week.week_start_date} - ${week.end_date} (${week.phase})`);
    });
  }
}

checkWeekZero();
