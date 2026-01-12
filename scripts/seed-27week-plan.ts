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

// PT Foundation exercises (from lines 92-171 of MASTER_PLAN_27WEEKS.md)
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

// Helper to parse date from "Monday, February 2" format
function parseDate(dateStr: string, year: number = 2026): Date {
  const months: Record<string, number> = {
    'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
    'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
  }
  
  const parts = dateStr.toLowerCase().split(',')
  if (parts.length < 2) return new Date()
  
  // Format is "Monday, February 2" - month and day are in parts[1]
  const monthDayPart = parts[1].trim()
  const monthMatch = monthDayPart.match(/(\w+)\s+(\d+)/)
  if (!monthMatch) return new Date()
  
  const monthName = monthMatch[1].trim()
  const day = parseInt(monthMatch[2])
  const month = months[monthName] ?? 0
  
  return new Date(year, month, day)
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
    date: date.toISOString().split('T')[0],
    day_of_week: getDayOfWeek(date),
    workout_type: 'rest',
    workout_notes: '',
    strength_exercises: null,
    strength_session_type: null
  }

  const isFoundationPhase = weekNumber >= 1 && weekNumber <= 9
  if (isFoundationPhase) {
    workout.workout_notes = formatPTFoundationNotes()
  }

  // Check for rest day
  if (dayContent.includes('**Rest Day**') || dayContent.includes('- **Rest Day**')) {
    workout.workout_type = 'rest'
    return workout
  }

  // Parse run data - use flexible patterns that match the markdown format
  const runPatterns = [
    { name: 'Group Run', pattern: /Group\s+Run.*?(\d+(?:\.\d+)?).*?miles/i },
    { name: 'Long Run', pattern: /Long\s+Run.*?(\d+(?:\.\d+)?).*?miles/i },
    { name: 'Easy Run', pattern: /Easy\s+Run.*?(\d+(?:\.\d+)?).*?miles/i },
    { name: 'Easy Hills', pattern: /Easy\s+Hills?.*?(\d+(?:\.\d+)?).*?miles/i },
    { name: 'Hill Workout', pattern: /Hill\s+Workout.*?(\d+(?:\.\d+)?).*?miles/i },
    { name: 'Tempo Workout', pattern: /Tempo\s+Workout.*?(\d+(?:\.\d+)?).*?miles/i },
    { name: 'VO2 Max Workout', pattern: /VO2\s+Max\s+Workout.*?(\d+(?:\.\d+)?).*?miles/i },
    { name: 'Any Run', pattern: /Run.*?(\d+(?:\.\d+)?).*?miles/i },
  ]
  
  let runMatch: RegExpMatchArray | null = null
  for (const { pattern } of runPatterns) {
    runMatch = dayContent.match(pattern)
    if (runMatch) break
  }
  
  if (runMatch) {
    const miles = parseFloat(runMatch[1])
    workout.run_distance_miles = miles
    workout.workout_type = 'run'
    
    // Parse vert - flexible pattern
    const vertMatch = dayContent.match(/(\d+(?:,\d+)?)\s*ft\s*vert/i)
    if (vertMatch) {
      workout.run_vert_feet = parseInt(vertMatch[1].replace(/,/g, ''))
    }
    
    // Parse effort
    const effortMatch = dayContent.match(/Effort[:\s]*([^\n]+)/i)
    if (effortMatch) {
      workout.run_effort = effortMatch[1].trim()
    }
    
    // Parse route
    const routeMatch = dayContent.match(/Route[:\s]*([^\n]+)/i)
    if (routeMatch) {
      workout.run_notes = (workout.run_notes || '') + `Route: ${routeMatch[1].trim()}\n`
    }
  }

  // Parse rowing - flexible pattern
  const rowMatch = dayContent.match(/Row.*?(\d+).*?min/i) || dayContent.match(/(\d+)\s*min.*?row/i)
  if (rowMatch) {
    workout.rowing_duration_minutes = parseInt(rowMatch[1])
    workout.workout_type = workout.workout_type === 'run' ? 'run+strength' : 'rowing'
    
    const rowEffortMatch = dayContent.match(/row[,\s]+(Z\d+|RPE\s*\d+)/i)
    if (rowEffortMatch) {
      workout.rowing_effort = rowEffortMatch[1].trim()
    }
  }

  // Parse strength exercises - flexible pattern
  const strengthMatch = dayContent.match(/Strength\s*-\s*(Heavy\s*Day\s*\d+|PT\s*Foundation)/i)
  if (strengthMatch) {
    workout.strength_session_type = strengthMatch[1].trim()
    
    if (workout.workout_type === 'run') {
      workout.workout_type = 'run+strength'
    } else if (workout.workout_type === 'rest') {
      workout.workout_type = 'strength'
    }
    
    // Extract strength exercises - improved parsing using simpler string methods
    const exercises: any[] = []
    
    // Find the strength section - look for "Strength" keyword, then find content until next "**"
    const strengthIndex = dayContent.indexOf('Strength')
    if (strengthIndex !== -1) {
      const afterStrength = dayContent.substring(strengthIndex)
      const colonIndex = afterStrength.indexOf(':')
      if (colonIndex !== -1) {
        const afterColon = afterStrength.substring(colonIndex + 1)
        const newlineIndex = afterColon.indexOf('\n')
        if (newlineIndex !== -1) {
          const afterHeader = afterColon.substring(newlineIndex + 1)
          // Find next ** to mark end of strength section
          const nextBold = afterHeader.indexOf('**')
          const strengthSection = nextBold !== -1 ? afterHeader.substring(0, nextBold) : afterHeader
          
          // Find all exercise lines (lines starting with '  - ' or ' - ')
          const exerciseLines = strengthSection.match(/^\s*-\s*([^\n]+)/gm) || []
          
          exerciseLines.forEach(line => {
            // Check for Circuit exercise pattern first: "Circuit 3x: exercises (notes)"
            const circuitMatch = line.match(/^\s*-\s*Circuit\s+(\d+)x:\s*(.+?)(?:\s*\(([^)]+)\))?$/i)
            if (circuitMatch) {
              const sets = parseInt(circuitMatch[1])
              const exerciseList = circuitMatch[2].trim()
              const circuitNotes = circuitMatch[3]?.trim() || ''
              
              // Split exercises by comma
              const exerciseItems = exerciseList.split(',').map(e => e.trim())
              
              // Parse each exercise in the circuit
              exerciseItems.forEach(exItem => {
                // Try to extract reps and exercise name
                // Pattern: "4 slow push-ups" or "6 bird dog rows each" or "30sec farmer carry" or "Push-ups"
                // Handle adjectives like "slow" between number and exercise name
                const repMatch = exItem.match(/^(\d+|\d+sec|\d+min)\s+([a-z\s-]+?)(?:\s+each)?$/i)
                
                let exerciseName: string
                let reps: string
                let weight: string = ''
                
                if (repMatch) {
                  // Has reps specified
                  reps = repMatch[1]
                  exerciseName = repMatch[2].trim()
                } else {
                  // No reps specified - use default
                  exerciseName = exItem
                  reps = '0' // Default to 0 if no reps specified
                }
                
                // Determine weight - only apply to exercises that typically need weight
                // Check exercise name for weight-related keywords
                const exerciseNameLower = exerciseName.toLowerCase()
                const needsWeight = exerciseNameLower.includes('farmer') ||
                                   exerciseNameLower.includes('carry') ||
                                   exerciseNameLower.includes('kb') ||
                                   exerciseNameLower.includes('kettlebell') ||
                                   exerciseNameLower.includes('weighted') ||
                                   exerciseNameLower.includes('deadlift') ||
                                   exerciseNameLower.includes('squat') ||
                                   exerciseNameLower.includes('press') && (exerciseNameLower.includes('clean') || exerciseNameLower.includes('power'))
                
                if (needsWeight && circuitNotes) {
                  // Extract weight from notes (e.g., "66lb each" -> "66")
                  const weightMatch = circuitNotes.match(/(\d+)\s*(?:lb|kg)/i)
                  if (weightMatch) {
                    weight = weightMatch[1]
                  }
                }
                
                exercises.push({
                  name: exerciseName,
                  sets,
                  reps: reps,
                  notes: weight
                })
              })
            } else {
              // Handle Warm-up/Main sections - extract exercise from after the colon
              const sectionMatch = line.match(/^\s*-\s*(Warm-up|Main):\s*(.+)$/i)
              if (sectionMatch) {
                const sectionType = sectionMatch[1].toLowerCase()
                const exercisePart = sectionMatch[2].trim()
                
                // Skip warm-up sections - they're not logged as exercises
                if (sectionType === 'warm-up') {
                  return
                }
                
                // Parse "Main:" exercises
                if (sectionType === 'main') {
                  // Try to parse as regular exercise pattern
                  // Example: "Trap bar deadlift 5x4 (60%, 85% RPE)"
                  const match = exercisePart.match(/^([^0-9(]+?)\s+(\d+)x(\d+|\d+sec|\d+min)(?:\s+each)?(?:\s*\(([^)]+)\))?/i)
                  if (match) {
                    const exerciseName = match[1].trim()
                    const sets = parseInt(match[2])
                    const reps = match[3]
                    const notes = match[4]?.trim() || ''
                    
                    exercises.push({
                      name: exerciseName,
                      sets,
                      reps,
                      notes
                    })
                  } else {
                    // Try flexible match for edge cases
                    const flexMatch = exercisePart.match(/(.+?)\s+(\d+)x(\d+|\d+sec|\d+min)(?:\s*\(([^)]+)\))?/i)
                    if (flexMatch) {
                      exercises.push({
                        name: flexMatch[1].trim(),
                        sets: parseInt(flexMatch[2]),
                        reps: flexMatch[3],
                        notes: flexMatch[4]?.trim() || ''
                      })
                    }
                  }
                }
              } else {
                // Regular exercise pattern: "Exercise name 3x6 (notes)" or "Exercise name 3x25sec (notes)"
                const match = line.match(/^\s*-\s*([^0-9(]+?)\s+(\d+)x(\d+|\d+sec|\d+min)(?:\s+each)?(?:\s*\(([^)]+)\))?/i)
                if (match) {
                  const exerciseName = match[1].trim()
                  // Skip if it's a section header (ends with colon)
                  if (exerciseName.endsWith(':')) {
                    return
                  }
                  
                  const sets = parseInt(match[2])
                  const reps = match[3]
                  const notes = match[4]?.trim() || ''
                  
                  exercises.push({
                    name: exerciseName,
                    sets,
                    reps,
                    notes
                  })
                }
              }
            }
          })
        }
      }
    }
    
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
  const fuelMatch = dayContent.match(/\*\*Fuel\*\*[:\s]*([^\n]+)/i)
  if (fuelMatch) {
    workout.run_notes = (workout.run_notes || '') + `\nFuel: ${fuelMatch[1].trim()}`
  }

  return workout
}

