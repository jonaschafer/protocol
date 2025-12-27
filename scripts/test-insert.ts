#!/usr/bin/env tsx

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testWeeklyPlanInsert() {
  console.log('Testing weekly_plans insert...\n');

  // Try with absolute minimum
  const tests = [
    {
      plan_id: 'b09f29d6-2661-4b74-9c83-92ddf6783b0f',
      week_number: 999,
      phase: 'Foundation',
      week_start_date: '2026-01-05',
    },
    {
      plan_id: 'b09f29d6-2661-4b74-9c83-92ddf6783b0f',
      week_number: 999,
      phase: 'Foundation',
      week_start_date: '2026-01-05',
      week_end_date: '2026-01-11',
      week_theme: 'Test',
      target_miles: 27,
      target_vert: 2200,
      notes: 'Test notes',
    },
  ];

  for (const testData of tests) {
    console.log('\nAttempting insert with:', JSON.stringify(testData, null, 2));

    const { data, error } = await supabase
      .from('weekly_plans')
      .insert(testData)
      .select();

    if (error) {
      console.log('❌ Error:', error.message);
    } else {
      console.log('✅ Success! Columns in returned row:');
      console.log(Object.keys(data[0]).join(', '));
      console.log('\nReturned data:', JSON.stringify(data[0], null, 2));

      // Delete test row
      await supabase.from('weekly_plans').delete().eq('week_number', 999);
      console.log('🗑️  Test row deleted\n');
      return; // Stop after first success
    }
  }
}

async function testDailyWorkoutInsert() {
  console.log('\n\nTesting daily_workouts insert...\n');

  // First, create a test weekly plan
  const weekData = {
    plan_id: 'b09f29d6-2661-4b74-9c83-92ddf6783b0f',
    week_number: 999,
    phase: 'Foundation',
    week_start_date: '2026-01-05',
  };

  const { data: weekPlan } = await supabase
    .from('weekly_plans')
    .insert(weekData)
    .select()
    .single();

  if (!weekPlan) {
    console.log('❌ Could not create test weekly plan');
    return;
  }

  console.log('✅ Created test weekly plan:', weekPlan.id);

  const tests = [
    {
      weekly_plan_id: weekPlan.id,
      workout_type: 'rest',
      workout_date: '2026-01-05',
      day_of_week: 'Monday',
    },
    {
      weekly_plan_id: weekPlan.id,
      workout_type: 'run',
      workout_date: '2026-01-06',
      day_of_week: 'Tuesday',
      name: 'Tuesday Group Run',
      target_distance_miles: 6,
      target_vert_feet: 1500,
      effort_guidance: 'Z2, RPE 6-7',
      pace_guidance: '10:00-10:30/mi',
      notes: 'Social run',
    },
  ];

  for (const testData of tests) {
    console.log('\nAttempting daily_workout insert with:', JSON.stringify(testData, null, 2));

    const { data, error } = await supabase
      .from('daily_workouts')
      .insert(testData)
      .select();

    if (error) {
      console.log('❌ Error:', error.message);
    } else {
      console.log('✅ Success! Columns in returned row:');
      console.log(Object.keys(data[0]).join(', '));
      console.log('\nReturned data:', JSON.stringify(data[0], null, 2));
      break; // Stop after first success
    }
  }

  // Delete test rows
  await supabase.from('weekly_plans').delete().eq('week_number', 999);
  console.log('\n🗑️  Test rows deleted');
}

async function main() {
  await testWeeklyPlanInsert();
  await testDailyWorkoutInsert();
}

main();
