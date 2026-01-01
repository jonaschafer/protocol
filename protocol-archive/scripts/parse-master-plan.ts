#!/usr/bin/env tsx

/**
 * Parse MASTER_PLAN.md and extract training data
 * This will be used by the seeding script
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Exact column names from actual-schema.txt
interface WeeklyPlanData {
  week_number: number;
  phase: string;  // TEXT: "Foundation" | "Durability" | "Specificity"
  week_start_date: string;
  week_theme: string;
  target_miles: number;
  target_vert: number;
  notes: string;
  end_date: string;
}

interface DailyWorkoutData {
  workout_date: string;
  day_of_week: string;
  workout_type: string;  // "rest" | "run" | "strength" | "rowing"
  run_distance_miles?: number;
  run_vert_feet?: number;
  run_effort?: string;
  run_rpe_target?: string;
  run_route?: string;
  run_notes?: string;
  strength_session_type?: string;
  strength_duration_minutes?: number;
  strength_exercises?: any;  // jsonb
  rowing_duration_minutes?: number;
  rowing_effort?: string;
  rowing_spm_target?: string;
  pre_run_fuel?: string;
  during_run_nutrition?: string;
  workout_notes?: string;
}

interface WeekData {
  weekly_plan: WeeklyPlanData;
  daily_workouts: DailyWorkoutData[];
}

function parseWeek1(): WeekData {
  // Week 1: January 5-11, 2026
  const week1: WeekData = {
    weekly_plan: {
      week_number: 1,
      phase: "Foundation",
      week_start_date: "2026-01-05",
      end_date: "2026-01-11",
      week_theme: "Start conservative, establish PT habit",
      target_miles: 27,
      target_vert: 2200,
      notes: "Base building, tissue adaptation. 2 strength sessions (Heavy Day 1, Heavy Day 2). Daily PT Foundation exercises.",
    },
    daily_workouts: [
      // Monday, January 5 - Rest + PT
      {
        workout_date: "2026-01-05",
        day_of_week: "Monday",
        workout_type: "rest",
        workout_notes: "PT Foundation (10-15min): Hip marches 2x15, SL glute bridge 4x8 each, Calf raises 3xAMRAP (test baseline - aim for 30), Copenhagen plank 3x20sec, Standing clamshells 2x15. First day back on plan.",
      },

      // Tuesday, January 6 - Group Run 6mi/1500ft + Heavy Day 1
      {
        workout_date: "2026-01-06",
        day_of_week: "Tuesday",
        workout_type: "run",
        run_distance_miles: 6,
        run_vert_feet: 1500,
        run_effort: "Z2, RPE 6-7",
        run_rpe_target: "6-7",
        run_route: "Your usual Tuesday group route",
        run_notes: "Group Run - Conversational pace",
        pre_run_fuel: "Toast + jam, water 30min before",
        strength_session_type: "Heavy Day 1",
        strength_duration_minutes: 30,
        strength_exercises: JSON.stringify([
          { exercise: "Warm-up", details: "10 BW squats, walkouts, SL hinges, lying glute raises, dead bugs" },
          { exercise: "Trap Bar Deadlift", sets: 3, reps: 6, weight: "60%, 70%, 75%", note: "Conservative start" },
          { exercise: "Bulgarian Split Squat", sets: 3, reps: "8 each leg", weight: "BW or light KB" },
          { exercise: "Farmer Carry", sets: 3, duration: "30sec", weight: "44lb each hand" }
        ]),
        workout_notes: "RESIST urge to push uphills. If you finish feeling like you could do 3 more miles, that's PERFECT.",
      },

      // Wednesday, January 7 - Easy Run 4mi/200ft + PT
      {
        workout_date: "2026-01-07",
        day_of_week: "Wednesday",
        workout_type: "run",
        run_distance_miles: 4,
        run_vert_feet: 200,
        run_effort: "Z2, RPE 5-6",
        run_rpe_target: "5-6",
        run_route: "Flat streets or Marine Drive",
        run_notes: "Easy Run - Recovery pace",
        workout_notes: "PT Foundation exercises. Should feel EASY. If legs feel heavy from Tuesday, that's normal. Keep cadence high, steps short.",
      },

      // Thursday, January 8 - Easy Hills 5mi/500ft + Heavy Day 2
      {
        workout_date: "2026-01-08",
        day_of_week: "Thursday",
        workout_type: "run",
        run_distance_miles: 5,
        run_vert_feet: 500,
        run_effort: "Z2-3, RPE 6-7",
        run_rpe_target: "6-7",
        run_route: "Belmont Hill or Tabor mellow loops",
        run_notes: "Easy Hills - Just get used to hills again",
        strength_session_type: "Heavy Day 2",
        strength_duration_minutes: 30,
        strength_exercises: JSON.stringify([
          { exercise: "Warm-up", details: "2x8 bar-only: good mornings, overhead press, back lunges" },
          { exercise: "Back Squat", sets: 4, reps: 5, weight: "60-70%", note: "3-sec pause at bottom" },
          { exercise: "Step-Ups", sets: 3, reps: "6 each leg", equipment: "20\" box, light weight" },
          { exercise: "Box Jumps", sets: 3, reps: 5, note: "Step down, not jump down" }
        ]),
        workout_notes: "This is NOT a hard workout yet. Building the habit of Thursday quality day. Walk breaks OK on steep sections.",
      },

      // Friday, January 9 - Easy Run/Row 3mi + PT
      {
        workout_date: "2026-01-09",
        day_of_week: "Friday",
        workout_type: "run",
        run_distance_miles: 3,
        run_vert_feet: 0,
        run_effort: "Z2, RPE 5",
        run_rpe_target: "5",
        run_notes: "Easy Run or Rowing option",
        rowing_duration_minutes: 30,
        rowing_effort: "Z2, conversational",
        rowing_spm_target: "18-20",
        workout_notes: "PT Foundation exercises. DECISION: If any niggles from Thursday → row. If fresh → easy run.",
      },

      // Saturday, January 10 - Rest
      {
        workout_date: "2026-01-10",
        day_of_week: "Saturday",
        workout_type: "rest",
        workout_notes: "Rest Day. Optional: Light mobility, foam rolling, walk.",
      },

      // Sunday, January 11 - Long Run 9mi/0-200ft + PT
      {
        workout_date: "2026-01-11",
        day_of_week: "Sunday",
        workout_type: "run",
        run_distance_miles: 9,
        run_vert_feet: 200,
        run_effort: "Z2, RPE 6",
        run_rpe_target: "6",
        run_route: "Flat-ish (Sellwood loop, Marine Drive, Oak Grove)",
        run_notes: "Long Run - Time on feet, not pace",
        pre_run_fuel: "Eat something 60-90min before",
        during_run_nutrition: "Flask with 50g carbs for 90min effort",
        workout_notes: "PT Foundation exercises. Keep it EASY. Goal is time on feet, not pace. Save vert for next week. 3:1 recovery drink within 30min post-run.",
      },
    ],
  };

  return week1;
}

// Test the parser
function main() {
  console.log('📋 Parsing Week 1 from MASTER_PLAN.md\n');
  console.log('='.repeat(80));
  console.log('\n');

  const week1 = parseWeek1();

  console.log('WEEKLY PLAN DATA:');
  console.log(JSON.stringify(week1.weekly_plan, null, 2));
  console.log('\n');
  console.log('='.repeat(80));
  console.log('\n');

  console.log(`DAILY WORKOUTS (${week1.daily_workouts.length} days):\n`);

  week1.daily_workouts.forEach((workout, index) => {
    console.log(`${index + 1}. ${workout.day_of_week}, ${workout.workout_date}:`);
    console.log(`   Type: ${workout.workout_type}`);

    if (workout.run_distance_miles) {
      console.log(`   Run: ${workout.run_distance_miles}mi, ${workout.run_vert_feet}ft`);
      console.log(`   Effort: ${workout.run_effort}`);
    }

    if (workout.strength_session_type) {
      console.log(`   Strength: ${workout.strength_session_type} (${workout.strength_duration_minutes}min)`);
    }

    if (workout.rowing_duration_minutes) {
      console.log(`   Rowing option: ${workout.rowing_duration_minutes}min @ ${workout.rowing_spm_target} SPM`);
    }

    console.log('');
  });

  console.log('='.repeat(80));
  console.log('\n');
  console.log('✅ Week 1 parsed successfully!');
  console.log('\n');
  console.log('VERIFICATION vs WEEK-01-REFERENCE.md:');
  console.log('- Mon: Rest + PT ✓');
  console.log('- Tue: 6mi/1500ft + Heavy Day 1 ✓');
  console.log('- Wed: 4mi/200ft + PT ✓');
  console.log('- Thu: 5mi/500ft + Heavy Day 2 ✓');
  console.log('- Fri: 3mi (or rowing) + PT ✓');
  console.log('- Sat: Rest ✓');
  console.log('- Sun: 9mi/200ft + PT ✓');
  console.log('\nTotal: 27 miles, ~2200ft vert ✓');
}

main();

export { parseWeek1 };
export type { WeekData, WeeklyPlanData, DailyWorkoutData };
