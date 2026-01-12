import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Parse command line arguments
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run') || args.includes('--sql-only')
const outputSqlFile = args.find(arg => arg.startsWith('--output='))?.split('=')[1]

// PT Foundation exercises (from lines 92-171)
const PT_FOUNDATION_EXERCISES = [
  {
    category: 'Hip Flexor Strengthening',
    exercises: [
      'Seated Banded Hip Flexor March - 3x15-20 each leg',
      'Psoas Plank - 3x30sec',
      'Hip Marches - 2x15 each leg'
    ]
  },
  {
    category: 'Adductor Strengthening',
    exercises: [
      'Side Plank Clam Raise - 2x15 each side',
      'Side-Lying Adduction - 3x15 each leg (Priority)',
      'Copenhagen Plank - 3x20sec each side (Priority)'
    ]
  },
  {
    category: 'Abductor Maintenance',
    exercises: [
      'Monster Walks - 3 sets of 18ft (one direction)',
      'Side Walks with Band - 3 sets of 9ft each direction',
      'Fonda (Fire hydrants) - 3x15 each side',
      'Single-Leg Balance Eyes Closed - 3x30sec each leg'
    ]
  },
  {
    category: 'Glutes & Posterior Chain',
    exercises: [
      'Single-Leg Glute Bridge with Weight - 4x8 each leg',
      'Calf Raises - 3xAMRAP (goal: 30 each leg by Week 9)'
    ]
  },
  {
    category: 'Knee & ITB Protection',
    exercises: [
      'Wall Sit - 3x30sec (progress to 3x60sec by Week 9)',
      'Step Downs - 3x15 each leg'
    ]
  }
]

function formatPTFoundationNotes(): string {
  let notes = 'PT FOUNDATION PROGRAM (20-25 minutes daily):\n\n'
  PT_FOUNDATION_EXERCISES.forEach(category => {
    notes += `${category.category}:\n`
    category.exercises.forEach(ex => {
      notes += `  • ${ex}\n`
    })
    notes += '\n'
  })
  return notes
}

// Helper to calculate week start date
function getWeekStartDate(weekNumber: number): Date {
  const startDate = new Date(2026, 1, 2) // Feb 2, 2026
  const daysOffset = (weekNumber - 1) * 7
  const date = new Date(startDate)
  date.setDate(date.getDate() + daysOffset)
  return date
}

// Helper to get day of week name
function getDayOfWeek(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[date.getDay()]
}