async function checkSchema() {
  // Check for all required columns in weekly_plans
  const requiredColumns = ['phase_id', 'start_date', 'end_date', 'week_number', 'plan_id']
  const missingColumns: string[] = []
  
  for (const column of requiredColumns) {
    const { error } = await supabase
      .from('weekly_plans')
      .select(column)
      .limit(0)
    
    if (error) {
      const errorMsg = error.message.toLowerCase()
      if (errorMsg.includes(column) || errorMsg.includes('column')) {
        missingColumns.push(column)
      }
    }
  }
  
  if (missingColumns.length > 0) {
    throw new Error(
      `Missing columns in weekly_plans table: ${missingColumns.join(', ')}\n\n` +
      'Please run the following SQL in your Supabase SQL editor:\n' +
      '1. Run: supabase/migrations/001_create_training_plan_tables.sql (if tables don\'t exist)\n' +
      '2. Run: supabase/migrations/003_fix_phase_id_column.sql\n' +
      '3. Run: supabase/migrations/004_fix_weekly_plans_columns.sql\n' +
      '4. Run: supabase/migrations/005_fix_phase_column.sql\n\n' +
      'Or manually run:\n' +
      missingColumns.map(col => {
        if (col === 'phase_id') {
          return 'ALTER TABLE weekly_plans ADD COLUMN IF NOT EXISTS phase_id UUID REFERENCES training_phases(id) ON DELETE CASCADE;'
        } else if (col === 'plan_id') {
          return 'ALTER TABLE weekly_plans ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES training_plans(id) ON DELETE CASCADE;'
        } else if (col === 'start_date' || col === 'end_date') {
          return `ALTER TABLE weekly_plans ADD COLUMN IF NOT EXISTS ${col} DATE NOT NULL DEFAULT CURRENT_DATE;`
        } else if (col === 'week_number') {
          return 'ALTER TABLE weekly_plans ADD COLUMN IF NOT EXISTS week_number INTEGER NOT NULL DEFAULT 1;'
        }
        return `ALTER TABLE weekly_plans ADD COLUMN IF NOT EXISTS ${col} TEXT;`
      }).join('\n')
    )
  }
}

