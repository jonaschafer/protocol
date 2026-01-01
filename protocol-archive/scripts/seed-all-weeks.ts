#!/usr/bin/env tsx

/**
 * Seed All 36 Weeks - Complete Training Plan
 *
 * Parses MASTER_PLAN.md and seeds all 36 weeks of training data
 * Uses exact column names from actual-schema.txt
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load .env.local
const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Exact column names from actual-schema.txt
interface WeeklyPlanData {
  plan_id?: string;
  week_number: number;
  phase: string;  // "Foundation" | "Durability" | "Specificity"
  week_start_date: string;
  end_date: string;
  week_theme?: string;
  target_miles?: number;
  target_vert?: number;
  notes?: string;
}

interface DailyWorkoutData {
  weekly_plan_id?: string;
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
  strength_exercises?: string;  // JSON string
  rowing_duration_minutes?: number;
  rowing_effort?: string;
  rowing_spm_target?: string;
  pre_run_fuel?: string;
  during_run_nutrition?: string;
  workout_notes?: string;
}

interface ParsedWeek {
  weekly_plan: WeeklyPlanData;
  daily_workouts: DailyWorkoutData[];
  validation: {
    dayCount: number;
    calculatedMiles: number;
    calculatedVert: number;
    headerMiles?: number;
    headerVert?: number;
    mismatch: boolean;
  };
}

// Phase date ranges
const PHASES = [
  { name: "Foundation", week_start: 1, week_end: 12, start_date: "2026-01-05", end_date: "2026-03-29" },
  { name: "Durability", week_start: 13, week_end: 28, start_date: "2026-03-30", end_date: "2026-07-19" },
  { name: "Specificity", week_start: 29, week_end: 36, start_date: "2026-07-20", end_date: "2026-09-07" },
];

function getPhaseForWeek(weekNumber: number): string {
  for (const phase of PHASES) {
    if (weekNumber >= phase.week_start && weekNumber <= phase.week_end) {
      return phase.name;
    }
  }
  return "Foundation"; // Default
}

function parseDate(dateStr: string): string {
  // Parse formats like "January 5", "February 15", etc. and convert to 2026-MM-DD
  const months: Record<string, string> = {
    'January': '01', 'February': '02', 'March': '03', 'April': '04',
    'May': '05', 'June': '06', 'July': '07', 'August': '08',
    'September': '09', 'October': '10', 'November': '11', 'December': '12'
  };

  const match = dateStr.match(/(\w+)\s+(\d+)/);
  if (match) {
    const month = months[match[1]];
    const day = match[2].padStart(2, '0');
    return `2026-${month}-${day}`;
  }
  return dateStr;
}

function parseDateRange(dateRange: string): { startDate: string; endDate: string } {
  // Handle two formats:
  // 1. Same month: "January 5-11, 2026"
  // 2. Cross-month: "January 26 - February 1, 2026"

  // Try cross-month format first
  const crossMonthMatch = dateRange.match(/(\w+)\s+(\d+)\s+-\s+(\w+)\s+(\d+),\s+(\d{4})/);
  if (crossMonthMatch) {
    const startMonth = crossMonthMatch[1];
    const startDay = crossMonthMatch[2];
    const endMonth = crossMonthMatch[3];
    const endDay = crossMonthMatch[4];

    return {
      startDate: parseDate(`${startMonth} ${startDay}`),
      endDate: parseDate(`${endMonth} ${endDay}`)
    };
  }

  // Try same-month format
  const sameMonthMatch = dateRange.match(/(\w+\s+\d+)-(\d+),\s+(\d{4})/);
  if (sameMonthMatch) {
    const monthDay = sameMonthMatch[1]; // "January 5"
    const endDay = sameMonthMatch[2];   // "11"
    const month = monthDay.split(' ')[0];

    return {
      startDate: parseDate(monthDay),
      endDate: parseDate(`${month} ${endDay}`)
    };
  }

  return { startDate: '', endDate: '' };
}

function extractMilesAndVert(text: string): { miles: number | undefined, vert: number | undefined } {
  let miles: number | undefined;
  let vert: number | undefined;

  // Match patterns like "6 miles", "6mi", "6 mi"
  const milesMatch = text.match(/(\d+\.?\d*)\s*(?:miles?|mi)/i);
  if (milesMatch) {
    miles = parseFloat(milesMatch[1]);
  }

  // Match patterns like "1500ft", "1500 ft", "1,500ft", "0-200ft"
  // For ranges, use the max value
  const vertRangeMatch = text.match(/(\d+,?\d*)\s*-\s*(\d+,?\d*)\s*ft/i);
  if (vertRangeMatch) {
    // Use max value from range
    vert = parseInt(vertRangeMatch[2].replace(',', ''));
  } else {
    const vertMatch = text.match(/(\d+,?\d*)\s*ft/i);
    if (vertMatch) {
      vert = parseInt(vertMatch[1].replace(',', ''));
    }
  }

  return { miles, vert };
}

function extractStrengthExercises(text: string): string | undefined {
  // Look for strength session details in nested bullet format
  const exercises: any[] = [];
  const lines = text.split('\n');

  let currentSection = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) continue;

    // Check for section headers (Warm-up, Main, Accessory, Finisher)
    if (line.match(/Warm-up:/i)) {
      currentSection = 'warmup';
      const details = line.replace(/^-\s*Warm-up:\s*/i, '').trim();
      if (details) exercises.push({ exercise: "Warm-up", details });
      continue;
    }

    if (line.match(/Main:/i)) {
      currentSection = 'main';
      // Check if there's exercise info on same line
      const exerciseText = line.replace(/^-\s*Main:\s*/i, '').trim();
      if (exerciseText) {
        const ex = parseExerciseLine(exerciseText);
        if (ex) {
          ex.section = currentSection;
          exercises.push(ex);
        }
      }
      continue;
    }

    if (line.match(/Accessory:/i)) {
      currentSection = 'accessory';
      // Check if there's exercise info on same line
      const exerciseText = line.replace(/^-\s*Accessory:\s*/i, '').trim();
      if (exerciseText) {
        const ex = parseExerciseLine(exerciseText);
        if (ex) {
          ex.section = currentSection;
          exercises.push(ex);
        }
      }
      continue;
    }

    if (line.match(/Finisher:/i)) {
      currentSection = 'finisher';
      // Check if there's exercise info on same line
      const exerciseText = line.replace(/^-\s*Finisher:\s*/i, '').trim();
      if (exerciseText) {
        const ex = parseExerciseLine(exerciseText);
        if (ex) {
          ex.section = currentSection;
          exercises.push(ex);
        }
      }
      continue;
    }

    // Parse exercise lines (starting with -)
    if (line.startsWith('-') && currentSection) {
      const exerciseLine = line.substring(1).trim();
      const ex = parseExerciseLine(exerciseLine);
      if (ex) {
        ex.section = currentSection;
        exercises.push(ex);
      }
    }
  }

  return exercises.length > 0 ? JSON.stringify(exercises) : undefined;
}

