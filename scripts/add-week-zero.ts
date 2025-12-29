import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// PT exercises as structured JSONB (same format as other weeks)
const PT_EXERCISES = [
  // Core
  { exercise: 'Hip marches', sets: '2', reps: '15', note: '' },
  { exercise: 'SL glute bridge', sets: '4', reps: '8 each', note: '' },
  { exercise: 'Calf raises', sets: '3', reps: 'AMRAP', note: 'Goal: 25-30 each leg' },
  { exercise: 'Copenhagen plank', sets: '3', reps: '20sec', note: '' },
  { exercise: 'Standing clamshells', sets: '2', reps: '15', note: '' },

  // Hip Flexor Strengthening
  { exercise: 'Seated banded hip flexor march', sets: '3', reps: '15-20', note: '' },
  { exercise: 'Psoas plank', sets: '3', reps: '30sec', note: '' },
  { exercise: 'Standing hip flexor march with pause', sets: '3', reps: '12-15', note: '' },

  // Knee/ITB Work
  { exercise: 'VMO dips', sets: '3', reps: '12 each', note: '' },
  { exercise: 'Terminal knee extensions', sets: '3', reps: '15', note: '' },
  { exercise: 'Wall sits with ball squeeze', sets: '3', reps: '30sec', note: '' },
  { exercise: 'Side-lying leg raises', sets: '3', reps: '15', note: '' },

  // Stretches
  { exercise: 'Lying hip flexor stretch', sets: '1', reps: '30sec each', note: '' },
  { exercise: 'Kneeling with band hip flexor stretch', sets: '1', reps: '30sec each', note: '' },
];

const OPTIONAL_RUN_NOTE = 'Optional: 2-3 mile FLAT easy run if hip flexor is quiet. STOP if any discomfort.';

async function addWeekZero() {
  console.log('Adding Week 0 (Recovery Week) to training plan...\n');

  try {
    // Step 1: Get the active training plan
    const { data: plan, error: planError } = await supabase
      .from('training_plans')
      .select('id')
      .eq('is_active', true)
      .single();

    if (planError || !plan) {
      console.error('Error fetching training plan:', planError);
      return;
    }

    console.log('✓ Found active training plan');

    // Step 2: Check if Week 0 already exists
    const { data: existingWeek } = await supabase
      .from('weekly_plans')
      .select('id')
      .eq('week_number', 0)
      .single();

    if (existingWeek) {
      console.log('⚠ Week 0 already exists. Deleting old Week 0...');

      // Delete old workouts first
      await supabase
        .from('daily_workouts')
        .delete()
        .eq('weekly_plan_id', existingWeek.id);

      // Delete old weekly plan
      await supabase
        .from('weekly_plans')
        .delete()
        .eq('id', existingWeek.id);

      console.log('✓ Old Week 0 deleted');
    }

    // Step 3: Create Week 0 weekly plan
    const { data: weeklyPlan, error: weekError } = await supabase
      .from('weekly_plans')
      .insert({
        plan_id: plan.id,
        week_number: 0,
        phase: 'Recovery',
        week_start_date: '2024-12-29',
        end_date: '2025-01-04',
        week_theme: 'Pre-training injury recovery - PT exercises only, flat running optional',
        target_miles: 0,
        target_vert: 0,
        notes: 'Focus: Hip flexor recovery, adductor strengthening, knee/ITB rehab. Daily PT exercises (15 total). Optional flat runs 2-3 miles if feeling good.',
      })
      .select()
      .single();

    if (weekError) {
      console.error('Error creating Week 0:', weekError);
      return;
    }

    console.log('✓ Created Week 0 weekly plan');

    // Step 4: Create 7 daily workouts (Dec 29 - Jan 4)
    const days = [
      { date: '2024-12-29', day: 'Sunday' },
      { date: '2024-12-30', day: 'Monday' },
      { date: '2024-12-31', day: 'Tuesday' },
      { date: '2025-01-01', day: 'Wednesday' },
      { date: '2025-01-02', day: 'Thursday' },
      { date: '2025-01-03', day: 'Friday' },
      { date: '2025-01-04', day: 'Saturday' },
    ];

    for (const day of days) {
      const { error: workoutError } = await supabase
        .from('daily_workouts')
        .insert({
          weekly_plan_id: weeklyPlan.id,
          workout_date: day.date,
          day_of_week: day.day,
          workout_type: 'strength',
          strength_session_type: 'PT Foundation (Recovery)',
          strength_duration_minutes: 20,
          strength_exercises: JSON.stringify(PT_EXERCISES),
          workout_notes: OPTIONAL_RUN_NOTE,
        });

      if (workoutError) {
        console.error(`Error creating workout for ${day.day}:`, workoutError);
        return;
      }

      console.log(`  ✓ ${day.day} (${day.date})`);
    }

    console.log('\n✅ Week 0 (Recovery Week) added successfully!');
    console.log('\nWeek 0 Summary:');
    console.log('- Dates: Dec 29, 2024 - Jan 4, 2025');
    console.log('- Phase: Recovery');
    console.log('- Focus: PT exercises, hip flexor recovery, optional flat runs');
    console.log('- All 7 days include full PT routine');

  } catch (error) {
    console.error('Error adding Week 0:', error);
  }
}

addWeekZero();