// Parse workout from markdown content
function parseWorkout(dayContent: string, date: Date, weekNumber: number): any {
  const workout: any = {
    workout_date: date.toISOString().split('T')[0],
    day_of_week: getDayOfWeek(date),
    workout_type: 'rest',
    workout_notes: '',
    strength_exercises: null,
    strength_session_type: null
  }

  const isFoundationPhase = weekNumber >= 1 && weekNumber <= 9

  // Check for rest day first - must be explicit
  const restDayPattern = /(?:^|\n|[-•])\s*\*\*Rest\s+Day\*\*/i
  if (restDayPattern.test(dayContent)) {
    workout.workout_type = 'rest'
    // Only add PT notes on rest days during foundation phase
    if (isFoundationPhase) {
      workout.workout_notes = formatPTFoundationNotes()
    }
    return workout
  }

  // Parse run data - check for all run types (order matters - more specific first)
  const runPatterns = [
    { name: 'groupRun', pattern: /\*\*Group\s+Run\*\*[:\s]*(\d+(?:\.\d+)?)\s*miles?/i },
    { name: 'longRun', pattern: /\*\*Long\s+Run\*\*[:\s]*(\d+(?:\.\d+)?)\s*miles?/i },
    { name: 'easyRun', pattern: /\*\*Easy\s+Run\*\*[:\s]*(\d+(?:\.\d+)?)\s*miles?/i },
    { name: 'hill', pattern: /\*\*.*Hills?\*\*[:\s]*(\d+(?:\.\d+)?)\s*miles?/i },
    { name: 'tempo', pattern: /\*\*Tempo\*\*[:\s]*(\d+(?:\.\d+)?)\s*miles?/i },
    { name: 'steady', pattern: /\*\*Steady\s+State\*\*[:\s]*(\d+(?:\.\d+)?)\s*miles?/i },
    { name: 'run', pattern: /\*\*.*Run\*\*[:\s]*(\d+(?:\.\d+)?)\s*miles?/i },
  ]

  let runMatch: RegExpMatchArray | null = null
  for (const { pattern } of runPatterns) {
    const match = dayContent.match(pattern)
    if (match) {
      runMatch = match
      break
    }
  }

  if (runMatch) {
    const miles = parseFloat(runMatch[1])
    workout.run_distance_miles = miles
    workout.workout_type = 'run'
    
    // Parse vert - look for patterns like "1,000 ft vert" or "1000 ft vert"
    const vertMatch = dayContent.match(/(\d+(?:,\d+)?)\s*ft\s*vert/i) || dayContent.match(/(\d+(?:,\d+)?)\s*vert/i)
    if (vertMatch) {
      workout.run_vert_feet = parseInt(vertMatch[1].replace(/,/g, ''))
    }
    
    // Parse effort - handle formats like "Conversational (Z2, RPE 6)" or just "Z2"
    const effortMatch = dayContent.match(/\*\*Effort\*\*[:\s]*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/i)
    if (effortMatch) {
      workout.run_effort = effortMatch[1].trim().replace(/\n/g, ' ')
    }
    
    // Parse route
    const routeMatch = dayContent.match(/\*\*Route\*\*[:\s]*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/i)
    if (routeMatch) {
      workout.run_notes = (workout.run_notes || '') + `Route: ${routeMatch[1].trim()}\n`
    }
  }

  // Parse rowing
  const rowMatch = dayContent.match(/\*\*.*Row\*\*[:\s]*(\d+)\s*min/i) || dayContent.match(/(\d+)\s*min\s*row/i)
  if (rowMatch) {
    workout.rowing_duration_minutes = parseInt(rowMatch[1])
    workout.workout_type = workout.workout_type === 'run' ? 'run+strength' : 'rowing'
    
    const rowEffortMatch = dayContent.match(/row[,\s]+(Z\d+|RPE\s*\d+)/i) || dayContent.match(/\*\*Effort\*\*[:\s]*([^\n]+)/i)
    if (rowEffortMatch) {
      workout.rowing_effort = rowEffortMatch[1]?.trim() || rowEffortMatch[0]?.trim()
    }
  }

  // Parse strength exercises - handle "Heavy Day 1", "Heavy Day 2", "PT Foundation", "Runner Maintenance"
  const strengthMatch = dayContent.match(/\*\*Strength\s*-\s*(Heavy\s*Day\s*\d+|PT\s*Foundation|Runner\s*Maintenance)\*\*/i)
  if (strengthMatch) {
    workout.strength_session_type = strengthMatch[1].trim()
    
    if (workout.workout_type === 'run') {
      workout.workout_type = 'run+strength'
    } else if (workout.workout_type === 'rest') {
      workout.workout_type = 'strength'
    }
    
    // Extract strength exercises - get the section after "Strength -"
    const strengthSectionMatch = dayContent.match(/\*\*Strength\s*-\s*[^*]+([\s\S]*?)(?=\*\*[A-Z]|\*\*Notes|\*\*Fuel|$)/i)
    const strengthSection = strengthSectionMatch ? strengthSectionMatch[1] : ''
    
    const exercises: any[] = []
    
    // Parse common exercises with more flexible patterns
    const exercisePatterns = [
      { name: 'Trap bar deadlift', pattern: /Trap\s*bar\s*deadlift[^\n]*(\d+)\s*x\s*(\d+)[^\n]*\(([^)]+)\)/i },
      { name: 'Bulgarian split squat', pattern: /Bulgarian\s*split\s*squat[^\n]*(\d+)\s*x\s*(\d+)[^\n]*\(([^)]+)\)/i },
      { name: 'Back squat', pattern: /Back\s*squat[^\n]*(\d+)\s*x\s*(\d+)[^\n]*\(([^)]+)\)/i },
      { name: 'Step-ups', pattern: /Step-ups[^\n]*(\d+)\s*x\s*(\d+)[^\n]*\(([^)]+)\)/i },
      { name: 'Box jumps', pattern: /Box\s*jumps[^\n]*(\d+)\s*x\s*(\d+)/i },
      { name: 'Farmer carry', pattern: /Farmer\s*carry[^\n]*(\d+)\s*x\s*(\d+)[^\n]*\(([^)]+)\)/i },
    ]
    
    exercisePatterns.forEach(({ name, pattern }) => {
      const match = strengthSection.match(pattern)
      if (match) {
        exercises.push({
          name,
          sets: parseInt(match[1]),
          reps: match[2],
          notes: match[3]?.trim() || ''
        })
      }
    })
    
    if (exercises.length > 0) {
      workout.strength_exercises = exercises
    }
  }

  // Parse notes
  const notesMatch = dayContent.match(/\*\*Notes\*\*[:\s]*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/i)
  if (notesMatch) {
    workout.run_notes = (workout.run_notes || '') + notesMatch[1].trim()
  }

  // Parse fuel/nutrition
  const fuelMatch = dayContent.match(/\*\*Fuel\*\*[:\s]*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/i)
  if (fuelMatch) {
    workout.run_notes = (workout.run_notes || '') + `\nFuel: ${fuelMatch[1].trim()}`
  }

  // Only add PT notes if it's a rest day or no workout was found
  // During foundation phase, PT exercises are done daily, but workout_notes should only contain PT on rest days
  // On workout days, PT is separate and shouldn't be in workout_notes
  if (isFoundationPhase && workout.workout_type === 'rest') {
    workout.workout_notes = formatPTFoundationNotes()
  }

  return workout
}

