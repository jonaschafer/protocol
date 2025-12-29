import { createClient } from '@supabase/supabase-js';
import { getCompressedPlanStructure, calculatePhaseDates, getWeekDates, mapToOriginalWeek } from './compress-plan';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function reconfigurePlan(raceDate: Date, startDate: Date) {
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('Starting plan reconfiguration...');

    // Step 1: Delete existing workout data (but preserve logs)
    console.log('Deleting existing workout plans...');

    // Delete daily_workouts first (foreign key constraint)
    const { error: deleteWorkoutsError } = await supabase
      .from('daily_workouts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteWorkoutsError) {
      console.error('Error deleting daily_workouts:', deleteWorkoutsError);
      throw deleteWorkoutsError;
    }

    // Delete weekly_plans
    const { error: deletePlansError } = await supabase
      .from('weekly_plans')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deletePlansError) {
      console.error('Error deleting weekly_plans:', deletePlansError);
      throw deletePlansError;
    }

    console.log('✓ Existing plans deleted');

    // Step 2: Update training_plan
    console.log('Updating training plan...');

    const phaseDates = calculatePhaseDates(startDate);

    const { error: updatePlanError } = await supabase
      .from('training_plans')
      .update({
        start_date: phaseDates.planStart,
        end_date: phaseDates.planEnd,
        goal_race_date: raceDate.toISOString().split('T')[0],
        total_weeks: 32,
        current_week: 1,
      })
      .eq('is_active', true);

    if (updatePlanError) {
      console.error('Error updating training_plan:', updatePlanError);
      throw updatePlanError;
    }

    console.log('✓ Training plan updated');

    // Step 3: Update training_phases
    console.log('Updating training phases...');

    // Foundation phase
    const { error: foundationError } = await supabase
      .from('training_phases')
      .update({
        start_date: phaseDates.foundation.start_date,
        end_date: phaseDates.foundation.end_date,
        week_count: 10,
      })
      .eq('phase_name', 'Foundation');

    if (foundationError) {
      console.error('Error updating Foundation phase:', foundationError);
      throw foundationError;
    }

    // Durability phase
    const { error: durabilityError } = await supabase
      .from('training_phases')
      .update({
        start_date: phaseDates.durability.start_date,
        end_date: phaseDates.durability.end_date,
        week_count: 14,
      })
      .eq('phase_name', 'Durability');

    if (durabilityError) {
      console.error('Error updating Durability phase:', durabilityError);
      throw durabilityError;
    }

    // Specificity phase
    const { error: specificityError } = await supabase
      .from('training_phases')
      .update({
        start_date: phaseDates.specificity.start_date,
        end_date: phaseDates.specificity.end_date,
        week_count: 8,
      })
      .eq('phase_name', 'Specificity');

    if (specificityError) {
      console.error('Error updating Specificity phase:', specificityError);
      throw specificityError;
    }

    console.log('✓ Training phases updated');

    // Step 4: Generate compressed weekly plans and workouts
    console.log('Generating compressed 32-week plan...');

    const compressedStructure = getCompressedPlanStructure();
    const weeklyWorkouts = await loadWorkoutsFromMasterPlan();

    for (const week of compressedStructure) {
      const weekDates = getWeekDates(startDate, week.weekNumber);

      // Create weekly_plan
      const { data: weeklyPlan, error: weekError } = await supabase
        .from('weekly_plans')
        .insert({
          week_number: week.weekNumber,
          phase: week.phase,
          start_date: weekDates.start_date,
          end_date: weekDates.end_date,
          week_theme: week.theme,
          target_miles: week.miles,
          target_vert: week.vert,
        })
        .select()
        .single();

      if (weekError) {
        console.error(`Error creating weekly plan for week ${week.weekNumber}:`, weekError);
        throw weekError;
      }

      console.log(`Created week ${week.weekNumber} (maps to original week ${week.originalWeekNumber})`);

      // Get workouts from original week
      const originalWeekWorkouts = weeklyWorkouts[week.originalWeekNumber];

      if (originalWeekWorkouts) {
        // Insert daily workouts for this week
        for (const workout of originalWeekWorkouts) {
          const { error: workoutError } = await supabase
            .from('daily_workouts')
            .insert({
              ...workout,
              weekly_plan_id: weeklyPlan.id,
            });

          if (workoutError) {
            console.error(`Error creating workout for ${workout.day_of_week}:`, workoutError);
            throw workoutError;
          }
        }
      } else {
        console.warn(`No workout data found for original week ${week.originalWeekNumber}`);
      }
    }

    console.log('✓ Compressed plan generated successfully');
    console.log(`\nPlan Summary:`);
    console.log(`- Start Date: ${phaseDates.planStart}`);
    console.log(`- Race Date: ${raceDate.toISOString().split('T')[0]}`);
    console.log(`- Total Weeks: 32`);
    console.log(`- Foundation: Weeks 1-10`);
    console.log(`- Durability: Weeks 11-24`);
    console.log(`- Specificity: Weeks 25-32`);

    return {
      success: true,
      message: 'Plan reconfigured successfully',
      details: {
        totalWeeks: 32,
        startDate: phaseDates.planStart,
        raceDate: raceDate.toISOString().split('T')[0],
      },
    };

  } catch (error) {
    console.error('Error during plan reconfiguration:', error);
    return {
      success: false,
      message: 'Failed to reconfigure plan',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Load workouts from MASTER_PLAN.md
 * Returns a map of week number -> array of daily workouts
 */
async function loadWorkoutsFromMasterPlan(): Promise<Record<number, any[]>> {
  // For now, return empty object - we'll implement MASTER_PLAN parsing later
  // This would parse MASTER_PLAN.md similar to seed-all-weeks.ts

  // TODO: Implement MASTER_PLAN.md parsing
  // For MVP, we can use a simplified approach or copy workout templates

  return {};
}

/**
 * Simpler approach: Copy workouts from existing plan using original week mapping
 * This preserves all workout details from the original 36-week plan
 */
export async function reconfigurePlanSimple(raceDate: Date, startDate: Date) {
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('Starting simple plan reconfiguration...');

    // Step 1: Get existing workouts from original plan (before deleting)
    console.log('Loading existing workout templates...');

    const { data: existingWeeks, error: fetchError } = await supabase
      .from('weekly_plans')
      .select(`
        *,
        daily_workouts (*)
      `)
      .order('week_number');

    if (fetchError) {
      console.error('Error fetching existing plans:', fetchError);
      throw fetchError;
    }

    // Create a map of week_number -> workouts
    const workoutsByWeek: Record<number, any[]> = {};
    existingWeeks?.forEach((week: any) => {
      workoutsByWeek[week.week_number] = week.daily_workouts || [];
    });

    console.log(`✓ Loaded ${Object.keys(workoutsByWeek).length} weeks of workout templates`);

    // Step 2: Delete existing workout data (but preserve Week 0 if it exists)
    console.log('Deleting existing workout plans (preserving Week 0)...');

    // Get Week 0 ID to preserve it
    const { data: weekZero } = await supabase
      .from('weekly_plans')
      .select('id')
      .eq('week_number', 0)
      .single();

    // Delete daily_workouts (except Week 0)
    if (weekZero) {
      const { error: deleteWorkoutsError } = await supabase
        .from('daily_workouts')
        .delete()
        .neq('weekly_plan_id', weekZero.id);

      if (deleteWorkoutsError) throw deleteWorkoutsError;
    } else {
      const { error: deleteWorkoutsError } = await supabase
        .from('daily_workouts')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (deleteWorkoutsError) throw deleteWorkoutsError;
    }

    // Delete weekly_plans (except Week 0)
    const { error: deletePlansError } = await supabase
      .from('weekly_plans')
      .delete()
      .neq('week_number', 0);

    if (deletePlansError) throw deletePlansError;

    console.log('✓ Existing plans deleted (Week 0 preserved)');

    // Step 3: Update training_plan and phases
    const phaseDates = calculatePhaseDates(startDate);

    const { error: updatePlanError } = await supabase
      .from('training_plans')
      .update({
        start_date: phaseDates.planStart,
        end_date: phaseDates.planEnd,
        goal_race_date: raceDate.toISOString().split('T')[0],
        total_weeks: 32,
        current_week: 1,
      })
      .eq('is_active', true);

    if (updatePlanError) throw updatePlanError;

    // Update phases
    await supabase.from('training_phases').update({
      start_date: phaseDates.foundation.start_date,
      end_date: phaseDates.foundation.end_date,
      week_count: 10,
    }).eq('phase_name', 'Foundation');

    await supabase.from('training_phases').update({
      start_date: phaseDates.durability.start_date,
      end_date: phaseDates.durability.end_date,
      week_count: 14,
    }).eq('phase_name', 'Durability');

    await supabase.from('training_phases').update({
      start_date: phaseDates.specificity.start_date,
      end_date: phaseDates.specificity.end_date,
      week_count: 8,
    }).eq('phase_name', 'Specificity');

    console.log('✓ Training plan and phases updated');

    // Step 4: Generate compressed plan using workout templates
    console.log('Generating compressed 32-week plan...');

    const compressedStructure = getCompressedPlanStructure();
    const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    for (const week of compressedStructure) {
      const weekDates = getWeekDates(startDate, week.weekNumber);

      // Create weekly_plan
      const { data: weeklyPlan, error: weekError } = await supabase
        .from('weekly_plans')
        .insert({
          week_number: week.weekNumber,
          phase: week.phase,
          start_date: weekDates.start_date,
          end_date: weekDates.end_date,
          week_theme: week.theme,
          target_miles: week.miles,
          target_vert: week.vert,
        })
        .select()
        .single();

      if (weekError) throw weekError;

      // Get workouts from original week
      const originalWorkouts = workoutsByWeek[week.originalWeekNumber] || [];

      // Calculate workout dates for this week
      const weekStartDate = new Date(weekDates.start_date);

      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const workoutDate = new Date(weekStartDate);
        workoutDate.setDate(weekStartDate.getDate() + dayIndex);
        const dateStr = workoutDate.toISOString().split('T')[0];

        // Find matching workout from original week by day of week
        const dayName = DAY_ORDER[dayIndex];
        const originalWorkout = originalWorkouts.find((w: any) => w.day_of_week === dayName);

        if (originalWorkout) {
          // Copy workout but update dates and remove id/weekly_plan_id
          const { id, weekly_plan_id, workout_date, created_at, updated_at, ...workoutData } = originalWorkout;

          const { error: workoutError } = await supabase
            .from('daily_workouts')
            .insert({
              ...workoutData,
              weekly_plan_id: weeklyPlan.id,
              workout_date: dateStr,
            });

          if (workoutError) {
            console.error(`Error creating workout for ${dayName}:`, workoutError);
            throw workoutError;
          }
        }
      }

      console.log(`✓ Week ${week.weekNumber} (from original week ${week.originalWeekNumber})`);
    }

    console.log('✓ Compressed plan generated successfully!');

    return {
      success: true,
      message: 'Plan reconfigured successfully',
      details: {
        totalWeeks: 32,
        startDate: phaseDates.planStart,
        raceDate: raceDate.toISOString().split('T')[0],
      },
    };

  } catch (error) {
    console.error('Error during plan reconfiguration:', error);
    return {
      success: false,
      message: 'Failed to reconfigure plan',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
