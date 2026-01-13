import { supabase } from './supabase'

export interface WeekData {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  totalMiles: number;
  totalVert: number;
}

export interface PhaseData {
  id: 'foundation' | 'durability' | 'specificity';
  name: string;
  color: string;
  startDate: Date;
  endDate: Date;
  weekStart: number;
  weekEnd: number;
  weeks: WeekData[];
}

// Phase colors
const PHASE_COLORS: Record<string, string> = {
  'Foundation': '#FF474A',
  'Durability': '#165DFC',
  'Specificity': '#AC47FF'
}

export async function fetchPhases(): Promise<PhaseData[]> {
  const { data: plans, error: planError } = await supabase
    .from('training_plans')
    .select()
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)

  if (planError || !plans || plans.length === 0) {
    throw new Error('No active Wy\'East Trailfest 50M found')
  }

  const plan = plans[0]

  const { data: phases, error: phasesError } = await supabase
    .from('training_phases')
    .select()
    .eq('plan_id', plan.id)
    .order('week_start', { ascending: true })

  if (phasesError) {
    throw phasesError
  }

  const { data: weeks, error: weeksError } = await supabase
    .from('weekly_plans')
    .select()
    .eq('plan_id', plan.id)
    .order('week_number', { ascending: true })

  if (weeksError) {
    throw weeksError
  }

  // Transform to PhaseData format
  const phaseData: PhaseData[] = phases.map(phase => {
    const phaseWeeks = weeks
      .filter(w => w.week_number >= phase.week_start && w.week_number <= phase.week_end)
      .map(w => ({
        weekNumber: w.week_number,
        startDate: new Date(w.start_date),
        endDate: new Date(w.end_date),
        totalMiles: w.target_miles || 0,
        totalVert: w.target_vert || 0
      }))

    return {
      id: phase.name.toLowerCase() as 'foundation' | 'durability' | 'specificity',
      name: phase.name,
      color: PHASE_COLORS[phase.name] || '#FFFFFF',
      startDate: new Date(phase.start_date),
      endDate: new Date(phase.end_date),
      weekStart: phase.week_start,
      weekEnd: phase.week_end,
      weeks: phaseWeeks
    }
  })

  return phaseData
}

export async function fetchWeek(weekNumber: number) {
  const { data: plans, error: planError } = await supabase
    .from('training_plans')
    .select()
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)

  if (planError || !plans || plans.length === 0) {
    throw new Error('No active Wy\'East Trailfest 50M found')
  }

  const plan = plans[0]

  const { data: week, error: weekError } = await supabase
    .from('weekly_plans')
    .select(`
      *,
      training_phases(name),
      daily_workouts(*)
    `)
    .eq('plan_id', plan.id)
    .eq('week_number', weekNumber)
    .single()

  if (weekError) {
    throw weekError
  }

  return week
}

export async function fetchDay(date: string) {
  const { data: workout, error } = await supabase
    .from('daily_workouts')
    .select(`
      *,
      weekly_plans!inner(
        week_number,
        training_phases(name)
      )
    `)
    .eq('date', date)
    .single()

  if (error) {
    throw error
  }

  return workout
}

export async function fetchDayByWeekAndDay(weekNumber: number, dayOfWeek: string) {
  const { data: plans, error: planError } = await supabase
    .from('training_plans')
    .select()
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)

  if (planError || !plans || plans.length === 0) {
    throw new Error('No active Wy\'East Trailfest 50M found')
  }

  const plan = plans[0]

  const { data: week, error: weekError } = await supabase
    .from('weekly_plans')
    .select()
    .eq('plan_id', plan.id)
    .eq('week_number', weekNumber)
    .single()

  if (weekError) {
    throw weekError
  }

  // Capitalize first letter of day name to match database format (Monday, Tuesday, etc.)
  const capitalizedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1).toLowerCase()

  const { data: workout, error: workoutError } = await supabase
    .from('daily_workouts')
    .select(`
      *,
      weekly_plans!inner(
        week_number,
        training_phases(name)
      )
    `)
    .eq('weekly_plan_id', week.id)
    .eq('day_of_week', capitalizedDay)
    .single()

  if (workoutError) {
    throw workoutError
  }

  return workout
}

export async function updateWorkoutCompletion(workoutId: string, isCompleted: boolean) {
  const { data, error } = await supabase
    .from('daily_workouts')
    .update({ is_completed: isCompleted })
    .eq('id', workoutId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function fetchWorkoutCompletion(workoutId: string) {
  const { data, error } = await supabase
    .from('daily_workouts')
    .select('is_completed')
    .eq('id', workoutId)
    .single()

  if (error) {
    throw error
  }

  return data?.is_completed || false
}