function parseExerciseLine(line: string): any | null {
  // Parse lines like "Trap bar deadlift 3x6 (60%, 70%, 75%)"
  // or "Bulgarian split squat 3x8 each leg"
  const match = line.match(/^(.+?)\s+(\d+)x(\d+)/);
  if (match) {
    const exercise = match[1].trim();
    const sets = parseInt(match[2]);
    const reps = match[3];

    // Extract weight/note if present in parentheses
    const noteMatch = line.match(/\(([^)]+)\)/);
    const note = noteMatch ? noteMatch[1] : undefined;

    return { exercise, sets, reps, note };
  }

  // Simpler format: "Farmer carry 3x30sec (44lb each hand)"
  const durationMatch = line.match(/^(.+?)\s+(\d+)x(.+?)(?:\s+\((.+)\))?$/);
  if (durationMatch) {
    return {
      exercise: durationMatch[1].trim(),
      sets: parseInt(durationMatch[2]),
      duration: durationMatch[3].trim(),
      note: durationMatch[4]
    };
  }

  return null;
}

function calculateWeekTotals(workouts: DailyWorkoutData[]): { miles: number; vert: number } {
  let miles = 0;
  let vert = 0;

  for (const workout of workouts) {
    if (workout.run_distance_miles) {
      miles += workout.run_distance_miles;
    }
    if (workout.run_vert_feet) {
      vert += workout.run_vert_feet;
    }
  }

  return { miles, vert };
}

