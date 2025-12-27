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

// Load .env.local from project root
const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

// Verify environment variables
const requiredVars = {
  'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

const missingVars = Object.entries(requiredVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nMake sure .env.local exists in project root with all required variables.');
  process.exit(1);
}

console.log('✅ Environment variables loaded successfully\n');

import { supabase } from '../lib/supabase';

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
  start_date: "2026-01-05",
  end_date: "2026-01-11",
  week_theme: "Start conservative, establish PT habit",
  target_miles: 27,
  target_vert: 2200,
  notes: "Foundation phase begins - focus on consistency and tissue adaptation",
};

const WEEK_1_WORKOUTS = [
  {
    date: "2026-01-05",
    day_of_week: "Monday",
    workout_type: "rest",
    workout_name: "Rest Day + PT",
    description: "Full rest day with PT Foundation exercises",
    notes: "PT exercises daily (10-15min): Hip marches, single-leg glute bridges, calf raises (goal: 30 each leg), Copenhagen planks, standing clamshells",
  },
  {
    date: "2026-01-06",
    day_of_week: "Tuesday",
    workout_type: "run",
    workout_name: "Tuesday Group Run",
    description: "Social anchor run, conversational pace",
    target_distance_miles: 6,
    target_vert_feet: 1500,
    effort_guidance: "Z2, RPE 6-7, conversational",
    notes: "Non-negotiable social run. Pre-run: Toast + jam, water 30min before",
  },
  {
    date: "2026-01-07",
    day_of_week: "Wednesday",
    workout_type: "run",
    workout_name: "Easy Run",
    description: "Recovery pace, easy effort",
    target_distance_miles: 4,
    target_vert_feet: 0,
    effort_guidance: "Z2, RPE 5-6",
    pace_guidance: "10:30-11:30/mi on flat",
    notes: "Conversational, recovery pace. Optional rowing instead: 30min Z2",
  },
  {
    date: "2026-01-08",
    day_of_week: "Thursday",
    workout_type: "run",
    workout_name: "Easy Run",
    description: "Easy effort, maintain conversation",
    target_distance_miles: 5,
    target_vert_feet: 300,
    effort_guidance: "Z2, RPE 5-6",
    pace_guidance: "10:30-11:30/mi",
    notes: "Recovery run or 40min rowing Z2",
  },
  {
    date: "2026-01-09",
    day_of_week: "Friday",
    workout_type: "rest",
    workout_name: "Rest Day + PT",
    description: "Full rest with PT exercises",
    notes: "PT Foundation exercises + mobility work",
  },
  {
    date: "2026-01-10",
    day_of_week: "Saturday",
    workout_type: "run",
    workout_name: "Long Run",
    description: "Progressive long run building endurance",
    target_distance_miles: 8,
    target_vert_feet: 400,
    effort_guidance: "Z2, RPE 6",
    notes: "Practice race nutrition: 1 gel at 30min. Routes: Marine Drive (flat) or Sellwood → Cemetery (rollers)",
  },
  {
    date: "2026-01-11",
    day_of_week: "Sunday",
    workout_type: "run",
    workout_name: "Easy Run",
    description: "Shake-out run, very easy",
    target_distance_miles: 4,
    target_vert_feet: 0,
    effort_guidance: "Z2, RPE 5",
    pace_guidance: "11:00-12:00/mi",
    notes: "Recovery pace or 30min rowing (18-20 SPM, very easy)",
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

    // Insert training plan
    const { data: plan, error: planError } = await supabase
      .from('training_plans')
      .insert(PLAN_DATA)
      .select()
      .single();

    if (planError) throw planError;

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

    // Insert phases
    const { data: phases, error: phasesError } = await supabase
      .from('training_phases')
      .insert(phasesWithPlanId)
      .select();

    if (phasesError) throw phasesError;

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

async function seedWeek1(planId: string, phaseId: string) {
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
      // Insert weekly plan
      const { data: week, error: weekError } = await supabase
        .from('weekly_plans')
        .insert({
          ...WEEK_1_PLAN,
          plan_id: planId,
          phase_id: phaseId,
        })
        .select()
        .single();

      if (weekError) throw weekError;

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

    const { data: workouts, error: workoutsError } = await supabase
      .from('daily_workouts')
      .insert(workoutsWithPlanId)
      .select();

    if (workoutsError) throw workoutsError;

    workouts.forEach((workout, index) => {
      console.log(`✅ ${workout.day_of_week} (${workout.date}): ${workout.workout_name}`);
      if (workout.target_distance_miles) {
        console.log(`   ${workout.target_distance_miles} miles, ${workout.target_vert_feet} ft vert`);
      }
      if (workout.effort_guidance) {
        console.log(`   Effort: ${workout.effort_guidance}`);
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

    // Get Foundation phase ID
    const foundationPhase = phases.find(p => p.name === 'Foundation');
    if (!foundationPhase) {
      throw new Error('Foundation phase not found');
    }

    await seedWeek1(planId, foundationPhase.id);

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
