#!/usr/bin/env tsx

/**
 * Seed Training Plan Data
 *
 * Populates Supabase with Wy'East Wonder 50M training plan:
 * - Training plan metadata
 * - 3 training phases (Foundation, Durability, Specificity)
 * - Week 1 weekly plan and daily workouts
 *
 * Usage: npm run seed:plan
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local from project root
const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

// Verify environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:');
  if (!supabaseUrl) console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseKey) console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('\nMake sure .env.local exists in project root with all required variables.');
  process.exit(1);
}

console.log('✅ Environment variables loaded successfully\n');

// Create Supabase client directly in the script (avoids import order issues)
const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// PLAN DATA
// ============================================================================

const PLAN_DATA = {
  plan_name: "Wy'East Wonder 50M Training Plan",
  goal_race: "Wy'East Wonder 50M - September 7, 2026",
  goal_distance: "51.8 miles",
  goal_elevation: "7,274 feet",
  start_date: "2026-01-05",
  end_date: "2026-09-07",
  total_weeks: 36,
  current_week: 1,
  is_active: true,
};

const PHASES = [
  {
    name: "Foundation",
    week_start: 1,
    week_end: 12,
    start_date: "2026-01-05",
    end_date: "2026-03-29",
    focus: "Build 18mpw → 40mpw, tissue adaptation, PT exercises daily",
  },
  {
    name: "Durability",
    week_start: 13,
    week_end: 28,
    start_date: "2026-03-30",
    end_date: "2026-07-19",
    focus: "Hold 40-50mpw, progressive vert 6k-9k, block periodization",
  },
  {
    name: "Specificity",
    week_start: 29,
    week_end: 36,
    start_date: "2026-07-20",
    end_date: "2026-09-07",
    focus: "Race-specific vert, back-to-back loading, taper",
  },
];

// Week 1 data
const WEEK_1_PLAN = {
  week_number: 1,
  phase: "Foundation",  // TEXT field, not foreign key
  week_start_date: "2026-01-05",  // renamed from start_date
  end_date: "2026-01-11",
  week_theme: "Start conservative, establish PT habit",
  target_miles: 24,  // Tue 6mi + Wed 4mi + Thu 5mi + Sun 9mi
  target_vert: 2100,  // Tue 1500ft + Thu 500ft + Sun 100ft
  notes: "Foundation phase begins - focus on consistency and tissue adaptation. 2 strength sessions (Heavy Day 1, Heavy Day 2). Daily PT Foundation exercises.",
};

const WEEK_1_WORKOUTS = [
  {
    workout_date: "2026-01-05",
    day_of_week: "Monday",
    workout_type: "rest",
    workout_notes: "PT Foundation exercises (10-15min): Hip marches, single-leg glute bridges, calf raises (goal: 30 each leg), Copenhagen planks, standing clamshells",
  },
  {
    workout_date: "2026-01-06",
    day_of_week: "Tuesday",
    workout_type: "run",
    run_distance_miles: 6,
    run_vert_feet: 1500,
    run_effort: "Z2, RPE 6-7, conversational",
    run_notes: "Tuesday Group Run - Social anchor run",
    pre_run_fuel: "Toast + jam, water 30min before",
    strength_session_type: "Heavy Day 1",
    strength_duration_minutes: 30,
    strength_exercises: JSON.stringify([
      { name: "Trap Bar Deadlift", sets: 3, reps: 8, weight: 95, weight_unit: "lbs" },
      { name: "Bulgarian Split Squat", sets: 3, reps: "8 each", weight: 20, weight_unit: "lbs" },
      { name: "Farmer's Carry", sets: 2, reps: "50ft", weight: 35, weight_unit: "lbs", note: "each hand" }
    ]),
    workout_notes: "Non-negotiable social run + strength after",
  },
  {
    workout_date: "2026-01-07",
    day_of_week: "Wednesday",
    workout_type: "run",
    run_distance_miles: 4,
    run_vert_feet: 0,
    run_effort: "Z2, RPE 5-6",
    run_notes: "Easy Run - Recovery pace, 10:30-11:30/mi on flat",
    workout_notes: "PT Foundation exercises. Conversational pace. Optional rowing instead: 30min Z2",
  },
  {
    workout_date: "2026-01-08",
    day_of_week: "Thursday",
    workout_type: "run",
    run_distance_miles: 5,
    run_vert_feet: 500,
    run_effort: "Z2, RPE 5-6",
    run_notes: "Easy Hills - Gentle rolling terrain",
    strength_session_type: "Heavy Day 2",
    strength_duration_minutes: 30,
    strength_exercises: JSON.stringify([
      { name: "Back Squat", sets: 3, reps: 8, weight: 95, weight_unit: "lbs" },
      { name: "Step-Ups", sets: 3, reps: "8 each", height: "20 inches" },
      { name: "Box Jumps", sets: 3, reps: 5, height: "24 inches" }
    ]),
    workout_notes: "Easy hills + strength after",
  },
  {
    workout_date: "2026-01-09",
    day_of_week: "Friday",
    workout_type: "rest",
    workout_notes: "PT Foundation exercises + mobility work",
  },
  {
    workout_date: "2026-01-10",
    day_of_week: "Saturday",
    workout_type: "rest",
    workout_notes: "PT Foundation exercises + full rest",
  },
  {
    workout_date: "2026-01-11",
    day_of_week: "Sunday",
    workout_type: "run",
    run_distance_miles: 9,
    run_vert_feet: 100,
    run_effort: "Z2, RPE 6",
    run_notes: "Long Run - Progressive endurance building, mostly flat",
    run_route: "Marine Drive or Springwater Corridor",
    during_run_nutrition: "1 gel at 45min",
    workout_notes: "PT Foundation exercises after. Practice race nutrition.",
  },
];

// ============================================================================
// SEEDING FUNCTIONS
// ============================================================================

async function seedTrainingPlan() {
  console.log('🏃 Seeding Training Plan\n');

  try {
    // Check if plan already exists
    const { data: existingPlan } = await supabase
      .from('training_plans')
      .select('id, plan_name')
      .eq('plan_name', PLAN_DATA.plan_name)
      .single();

    if (existingPlan) {
      console.log(`ℹ️  Plan already exists: ${existingPlan.plan_name} (${existingPlan.id})`);
      return existingPlan.id;
    }

    // Log data being inserted
    console.log('📤 Inserting training plan with data:');
    console.log(JSON.stringify(PLAN_DATA, null, 2));
    console.log('');

    // Insert training plan
    const { data: plan, error: planError } = await supabase
      .from('training_plans')
      .insert(PLAN_DATA)
      .select()
      .single();

    if (planError) {
      console.log('❌ Insert failed with error:');
      console.log(JSON.stringify(planError, null, 2));
      throw planError;
    }

    console.log(`✅ Created training plan: ${plan.plan_name}`);
    console.log(`   ID: ${plan.id}`);
    console.log(`   Duration: ${plan.start_date} to ${plan.end_date}`);
    console.log(`   Total weeks: ${plan.total_weeks}\n`);

    return plan.id;
  } catch (error) {
    console.error('❌ Error creating training plan:', error);
    throw error;
  }
}

async function seedPhases(planId: string) {
  console.log('📅 Seeding Training Phases\n');

  try {
    const phasesWithPlanId = PHASES.map(phase => ({
      ...phase,
      plan_id: planId,
    }));

    // Check if phases already exist
    const { data: existingPhases } = await supabase
      .from('training_phases')
      .select('id, name')
      .eq('plan_id', planId);

    if (existingPhases && existingPhases.length > 0) {
      console.log(`ℹ️  Phases already exist for this plan (${existingPhases.length})`);
      return existingPhases;
    }

    // Log data being inserted
    console.log('📤 Inserting phases with data:');
    console.log(JSON.stringify(phasesWithPlanId, null, 2));
    console.log('');

    // Insert phases
    const { data: phases, error: phasesError } = await supabase
      .from('training_phases')
      .insert(phasesWithPlanId)
      .select();

    if (phasesError) {
      console.log('❌ Insert failed with error:');
      console.log(JSON.stringify(phasesError, null, 2));
      throw phasesError;
    }

    phases.forEach(phase => {
      console.log(`✅ Created phase: ${phase.name}`);
      console.log(`   Weeks ${phase.week_start}-${phase.week_end}`);
      console.log(`   ${phase.start_date} to ${phase.end_date}`);
      console.log(`   Focus: ${phase.focus}\n`);
    });

    return phases;
  } catch (error) {
    console.error('❌ Error creating phases:', error);
    throw error;
  }
}

async function seedWeek1(planId: string) {
  console.log('📆 Seeding Week 1\n');

  try {
    // Check if Week 1 already exists
    const { data: existingWeek } = await supabase
      .from('weekly_plans')
      .select('id, week_number')
      .eq('plan_id', planId)
      .eq('week_number', 1)
      .single();

    let weeklyPlanId: string;

    if (existingWeek) {
      console.log(`ℹ️  Week 1 plan already exists (${existingWeek.id})`);
      weeklyPlanId = existingWeek.id;
    } else {
      const weekData = {
        ...WEEK_1_PLAN,
        plan_id: planId,
        // phase is already in WEEK_1_PLAN, no phase_id needed
      };

      // Log data being inserted
      console.log('📤 Inserting weekly plan with data:');
      console.log(JSON.stringify(weekData, null, 2));
      console.log('');

      // Insert weekly plan
      const { data: week, error: weekError } = await supabase
        .from('weekly_plans')
        .insert(weekData)
        .select()
        .single();

      if (weekError) {
        console.log('❌ Insert failed with error:');
        console.log(JSON.stringify(weekError, null, 2));
        throw weekError;
      }

      console.log(`✅ Created Week 1 plan`);
      console.log(`   Theme: ${week.week_theme}`);
      console.log(`   Target: ${week.target_miles} miles, ${week.target_vert} ft vert\n`);

      weeklyPlanId = week.id;
    }

    // Seed daily workouts
    await seedDailyWorkouts(weeklyPlanId);

    return weeklyPlanId;
  } catch (error) {
    console.error('❌ Error creating Week 1:', error);
    throw error;
  }
}

async function seedDailyWorkouts(weeklyPlanId: string) {
  console.log('📝 Seeding Daily Workouts for Week 1\n');

  try {
    // Check if workouts already exist
    const { data: existingWorkouts } = await supabase
      .from('daily_workouts')
      .select('id, date')
      .eq('weekly_plan_id', weeklyPlanId);

    if (existingWorkouts && existingWorkouts.length > 0) {
      console.log(`ℹ️  Daily workouts already exist for Week 1 (${existingWorkouts.length} days)\n`);
      return existingWorkouts;
    }

    // Insert daily workouts
    const workoutsWithPlanId = WEEK_1_WORKOUTS.map(workout => ({
      ...workout,
      weekly_plan_id: weeklyPlanId,
    }));

    // Log data being inserted
    console.log('📤 Inserting daily workouts with data:');
    console.log(JSON.stringify(workoutsWithPlanId, null, 2));
    console.log('');

    const { data: workouts, error: workoutsError } = await supabase
      .from('daily_workouts')
      .insert(workoutsWithPlanId)
      .select();

    if (workoutsError) {
      console.log('❌ Insert failed with error:');
      console.log(JSON.stringify(workoutsError, null, 2));
      throw workoutsError;
    }

    workouts.forEach((workout, index) => {
      const workoutName = workout.run_notes?.split(' - ')[0] || workout.workout_type;
      console.log(`✅ ${workout.day_of_week} (${workout.workout_date}): ${workoutName}`);
      if (workout.run_distance_miles) {
        console.log(`   ${workout.run_distance_miles} miles, ${workout.run_vert_feet} ft vert`);
      }
      if (workout.run_effort) {
        console.log(`   Effort: ${workout.run_effort}`);
      }
      if (index < workouts.length - 1) console.log('');
    });

    console.log(`\n✅ Created ${workouts.length} daily workouts\n`);

    return workouts;
  } catch (error) {
    console.error('❌ Error creating daily workouts:', error);
    throw error;
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('🌲 Wy\'East Wonder 50M Training Plan - Database Seeding\n');
  console.log('='.repeat(60));
  console.log('\n');

  try {
    // Seed in order: plan → phases → week 1
    const planId = await seedTrainingPlan();
    const phases = await seedPhases(planId);

    // Seed Week 1 (phase is stored as text in weekly_plans, not a foreign key)
    await seedWeek1(planId);

    console.log('='.repeat(60));
    console.log('\n🎉 Seeding Complete!\n');
    console.log('Summary:');
    console.log(`  ✅ 1 training plan`);
    console.log(`  ✅ ${phases.length} training phases`);
    console.log(`  ✅ 1 weekly plan (Week 1)`);
    console.log(`  ✅ 7 daily workouts`);
    console.log('\n' + '='.repeat(60));
    console.log('\n💡 Next steps:');
    console.log('  1. Check data in Supabase dashboard');
    console.log('  2. Provide WEEK-02 through WEEK-36 data');
    console.log('  3. Re-run script to seed remaining weeks\n');

  } catch (error) {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  }
}

main();