async function seedDatabase() {
  console.log('Starting database seed...')

  // Check schema before proceeding
  try {
    await checkSchema()
  } catch (error: any) {
    console.error('\n❌ Schema check failed:')
    console.error(error.message)
    console.error('\nPlease run the following migrations in your Supabase SQL editor:')
    console.error('1. supabase/migrations/001_create_training_plan_tables.sql')
    console.error('2. supabase/migrations/003_fix_phase_id_column.sql')
    process.exit(1)
  }

  // Read the master plan file - try multiple possible locations
  const possiblePaths = [
    '/Users/jonschafer/Dropbox/ jon/work/WHT_Resources/protocol/MASTER_PLAN_27WEEKS_COMPLETE.md',
    path.join(__dirname, '../MASTER_PLAN_27WEEKS_COMPLETE.md'),
    path.join(__dirname, '../../MASTER_PLAN_27WEEKS_COMPLETE.md'),
    path.join(__dirname, '../../protocol-local/cursor docs/MASTER_PLAN_27WEEKS.md'),
    path.join(__dirname, '../../../protocol-local/cursor docs/MASTER_PLAN_27WEEKS.md'),
    '/Users/jonschafer/Dropbox/ jon/work/WHT_Resources/protocol-local/cursor docs/MASTER_PLAN_27WEEKS.md',
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

  // 1. Create training plan
  console.log('Creating training plan...')
  const { data: insertedPlan, error: planError } = await supabase
    .from('training_plans')
    .insert({
      plan_name: "Wy'East Trailfest 50M Training Plan",
      goal_race: "Wy'East Trailfest 50M - August 15, 2026",
      goal_distance: '50.1 miles',
      goal_elevation: "10,650' gain / 8,800' loss",
      start_date: '2026-02-02',
      end_date: '2026-08-15',
      total_weeks: 27,
      current_week: 1,
      is_active: true
    })
    .select()
    .single()

  let plan: any = null
  if (planError) {
    if (planError.code === '23505') {
      // Plan already exists, fetch it
      const { data: existingPlan } = await supabase
        .from('training_plans')
        .select()
        .eq('plan_name', "Wy'East Trailfest 50M Training Plan")
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

  const planId = plan?.id
  console.log(`Training plan created: ${planId}`)

  // 2. Create training phases
  console.log('Creating training phases...')
  const phases = [
    {
      plan_id: planId,
      name: 'Foundation',
      week_start: 1,
      week_end: 9,
      start_date: '2026-02-02',
      end_date: '2026-04-05',
      focus: 'Build 12mpw → 20mpw, daily PT exercises'
    },
    {
      plan_id: planId,
      name: 'Durability',
      week_start: 10,
      week_end: 20,
      start_date: '2026-04-06',
      end_date: '2026-06-21',
      focus: 'Build to 40mpw, progressive vert 6k-9k'
    },
    {
      plan_id: planId,
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
    const { data: phaseData, error: phaseError } = await supabase
      .from('training_phases')
      .insert(phase)
      .select()
      .single()

    if (phaseError) {
      if (phaseError.code === '23505') {
        // Phase exists, fetch it
        const { data: existingPhase } = await supabase
          .from('training_phases')
          .select()
          .eq('plan_id', planId)
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

  // 3. Parse and create weekly plans and daily workouts
  console.log('Parsing weekly plans and daily workouts...')
  
  // Split content by week headers
  // When splitting with a capturing group, the array contains:
  // [0] = text before first match
  // [1] = first captured group (week number)
  // [2] = text after first match (week content)
  // [3] = second captured group (week number)
  // [4] = text after second match
  // So we iterate in pairs: odd indices are week numbers, even indices are content
  const weekSections = masterPlanContent.split(/##\s*Week\s*(\d+):/i)
  
  for (let i = 1; i < weekSections.length; i += 2) {
    const weekNumberStr = weekSections[i]
    if (!weekNumberStr) continue
    
    const weekNumber = parseInt(weekNumberStr)
    const weekContent = weekSections[i + 1] || ''
    
    // Extract week metadata
    // Use a more flexible pattern that matches "Volume: X miles, Y ft" or "**Volume:** X miles, Y ft"
    const volumeMatch = weekContent.match(/Volume.*?(\d+).*?miles.*?(\d+(?:,\d+)?).*?ft/i)
    const focusMatch = weekContent.match(/\*\*Focus\*\*[:\s]*([^\n]+)/i)
    const themeMatch = weekContent.match(/\*\*Key Theme\*\*[:\s]*([^\n]+)/i)
    
    const targetMiles = volumeMatch ? parseFloat(volumeMatch[1]) : null
    const targetVert = volumeMatch ? parseInt(volumeMatch[2].replace(/,/g, '')) : null
    const weekTheme = focusMatch?.[1]?.trim() || themeMatch?.[1]?.trim() || ''
    
    // Calculate week dates
    const weekStartDate = getWeekStartDate(weekNumber)
    const weekEndDate = new Date(weekStartDate)
    weekEndDate.setDate(weekEndDate.getDate() + 6)
    
    // Determine phase
    let phaseId: string | null = null
    if (weekNumber >= 1 && weekNumber <= 9) {
      phaseId = phaseMap[1]
    } else if (weekNumber >= 10 && weekNumber <= 20) {
      phaseId = phaseMap[10]
    } else if (weekNumber >= 21 && weekNumber <= 27) {
      phaseId = phaseMap[21]
    }
    
    // Create weekly plan
    console.log(`Creating week ${weekNumber}...`)
    let weeklyPlan: any = null
    const { data: insertedPlan, error: weekError } = await supabase
      .from('weekly_plans')
      .insert({
        plan_id: planId,
        phase_id: phaseId,
        week_number: weekNumber,
        start_date: weekStartDate.toISOString().split('T')[0],
        end_date: weekEndDate.toISOString().split('T')[0],
        week_theme: weekTheme,
        target_miles: targetMiles,
        target_vert: targetVert,
        notes: weekTheme
      })
      .select()
      .single()

    if (weekError) {
      if (weekError.code === '23505') {
        // Week exists, fetch it
        const { data: existingWeek, error: fetchError } = await supabase
          .from('weekly_plans')
          .select()
          .eq('plan_id', planId)
          .eq('week_number', weekNumber)
          .single()
        
        if (fetchError) {
          throw fetchError
        }
        
        if (existingWeek) {
          // Update existing week with new data
          const { data: updatedWeek, error: updateError } = await supabase
            .from('weekly_plans')
            .update({
              phase_id: phaseId,
              start_date: weekStartDate.toISOString().split('T')[0],
              end_date: weekEndDate.toISOString().split('T')[0],
              week_theme: weekTheme,
              target_miles: targetMiles,
              target_vert: targetVert,
              notes: weekTheme
            })
            .eq('id', existingWeek.id)
            .select()
            .single()
          
          if (updateError) {
            throw updateError
          }
          
          // Delete existing daily workouts for this week
          await supabase
            .from('daily_workouts')
            .delete()
            .eq('weekly_plan_id', existingWeek.id)
          
          weeklyPlan = updatedWeek || existingWeek
        } else {
          throw weekError
        }
      } else {
        throw weekError
      }
    } else {
      weeklyPlan = insertedPlan
    }

    if (!weeklyPlan) {
      throw new Error(`Failed to get weekly plan for week ${weekNumber}`)
    }

    const weeklyPlanId = weeklyPlan.id

    // Parse daily workouts
    const daySections = weekContent.split(/###\s*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i)
    let workoutCount = 0
    let errorCount = 0
    
    // Debug: log how many day sections we found
    const numDays = Math.floor((daySections.length - 1) / 2)
    if (weekNumber === 1 && numDays === 0) {
      console.log(`  DEBUG: Week ${weekNumber} - found ${daySections.length} sections, ${numDays} days`)
      console.log(`  First 500 chars of weekContent: ${weekContent.substring(0, 500)}`)
      console.log(`  Looking for pattern: ### Monday|Tuesday|...`)
      const testMatch = weekContent.match(/###\s*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i)
      console.log(`  Test match result:`, testMatch)
    }
    
    // When splitting with a capturing group, the array contains:
    // [0] = text before first match
    // [1] = first captured group (day name)
    // [2] = text after first match (includes date and content)
    // [3] = second captured group (day name)
    // [4] = text after second match
    // So we iterate in pairs: odd indices are day names, even indices are content
    for (let j = 1; j < daySections.length; j += 2) {
      const dayName = daySections[j]
      if (!dayName) continue
      
      const dayContent = daySections[j + 1] || ''
      
      // Skip if no content (shouldn't happen, but be safe)
      if (!dayContent.trim()) {
        console.log(`  Skipping ${dayName} - no content`)
        continue
      }
      
      // Find date in content - the format is ", February 9" (comma, month, day)
      // Try to parse the actual date from the markdown first
      const dateMatch = dayContent.match(/,\s*(\w+)\s+(\d+)/i)
      let workoutDate: Date
      
      if (dateMatch) {
        // Parse date from markdown: ", February 9" -> "Monday, February 9"
        workoutDate = parseDate(`${dayName}, ${dateMatch[1]} ${dateMatch[2]}`)
      } else {
        // Fallback: Calculate date from week start and day of week
        workoutDate = new Date(weekStartDate)
        // Calculate the correct day: find the first occurrence of this day in the week
        const weekStartDay = weekStartDate.getDay() // 0 = Sunday, 1 = Monday, etc.
        const targetDayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(dayName)
        const daysToAdd = (targetDayIndex - weekStartDay + 7) % 7
        workoutDate.setDate(weekStartDate.getDate() + daysToAdd)
      }
      
      const workout = parseWorkout(dayContent, workoutDate, weekNumber)
      workout.weekly_plan_id = weeklyPlanId
      
      // Insert workout
      const { data: insertedWorkout, error: workoutError } = await supabase
        .from('daily_workouts')
        .insert(workout)
        .select()

      if (workoutError) {
        console.error(`Error inserting workout for ${workoutDate.toISOString().split('T')[0]} (${dayName}):`, workoutError)
        console.error('Workout data:', JSON.stringify(workout, null, 2))
        errorCount++
      } else if (insertedWorkout && insertedWorkout.length > 0) {
        workoutCount++
      } else {
        // This shouldn't happen - let's log it to debug
        if (workoutCount === 0 && errorCount === 0) {
          console.log(`  No data returned for ${dayName} (first workout)`)
        }
      }
    }
    
    console.log(`Week ${weekNumber} completed - ${workoutCount} workouts inserted${errorCount > 0 ? `, ${errorCount} errors` : ''}`)
  }

  console.log('Database seed completed successfully!')
}

// Run the seed
seedDatabase().catch(console.error)
