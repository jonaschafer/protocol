#!/usr/bin/env tsx

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteWeek1() {
  console.log('🗑️  Deleting existing Week 1 data...\n');

  try {
    // Get Week 1 weekly_plan ID
    const { data: week1 } = await supabase
      .from('weekly_plans')
      .select('id, week_number')
      .eq('week_number', 1)
      .single();

    if (!week1) {
      console.log('ℹ️  No Week 1 plan found to delete');
      return;
    }

    console.log(`Found Week 1 plan: ${week1.id}`);

    // Delete daily workouts (should cascade, but being explicit)
    const { error: workoutsError } = await supabase
      .from('daily_workouts')
      .delete()
      .eq('weekly_plan_id', week1.id);

    if (workoutsError) {
      console.error('❌ Error deleting daily workouts:', workoutsError);
      throw workoutsError;
    }

    console.log('✅ Deleted daily workouts');

    // Delete weekly plan
    const { error: weekError } = await supabase
      .from('weekly_plans')
      .delete()
      .eq('id', week1.id);

    if (weekError) {
      console.error('❌ Error deleting weekly plan:', weekError);
      throw weekError;
    }

    console.log('✅ Deleted weekly plan');
    console.log('\n✅ Week 1 data deleted successfully\n');

  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

deleteWeek1();