function parseMasterPlan(testWeeks?: number[]): ParsedWeek[] {
  const masterPlanPath = '/Users/jonschafer/Dropbox/ jon/work/WHT_Resources/protocol-local/36 week plan/MASTER_PLAN.md';
  const content = readFileSync(masterPlanPath, 'utf-8');

  const weeks: ParsedWeek[] = [];
  const lines = content.split('\n');

  let currentWeek: ParsedWeek | null = null;
  let currentDay: DailyWorkoutData | null = null;
  let inStrengthSection = false;
  let strengthText = '';
  let headerMiles: number | undefined;
  let headerVert: number | undefined;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect week header: "## Week X: Date Range"
    const weekMatch = line.match(/^##\s+Week\s+(\d+):\s+(.+)/i);
    if (weekMatch) {
      // Save previous week if exists
      if (currentWeek && currentDay) {
        if (inStrengthSection && strengthText) {
          currentDay.strength_exercises = extractStrengthExercises(strengthText);
        }
        currentWeek.daily_workouts.push(currentDay);
        currentDay = null;
      }
      if (currentWeek) {
        // Calculate totals and validate
        const calculated = calculateWeekTotals(currentWeek.daily_workouts);
        currentWeek.validation = {
          dayCount: currentWeek.daily_workouts.length,
          calculatedMiles: calculated.miles,
          calculatedVert: calculated.vert,
          headerMiles,
          headerVert,
          mismatch: headerMiles !== undefined && Math.abs(calculated.miles - headerMiles) > 0.5
        };

        // Use calculated miles if there's a mismatch
        if (currentWeek.validation.mismatch) {
          currentWeek.weekly_plan.target_miles = calculated.miles;
        }

        weeks.push(currentWeek);
      }

      const weekNumber = parseInt(weekMatch[1]);

      // Only parse if we're testing specific weeks OR parsing all
      if (testWeeks && !testWeeks.includes(weekNumber)) {
        currentWeek = null;
        headerMiles = undefined;
        headerVert = undefined;
        continue;
      }

      // Parse date range using improved parser
      const dateRange = weekMatch[2];
      const { startDate, endDate } = parseDateRange(dateRange);

      currentWeek = {
        weekly_plan: {
          week_number: weekNumber,
          phase: getPhaseForWeek(weekNumber),
          week_start_date: startDate,
          end_date: endDate,
        },
        daily_workouts: [],
        validation: {
          dayCount: 0,
          calculatedMiles: 0,
          calculatedVert: 0,
          mismatch: false
        }
      };

      // Reset header values for new week
      headerMiles = undefined;
      headerVert = undefined;

      continue;
    }

    if (!currentWeek) continue;

    // Extract week metadata
    if (line.startsWith('**Focus:**')) {
      // Week focus goes in notes
      const focus = line.replace('**Focus:**', '').trim();
      if (!currentWeek.weekly_plan.notes) {
        currentWeek.weekly_plan.notes = focus;
      } else {
        currentWeek.weekly_plan.notes += '. ' + focus;
      }
    }

    if (line.startsWith('**Volume:**')) {
      const volume = line.replace('**Volume:**', '').trim();
      const { miles, vert } = extractMilesAndVert(volume);
      headerMiles = miles;
      headerVert = vert;
      currentWeek.weekly_plan.target_miles = miles;
      currentWeek.weekly_plan.target_vert = vert;
    }

    if (line.startsWith('**Key Theme:**')) {
      currentWeek.weekly_plan.week_theme = line.replace('**Key Theme:**', '').trim();
    }

    // Detect day header: "### Monday, January 5"
    const dayMatch = line.match(/^###\s+(\w+),\s+(.+)/);
    if (dayMatch) {
      // Save previous day if exists
      if (currentDay) {
        if (inStrengthSection && strengthText) {
          currentDay.strength_exercises = extractStrengthExercises(strengthText);
        }
        currentWeek.daily_workouts.push(currentDay);
      }

      const dayOfWeek = dayMatch[1];
      const dateStr = dayMatch[2];
      const workoutDate = parseDate(dateStr);

      currentDay = {
        workout_date: workoutDate,
        day_of_week: dayOfWeek,
        workout_type: 'rest', // Default, will be updated
        workout_notes: ''
      };

      inStrengthSection = false;
      strengthText = '';

      continue;
    }

    if (!currentDay) continue;

    // Parse workout details
    if (line.includes('**Rest Day**')) {
      currentDay.workout_type = 'rest';
    }

    // Handle rowing workouts
    if (line.includes('**Row:**') || line.includes('**Rowing:**')) {
      currentDay.workout_type = 'rowing';

      // Extract duration
      const durationMatch = line.match(/(\d+)min/);
      if (durationMatch) {
        currentDay.rowing_duration_minutes = parseInt(durationMatch[1]);
      }

      // Extract effort/SPM
      const effortMatch = line.match(/Z(\d+)/i);
      if (effortMatch) {
        currentDay.rowing_effort = `Z${effortMatch[1]}`;
      }
    }

    // Handle run workouts
    if (line.includes('**Group Run:**') || line.includes('**Easy Run:**') ||
        line.includes('**Long Run:**') || line.includes('**Workout Run:**') ||
        line.match(/\*\*.*(?:Run|Hills).*:\*\*/)) {
      currentDay.workout_type = 'run';
      const { miles, vert } = extractMilesAndVert(line);
      if (miles) currentDay.run_distance_miles = miles;
      // Set vert to 0 if not specified, or use extracted value
      currentDay.run_vert_feet = vert !== undefined ? vert : 0;

      // Extract workout name
      const nameMatch = line.match(/\*\*([^:]+):\*\*/);
      if (nameMatch) {
        currentDay.run_notes = nameMatch[1];
      }
    }

    if (line.includes('**Effort:**')) {
      const effortText = line.replace('**Effort:**', '').trim();
      currentDay.run_effort = effortText;

      // Extract RPE if present (handle formats like "RPE 6-7", "RPE 6")
      const rpeMatch = effortText.match(/RPE\s+([\d-]+)/i);
      if (rpeMatch) {
        currentDay.run_rpe_target = rpeMatch[1];
      }
    }

    if (line.includes('**Route:**')) {
      currentDay.run_route = line.replace('**Route:**', '').trim();
    }

    // Pre-run fuel extraction (multiple formats)
    if (line.includes('**Pre-run:**') || line.includes('**Pre-run fuel:**')) {
      currentDay.pre_run_fuel = line.replace(/\*\*Pre-run.*?:\*\*/, '').trim();
    }

    // During-run nutrition extraction (improved)
    if (line.includes('**During run:**') || line.includes('**During:**')) {
      const duringText = line.replace(/\*\*During.*?:\*\*/, '').trim();
      currentDay.during_run_nutrition = duringText;
    }

    // Also check for "Fuel:" lines (may contain both pre-run and during)
    if (line.includes('**Fuel:**')) {
      const fuelText = line.replace('**Fuel:**', '').trim();

      // Look for "pre-run" portion
      if (fuelText.toLowerCase().includes('pre-run')) {
        const preMatch = fuelText.match(/eat something pre-run/i);
        if (preMatch && !currentDay.pre_run_fuel) {
          currentDay.pre_run_fuel = 'Eat something 60-90min before';
        }
      }

      // Look for "flask" or "bring" portion for during nutrition
      const duringMatch = fuelText.match(/bring flask with (\d+g carbs)/i) ||
                          fuelText.match(/flask.*?(\d+g\s+carbs)/i);
      if (duringMatch) {
        currentDay.during_run_nutrition = `Flask with ${duringMatch[1]}`;
      } else if (!fuelText.toLowerCase().includes('practice fueling')) {
        // If not a "practice fueling" instruction, use full text
        currentDay.during_run_nutrition = fuelText;
      }
    }

    // Detect strength section start (handle both inline and separate formats)
    if (line.includes('**Strength - Heavy Day') || line.includes('**Post-run Strength')) {
      inStrengthSection = true;
      strengthText = line + '\n';

      const typeMatch = line.match(/Heavy Day\s+(\d+)/);
      if (typeMatch) {
        currentDay.strength_session_type = `Heavy Day ${typeMatch[1]}`;
      }

      const durationMatch = line.match(/\((\d+)min\)/);
      if (durationMatch) {
        currentDay.strength_duration_minutes = parseInt(durationMatch[1]);
      }
    } else if (inStrengthSection && line.trim().startsWith('-')) {
      // Accumulate strength exercise lines
      strengthText += line + '\n';
    } else if (inStrengthSection && !line.trim().startsWith('-') && line.trim() !== '') {
      // End of strength section
      if (line.includes('**')) {
        inStrengthSection = false;
      }
    }

    // Notes extraction
    if (line.includes('**Notes:**') || line.includes('**KEY REMINDER:**')) {
      const notes = line.replace(/\*\*(?:Notes|KEY REMINDER):\*\*/, '').trim();
      if (currentDay.workout_notes) {
        currentDay.workout_notes += ' ' + notes;
      } else {
        currentDay.workout_notes = notes;
      }
    }

    // Decision lines (like "If any niggles...")
    if (line.includes('**Decision:**')) {
      const decision = line.replace('**Decision:**', '').trim();
      if (currentDay.workout_notes) {
        currentDay.workout_notes += ' ' + decision;
      } else {
        currentDay.workout_notes = decision;
      }
    }

    // PT Foundation detection
    if (line.includes('PT Foundation') || line.includes('**Post-run:** PT Foundation')) {
      if (!currentDay.workout_notes) {
        currentDay.workout_notes = '';
      }
      if (!currentDay.workout_notes.includes('PT Foundation')) {
        currentDay.workout_notes += ' PT Foundation exercises.';
      }
    }
  }

  // Save last day and week
  if (currentDay) {
    if (inStrengthSection && strengthText) {
      currentDay.strength_exercises = extractStrengthExercises(strengthText);
    }
    currentWeek?.daily_workouts.push(currentDay);
  }
  if (currentWeek) {
    // Calculate totals and validate for last week
    const calculated = calculateWeekTotals(currentWeek.daily_workouts);
    currentWeek.validation = {
      dayCount: currentWeek.daily_workouts.length,
      calculatedMiles: calculated.miles,
      calculatedVert: calculated.vert,
      headerMiles,
      headerVert,
      mismatch: headerMiles !== undefined && Math.abs(calculated.miles - headerMiles) > 0.5
    };

    // Use calculated miles if there's a mismatch
    if (currentWeek.validation.mismatch) {
      currentWeek.weekly_plan.target_miles = calculated.miles;
    }

    // If week_start_date or end_date are empty (like "RACE WEEK"), use first and last day dates
    if (!currentWeek.weekly_plan.week_start_date && currentWeek.daily_workouts.length > 0) {
      currentWeek.weekly_plan.week_start_date = currentWeek.daily_workouts[0].workout_date;
      currentWeek.weekly_plan.end_date = currentWeek.daily_workouts[currentWeek.daily_workouts.length - 1].workout_date;
    }

    weeks.push(currentWeek);
  }

  return weeks;
}

async function deleteExistingData() {
  console.log('🗑️  Deleting existing training data...\n');

  try {
    // Delete in order (cascade should handle this, but being explicit)
    const { error: workoutsError } = await supabase
      .from('daily_workouts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (workoutsError) throw workoutsError;
    console.log('✅ Deleted all daily_workouts');

    const { error: weeksError } = await supabase
      .from('weekly_plans')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (weeksError) throw weeksError;
    console.log('✅ Deleted all weekly_plans');

    console.log('\n✅ Database cleared successfully\n');
  } catch (error) {
    console.error('❌ Error deleting data:', error);
    throw error;
  }
}

async function seedWeeks(weeks: ParsedWeek[], planId: string) {
  console.log(`\n📅 Seeding ${weeks.length} weeks...\n`);
  console.log('='.repeat(80));

  for (const week of weeks) {
    console.log(`\n📆 Week ${week.weekly_plan.week_number}: ${week.weekly_plan.week_theme || 'No theme'}`);
    console.log(`   Phase: ${week.weekly_plan.phase}`);
    console.log(`   Dates: ${week.weekly_plan.week_start_date} to ${week.weekly_plan.end_date}`);
    console.log(`   Target: ${week.weekly_plan.target_miles || '?'}mi, ${week.weekly_plan.target_vert || '?'}ft`);

    // Insert weekly plan
    const { data: weeklyPlan, error: weekError } = await supabase
      .from('weekly_plans')
      .insert({
        ...week.weekly_plan,
        plan_id: planId
      })
      .select()
      .single();

    if (weekError) {
      console.error(`   ❌ Error creating week ${week.weekly_plan.week_number}:`, weekError);
      continue;
    }

    console.log(`   ✅ Created weekly plan`);

    // Insert daily workouts
    const workoutsWithPlanId = week.daily_workouts.map(w => ({
      ...w,
      weekly_plan_id: weeklyPlan.id
    }));

    const { data: workouts, error: workoutsError } = await supabase
      .from('daily_workouts')
      .insert(workoutsWithPlanId)
      .select();

    if (workoutsError) {
      console.error(`   ❌ Error creating workouts:`, workoutsError);
      continue;
    }

    // Count workout types
    const runs = workouts?.filter(w => w.workout_type === 'run').length || 0;
    const strength = workouts?.filter(w => w.strength_session_type).length || 0;
    const rest = workouts?.filter(w => w.workout_type === 'rest').length || 0;

    console.log(`   ✅ Created ${workouts?.length} workouts: ${runs} runs, ${strength} strength, ${rest} rest`);
  }

  console.log('\n' + '='.repeat(80));
}

async function main() {
  const testMode = process.argv.includes('--test');

  console.log('\n🌲 Wy\'East Wonder 50M - Full 36 Week Training Plan');
  console.log('='.repeat(80));
  console.log('\n');

  try {
    if (testMode) {
      console.log('🧪 TEST MODE: Parsing specific weeks for verification\n');
      console.log('Testing:');
      console.log('  - Week 1: Foundation start');
      console.log('  - Week 4: First deload (cross-month dates)');
      console.log('  - Week 12: Foundation test');
      console.log('  - Week 16: Durability block');
      console.log('\n' + '='.repeat(80));

      const testWeeks = parseMasterPlan([1, 4, 12, 16]);

      for (const week of testWeeks) {
        console.log(`\n📋 WEEK ${week.weekly_plan.week_number} PARSED DATA:`);
        console.log('='.repeat(80));
        console.log(JSON.stringify(week.weekly_plan, null, 2));

        // Validation info
        console.log('\n📊 VALIDATION:');
        console.log(`   Days: ${week.validation.dayCount}/7`);
        console.log(`   Header miles: ${week.validation.headerMiles || 'N/A'}`);
        console.log(`   Calculated miles: ${week.validation.calculatedMiles.toFixed(1)}`);
        if (week.validation.mismatch) {
          console.log(`   ⚠️  MISMATCH DETECTED - Using calculated miles (${week.validation.calculatedMiles})`);
        }

        console.log('\n📅 Daily Workouts:');
        week.daily_workouts.forEach((workout, i) => {
          console.log(`\n${i + 1}. ${workout.day_of_week} (${workout.workout_date}):`);
          console.log(`   Type: ${workout.workout_type}`);

          if (workout.run_distance_miles) {
            const vert = workout.run_vert_feet !== undefined ? workout.run_vert_feet : 0;
            console.log(`   Run: ${workout.run_distance_miles}mi, ${vert}ft`);
            if (workout.run_effort) console.log(`   Effort: ${workout.run_effort}`);
            if (workout.run_rpe_target) console.log(`   RPE Target: ${workout.run_rpe_target}`);
            if (workout.run_route) console.log(`   Route: ${workout.run_route}`);
          }

          if (workout.rowing_duration_minutes) {
            console.log(`   Rowing: ${workout.rowing_duration_minutes}min @ ${workout.rowing_effort || 'Z2'}`);
          }

          if (workout.strength_session_type) {
            const duration = workout.strength_duration_minutes ? `${workout.strength_duration_minutes}min` : 'duration not specified';
            console.log(`   Strength: ${workout.strength_session_type} (${duration})`);
            if (workout.strength_exercises) {
              const exercises = JSON.parse(workout.strength_exercises);
              console.log(`   Exercises: ${exercises.length} exercises parsed`);
            }
          }

          if (workout.pre_run_fuel) {
            console.log(`   Pre-run: ${workout.pre_run_fuel}`);
          }

          if (workout.during_run_nutrition) {
            console.log(`   During: ${workout.during_run_nutrition}`);
          }

          if (workout.workout_notes) {
            console.log(`   Notes: ${workout.workout_notes.substring(0, 100)}${workout.workout_notes.length > 100 ? '...' : ''}`);
          }
        });
        console.log('\n' + '='.repeat(80));
      }

      console.log('\n✅ Test parsing complete!');
      console.log('\nTo seed all weeks, run: npm run seed:all');

    } else {
      console.log('🚀 FULL SEED MODE: Parsing and seeding all 36 weeks\n');

      // Get plan ID
      const { data: plan } = await supabase
        .from('training_plans')
        .select('id')
        .eq('plan_name', "Wy'East Wonder 50M Training Plan")
        .single();

      if (!plan) {
        throw new Error('Training plan not found! Run seed:plan first.');
      }

      // Delete existing data
      await deleteExistingData();

      // Parse all weeks
      console.log('📖 Parsing MASTER_PLAN.md...\n');
      const allWeeks = parseMasterPlan();
      console.log(`✅ Parsed ${allWeeks.length} weeks\n`);

      // Validate all weeks
      console.log('🔍 Validating parsed data...\n');
      let validationErrors = 0;
      for (const week of allWeeks) {
        if (week.validation.dayCount !== 7) {
          console.log(`⚠️  Week ${week.weekly_plan.week_number}: Has ${week.validation.dayCount} days (expected 7)`);
          validationErrors++;
        }
        if (week.validation.mismatch) {
          console.log(`⚠️  Week ${week.weekly_plan.week_number}: Mileage mismatch (header: ${week.validation.headerMiles}, calculated: ${week.validation.calculatedMiles})`);
        }
      }

      if (validationErrors > 0) {
        console.log(`\n⚠️  Found ${validationErrors} validation errors`);
        console.log('Continue anyway? (Ctrl+C to abort)\n');
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        console.log('✅ All weeks validated successfully\n');
      }

      // Seed all weeks
      await seedWeeks(allWeeks, plan.id);

      console.log('\n🎉 ALL WEEKS SEEDED SUCCESSFULLY!\n');
      console.log('Summary:');
      console.log(`  ✅ ${allWeeks.length} weekly plans created`);
      console.log(`  ✅ ${allWeeks.reduce((sum, w) => sum + w.daily_workouts.length, 0)} daily workouts created`);
      console.log('\n' + '='.repeat(80));
    }

  } catch (error) {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  }
}

main();
