import { DayView } from '../../exercises/dayView'
import { BottomNav } from '../../components/BottomNav'
import { fetchDayByWeekAndDay } from '../../../lib/supabase-data'
import { parsePTFoundationExercises, capitalizeExerciseName } from '../../../lib/pt-foundation-parser'

function transformWorkoutToDayData(workout: any, weekNumber: number) {
  // Determine category/phase
  let category = 'Foundation'
  let phase: 'foundation' | 'durability' | 'specificity' = 'foundation'
  if (weekNumber >= 10 && weekNumber <= 20) {
    category = 'Durability'
    phase = 'durability'
  } else if (weekNumber >= 21 && weekNumber <= 27) {
    category = 'Specificity'
    phase = 'specificity'
  }

  // Format date - parse as local date to avoid timezone issues
  const [year, month, day] = workout.date.split('-').map(Number)
  const date = new Date(year, month - 1, day) // month is 0-indexed
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

  // Build run data
  const runData: any = {}
  if (workout.workout_type === 'run' || workout.workout_type === 'run+strength') {
    if (workout.run_distance_miles) {
      runData.miles = workout.run_distance_miles
    }
    if (workout.run_vert_feet) {
      runData.vert = workout.run_vert_feet
    }
    if (workout.run_effort) {
      runData.rpe = workout.run_effort
      if (workout.run_effort.includes('Z2')) {
        runData.zone = '2'
      } else if (workout.run_effort.includes('Z3')) {
        runData.zone = '3'
      }
    }
    if (workout.run_notes) {
      const routeMatch = workout.run_notes.match(/Route:\s*([^\n]+)/i)
      if (routeMatch) {
        runData.route = routeMatch[1].trim()
      }
    }
    if (workout.workout_name) {
      runData.helper = workout.workout_name
    }
  } else if (workout.workout_type === 'rowing') {
    runData.variant = 'row'
    runData.miles = 'Row'
    if (workout.rowing_duration_minutes) {
      runData.pace = `${workout.rowing_duration_minutes}min`
    }
  }

  // Build exercises from strength data
  // Circuits are now stored as individual exercises in the database, so we can treat all the same
  const exercises: any[] = []
  if (workout.strength_exercises && Array.isArray(workout.strength_exercises)) {
    workout.strength_exercises.forEach((ex: any, idx: number) => {
      // Truncate RPE to just percentage if present
      let weight = ex.notes || ''
      if (weight) {
        // Extract all percentages and take the last one (usually the target RPE)
        const rpeMatches = weight.match(/(\d+%)/gi)
        if (rpeMatches && rpeMatches.length > 0) {
          weight = rpeMatches[rpeMatches.length - 1] // Take the last percentage
        }
      }
      
      // Ensure reps is a number or 0, not "Full circuit" or empty
      let reps = ex.reps || '0'
      if (reps && (reps.toLowerCase().includes('full circuit') || reps.toLowerCase().includes('circuit'))) {
        reps = '0'
      }
      
      exercises.push({
        id: `${ex.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${idx}`,
        exerciseName: capitalizeExerciseName(ex.name),
        sets: ex.sets,
        reps: reps,
        weight: weight,
        exerciseNote: ex.notes || '',
        restNote: '2-3 minutes rest between sets',
        cues: ''
      })
    })
  }

  // Parse PT Foundation exercises if present
  if (workout.workout_notes?.includes('PT FOUNDATION')) {
    const ptExercises = parsePTFoundationExercises(workout.workout_notes)
    exercises.push(...ptExercises)
  }

  return {
    date: dateStr,
    dayNumber: weekNumber,
    category,
    phase,
    runData: Object.keys(runData).length > 0 ? runData : undefined,
    exercises
  }
}

export default async function DayPage({ 
  params,
  searchParams 
}: { 
  params: { dayName: string }
  searchParams: { week?: string }
}) {
  const dayName = params?.dayName
  const weekNumber = parseInt(searchParams?.week || '1')
  
  let dayInfo: any = {
    date: dayName,
    dayNumber: weekNumber,
    category: 'Foundation',
    phase: 'foundation' as const,
    exercises: []
  }

  let workoutId: string | undefined

  try {
    const workout = await fetchDayByWeekAndDay(weekNumber, dayName)
    workoutId = workout.id
    dayInfo = transformWorkoutToDayData(workout, weekNumber)
  } catch (error) {
    console.error('Error fetching day data:', error)
  }

  return (
    <div 
      style={{ 
        background: '#000000', 
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        paddingBottom: '100px' // Extra padding for bottom nav
      }}
    >
      <DayView 
        date={dayInfo.date}
        dayNumber={dayInfo.dayNumber}
        category={dayInfo.category}
        phase={dayInfo.phase}
        runData={dayInfo.runData}
        exercises={dayInfo.exercises}
        weekNumber={weekNumber}
        workoutId={workoutId}
        noTopMargin={true}
      />
      <BottomNav />
    </div>
  )
}