// SQL generation helpers
function escapeSQLString(str: string | null | undefined): string {
  if (!str) return 'NULL'
  return `'${str.replace(/'/g, "''")}'`
}

function escapeSQLJSON(obj: any): string {
  if (!obj) return 'NULL'
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`
}

async function seedDatabase() {
  console.log('Starting database seed...')
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - Generating SQL for review\n')
  }

  // Read the master plan file
  const possiblePaths = [
    path.join(__dirname, '../../protocol-local/cursor docs/MASTER_PLAN_27WEEKS_COMPLETE.md'),
    path.join(__dirname, '../../../protocol-local/cursor docs/MASTER_PLAN_27WEEKS_COMPLETE.md'),
    '/Users/jonschafer/Dropbox/ jon/work/WHT_Resources/protocol-local/cursor docs/MASTER_PLAN_27WEEKS_COMPLETE.md',
    process.env.MASTER_PLAN_PATH
  ].filter(Boolean) as string[]
  
  let masterPlanPath: string | null = null
  for (const testPath of possiblePaths) {
    if (testPath && fs.existsSync(testPath)) {
      masterPlanPath = testPath
      break
    }
  }
  
  if (!masterPlanPath) {
    throw new Error(`Master plan file not found. Tried: ${possiblePaths.join(', ')}`)
  }
  
  console.log(`Using master plan file: ${masterPlanPath}`)

  const masterPlanContent = fs.readFileSync(masterPlanPath, 'utf-8')
  const sqlStatements: string[] = []

  // 1. Create training plan
  console.log('Creating training plan...')
  const planData = {
    plan_name: "Wy'East Trailfest 50M Training Plan",
    goal_race: "Wy'East Trailfest 50M - August 15, 2026",
    goal_distance: '50.1 miles',
    goal_elevation: "10,650' gain / 8,800' loss",
    start_date: '2026-02-02',
    end_date: '2026-08-15',
    total_weeks: 27,
    current_week: 1,
    is_active: true
  }

  let plan: any = null
  if (dryRun) {
    sqlStatements.push(`-- Training Plan
INSERT INTO training_plans (plan_name, goal_race, goal_distance, goal_elevation, start_date, end_date, total_weeks, current_week, is_active)
VALUES (${escapeSQLString(planData.plan_name)}, ${escapeSQLString(planData.goal_race)}, ${escapeSQLString(planData.goal_distance)}, ${escapeSQLString(planData.goal_elevation)}, '${planData.start_date}', '${planData.end_date}', ${planData.total_weeks}, ${planData.current_week}, ${planData.is_active})
ON CONFLICT DO NOTHING;`)
  } else {
    const { data: insertedPlan, error: planError } = await supabase
      .from('training_plans')
      .insert(planData)
      .select()
      .single()

    if (planError) {
      if (planError.code === '23505') {
        const { data: existingPlan } = await supabase
          .from('training_plans')
          .select()
          .eq('plan_name', planData.plan_name)
          .single()
        
        if (existingPlan) {
          console.log('Training plan already exists, using existing plan')
          plan = existingPlan
        } else {
          throw planError
        }
      } else {
        throw planError
      }
    } else {
      plan = insertedPlan
    }
  }

  const v_plan_id = dryRun ? 'PLAN_ID_PLACEHOLDER' : plan?.id
  if (dryRun) {
    sqlStatements.push(`\n-- Set v_plan_id variable (replace with actual UUID from above)
-- v_plan_id := (SELECT id FROM training_plans WHERE plan_name = ${escapeSQLString(planData.plan_name)} LIMIT 1);\n`)
  }
  console.log(`Training plan: ${dryRun ? 'SQL generated' : v_plan_id}`)

  // 2. Create training phases
  console.log('Creating training phases...')
  const phases = [
    {
      plan_id: v_plan_id,
      name: 'Foundation',
      week_start: 1,
      week_end: 9,
      start_date: '2026-02-02',
      end_date: '2026-04-05',
      focus: 'Build 12mpw → 20mpw, daily PT exercises'
    },
    {
      plan_id: v_plan_id,
      name: 'Durability',
      week_start: 10,
      week_end: 20,
      start_date: '2026-04-06',
      end_date: '2026-06-21',
      focus: 'Build to 40mpw, progressive vert 6k-9k'
    },
    {
      plan_id: v_plan_id,
      name: 'Specificity',
      week_start: 21,
      week_end: 27,
      start_date: '2026-06-22',
      end_date: '2026-08-09',
      focus: 'Race-specific work, taper'
    }
  ]

  const phaseMap: Record<number, string> = {}
  for (const phase of phases) {
    if (dryRun) {
      const v_phase_id = `PHASE_${phase.name.toUpperCase()}_ID`
      phaseMap[phase.week_start] = v_phase_id
      sqlStatements.push(`-- Phase: ${phase.name}
INSERT INTO training_phases (plan_id, name, week_start, week_end, start_date, end_date, focus)
VALUES (v_plan_id, ${escapeSQLString(phase.name)}, ${phase.week_start}, ${phase.week_end}, '${phase.start_date}', '${phase.end_date}', ${escapeSQLString(phase.focus)})
ON CONFLICT DO NOTHING;`)
    } else {
      const { data: phaseData, error: phaseError } = await supabase
        .from('training_phases')
        .insert(phase)
        .select()
        .single()

      if (phaseError) {
        if (phaseError.code === '23505') {
          const { data: existingPhase } = await supabase
            .from('training_phases')
            .select()
            .eq('plan_id', v_plan_id)
            .eq('name', phase.name)
            .single()
          
          if (existingPhase) {
            phaseMap[phase.week_start] = existingPhase.id
            continue
          }
        }
        throw phaseError
      }

      phaseMap[phase.week_start] = phaseData.id
      console.log(`Phase created: ${phase.name} (${phaseData.id})`)
    }
  }

  // 3. Parse and create weekly plans and daily workouts
  console.log('Parsing weekly plans and daily workouts...')
  
  // Split content by week headers and extract week numbers
  const weekMatches = [...masterPlanContent.matchAll(/##\s*Week\s*(\d+):/gi)]
  const weekSections: Array<{ weekNumber: number; content: string }> = []
  
  for (let i = 0; i < weekMatches.length; i++) {
    const weekNumber = parseInt(weekMatches[i][1])
    const startIndex = weekMatches[i].index! + weekMatches[i][0].length
    const endIndex = i < weekMatches.length - 1 ? weekMatches[i + 1].index! : masterPlanContent.length
    const content = masterPlanContent.substring(startIndex, endIndex)
    weekSections.push({ weekNumber, content })
  }
  
  // Sort by week number to ensure correct order
  weekSections.sort((a, b) => a.weekNumber - b.weekNumber)
  
  // Track processed weeks to avoid duplicates
  const processedWeeks = new Set<number>()
  
  for (const { weekNumber, content: weekContent } of weekSections) {
    // Skip if already processed
    if (processedWeeks.has(weekNumber)) {
      console.log(`Skipping duplicate week ${weekNumber}...`)
      continue
    }
    processedWeeks.add(weekNumber)
    
    // Extract week metadata
    const volumeMatch = weekContent.match(/\*\*Volume\*\*[:\s]*(\d+)\s*miles?[,\s]+(\d+(?:,\d+)?)\s*ft\s*vert/i)
    const focusMatch = weekContent.match(/\*\*Focus\*\*[:\s]*([^\n]+)/i)
    const themeMatch = weekContent.match(/\*\*Key Theme\*\*[:\s]*([^\n]+)/i)
    const blockMatch = weekContent.match(/\*\*Block\s*\d+\s*-\s*([^\n]+)/i)
    
    const targetMiles = volumeMatch ? parseFloat(volumeMatch[1]) : null
    const targetVert = volumeMatch ? parseInt(volumeMatch[2].replace(/,/g, '')) : null
    const weekTheme = focusMatch?.[1]?.trim() || themeMatch?.[1]?.trim() || blockMatch?.[1]?.trim() || ''
    
    // Calculate week dates
    const weekStartDate = getWeekStartDate(weekNumber)
    const weekEndDate = new Date(weekStartDate)
    weekEndDate.setDate(weekEndDate.getDate() + 6)
    
    // Determine phase
    let v_phase_id: string | null = null
    let phaseName: string = ''
    if (weekNumber >= 1 && weekNumber <= 9) {
      v_phase_id = phaseMap[1]
      phaseName = 'Foundation'
    } else if (weekNumber >= 10 && weekNumber <= 20) {
      v_phase_id = phaseMap[10]
      phaseName = 'Durability'
    } else if (weekNumber >= 21 && weekNumber <= 27) {
      v_phase_id = phaseMap[21]
      phaseName = 'Specificity'
    }
    
    // Create weekly plan
    console.log(`Creating week ${weekNumber}...`)
    
    const weeklyPlanData = {
      plan_id: v_plan_id,
      phase_id: v_phase_id,
      week_number: weekNumber,
      week_start_date: weekStartDate.toISOString().split('T')[0],
      week_end_date: weekEndDate.toISOString().split('T')[0],
      week_theme: weekTheme,
      target_miles: targetMiles,
      target_vert: targetVert,
      notes: weekTheme
    }

    let weeklyPlan: any = null
    if (dryRun) {
      const phaseVarName = phaseName === 'Foundation' ? 'v_phase_foundation_id' : phaseName === 'Durability' ? 'v_phase_durability_id' : 'v_phase_specificity_id'
      sqlStatements.push(`\n-- Week ${weekNumber}: ${weekTheme || 'No theme'}
INSERT INTO weekly_plans (plan_id, phase_id, week_number, week_start_date, week_end_date, week_theme, target_miles, target_vert, notes)
VALUES (
  v_plan_id,
  ${phaseVarName},
  ${weekNumber},
  '${weeklyPlanData.week_start_date}',
  '${weeklyPlanData.week_end_date}',
  ${escapeSQLString(weekTheme)},
  ${targetMiles || 'NULL'},
  ${targetVert || 'NULL'},
  ${escapeSQLString(weekTheme)}
)
ON CONFLICT (plan_id, week_number) DO UPDATE SET
  phase_id = EXCLUDED.phase_id,
  week_start_date = EXCLUDED.week_start_date,
  week_end_date = EXCLUDED.week_end_date,
  week_theme = EXCLUDED.week_theme,
  target_miles = EXCLUDED.target_miles,
  target_vert = EXCLUDED.target_vert,
  notes = EXCLUDED.notes;

-- Store weekly plan ID for this week
SELECT id INTO v_weekly_plan_id FROM weekly_plans WHERE weekly_plans.plan_id = v_plan_id AND weekly_plans.week_number = ${weekNumber} LIMIT 1;`)
    } else {
      const { data: insertedWeeklyPlan, error: weekError } = await supabase
        .from('weekly_plans')
        .insert(weeklyPlanData)
        .select()
        .single()

      if (weekError) {
        if (weekError.code === '23505') {
          // Week exists, delete and re-insert
          const { data: existingWeek } = await supabase
            .from('weekly_plans')
            .select()
            .eq('plan_id', v_plan_id)
            .eq('week_number', weekNumber)
            .single()
          
          if (existingWeek) {
            // Delete existing daily workouts
            await supabase
              .from('daily_workouts')
              .delete()
              .eq('weekly_plan_id', existingWeek.id)
            
            // Update the week
            await supabase
              .from('weekly_plans')
              .update(weeklyPlanData)
              .eq('id', existingWeek.id)
            
            weeklyPlan = existingWeek
          } else {
            throw weekError
          }
        } else {
          throw weekError
        }
      } else {
        weeklyPlan = insertedWeeklyPlan
      }
    }

    const v_weekly_plan_id = dryRun ? `WEEK_${weekNumber}_ID` : weeklyPlan?.id

    // Parse daily workouts
    const daySections = weekContent.split(/###\s*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i)
    
    for (let j = 1; j < daySections.length; j++) {
      const dayNameMatch = daySections[j].match(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i)
      if (!dayNameMatch) continue
      
      const dayName = dayNameMatch[1]
      const dayContent = daySections[j]
      
      // Find date in content or calculate from week start
      const dateMatch = dayContent.match(/(\w+day),\s*(\w+)\s+(\d+)/i)
      let workoutDate: Date
      
      if (dateMatch) {
        const months: Record<string, number> = {
          'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
          'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
        }
        const monthName = dateMatch[2].toLowerCase()
        const day = parseInt(dateMatch[3])
        const month = months[monthName] ?? 0
        workoutDate = new Date(2026, month, day)
      } else {
        // Calculate date from week start and day of week
        const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(dayName)
        workoutDate = new Date(weekStartDate)
        workoutDate.setDate(workoutDate.getDate() + (dayIndex - weekStartDate.getDay() + 7) % 7)
      }
      
      const workout = parseWorkout(dayContent, workoutDate, weekNumber)
      workout.weekly_plan_id = v_weekly_plan_id
      
      if (dryRun) {
        sqlStatements.push(`-- ${dayName}, ${workoutDate.toISOString().split('T')[0]}
INSERT INTO daily_workouts (
  weekly_plan_id, workout_date, day_of_week, workout_type,
  run_distance_miles, run_vert_feet, run_effort, run_notes,
  strength_session_type, strength_exercises,
  rowing_duration_minutes, rowing_effort,
  workout_notes
)
VALUES (
  v_weekly_plan_id,
  '${workout.workout_date}',
  ${escapeSQLString(workout.day_of_week)},
  ${escapeSQLString(workout.workout_type)},
  ${workout.run_distance_miles || 'NULL'},
  ${workout.run_vert_feet || 'NULL'},
  ${escapeSQLString(workout.run_effort || null)},
  ${escapeSQLString(workout.run_notes || null)},
  ${escapeSQLString(workout.strength_session_type || null)},
  ${escapeSQLJSON(workout.strength_exercises)},
  ${workout.rowing_duration_minutes || 'NULL'},
  ${escapeSQLString(workout.rowing_effort || null)},
  ${escapeSQLString(workout.workout_notes || null)}
)
ON CONFLICT (weekly_plan_id, workout_date) DO UPDATE SET
  day_of_week = EXCLUDED.day_of_week,
  workout_type = EXCLUDED.workout_type,
  run_distance_miles = EXCLUDED.run_distance_miles,
  run_vert_feet = EXCLUDED.run_vert_feet,
  run_effort = EXCLUDED.run_effort,
  run_notes = EXCLUDED.run_notes,
  strength_session_type = EXCLUDED.strength_session_type,
  strength_exercises = EXCLUDED.strength_exercises,
  rowing_duration_minutes = EXCLUDED.rowing_duration_minutes,
  rowing_effort = EXCLUDED.rowing_effort,
  workout_notes = EXCLUDED.workout_notes;`)
      } else {
        const { error: workoutError } = await supabase
          .from('daily_workouts')
          .insert(workout)

        if (workoutError) {
          console.error(`Error inserting workout for ${workout.workout_date}:`, workoutError)
        }
      }
    }
    
    console.log(`Week ${weekNumber} completed`)
  }

  if (dryRun) {
    const sql = `-- Generated SQL for 27-Week Training Plan Seed
-- Review this SQL before executing
-- Generated: ${new Date().toISOString()}

-- Step 1: Get or create v_plan_id
DO $$
DECLARE
  v_plan_id UUID;
  v_phase_foundation_id UUID;
  v_phase_durability_id UUID;
  v_phase_specificity_id UUID;
  v_weekly_plan_id UUID;
BEGIN
  -- Get or create training plan
  INSERT INTO training_plans (plan_name, goal_race, goal_distance, goal_elevation, start_date, end_date, total_weeks, current_week, is_active)
  VALUES (${escapeSQLString(planData.plan_name)}, ${escapeSQLString(planData.goal_race)}, ${escapeSQLString(planData.goal_distance)}, ${escapeSQLString(planData.goal_elevation)}, '${planData.start_date}', '${planData.end_date}', ${planData.total_weeks}, ${planData.current_week}, ${planData.is_active})
  ON CONFLICT DO NOTHING;
  
  SELECT id INTO v_plan_id FROM training_plans WHERE plan_name = ${escapeSQLString(planData.plan_name)} LIMIT 1;
  
  -- Get or create phases
  INSERT INTO training_phases (plan_id, name, week_start, week_end, start_date, end_date, focus)
  VALUES 
    (v_plan_id, 'Foundation', 1, 9, '2026-02-02', '2026-04-05', 'Build 12mpw → 20mpw, daily PT exercises'),
    (v_plan_id, 'Durability', 10, 20, '2026-04-06', '2026-06-21', 'Build to 40mpw, progressive vert 6k-9k'),
    (v_plan_id, 'Specificity', 21, 27, '2026-06-22', '2026-08-09', 'Race-specific work, taper')
  ON CONFLICT DO NOTHING;
  
  SELECT id INTO v_phase_foundation_id FROM training_phases WHERE training_phases.plan_id = v_plan_id AND training_phases.name = 'Foundation' LIMIT 1;
  SELECT id INTO v_phase_durability_id FROM training_phases WHERE training_phases.plan_id = v_plan_id AND training_phases.name = 'Durability' LIMIT 1;
  SELECT id INTO v_phase_specificity_id FROM training_phases WHERE training_phases.plan_id = v_plan_id AND training_phases.name = 'Specificity' LIMIT 1;
  
  -- Now insert weeks and workouts
${sqlStatements.slice(2).join('\n')
  .replace(/PHASE_FOUNDATION_ID/g, 'v_phase_foundation_id')
  .replace(/PHASE_DURABILITY_ID/g, 'v_phase_durability_id')
  .replace(/PHASE_SPECIFICITY_ID/g, 'v_phase_specificity_id')
  .replace(/v_weekly_plan_id/g, 'v_weekly_plan_id')}
END $$;`

    if (outputSqlFile) {
      fs.writeFileSync(outputSqlFile, sql)
      console.log(`\n✅ SQL written to: ${outputSqlFile}`)
      console.log(`\n📋 Review the SQL file, then execute it in Supabase SQL Editor`)
    } else {
      console.log('\n' + '='.repeat(80))
      console.log('GENERATED SQL (Review before executing):')
      console.log('='.repeat(80))
      console.log(sql)
      console.log('='.repeat(80))
      console.log('\n💡 Tip: Use --output=filename.sql to save to file')
    }
  } else {
    console.log('Database seed completed successfully!')
  }
}

// Run the seed
seedDatabase().catch(console.error)
