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

async function exportAndCleanup() {
  console.log('Exporting inactive training plans...')

  // Get all inactive plans
  const { data: inactivePlans, error: plansError } = await supabase
    .from('training_plans')
    .select()
    .eq('is_active', false)
    .order('created_at', { ascending: false })

  if (plansError) {
    throw plansError
  }

  if (!inactivePlans || inactivePlans.length === 0) {
    console.log('No inactive plans found.')
    return
  }

  console.log(`Found ${inactivePlans.length} inactive plan(s)`)

  // Export data for each inactive plan
  const exportData: any[] = []

  for (const plan of inactivePlans) {
    console.log(`Exporting plan ${plan.id}...`)

    // Get phases
    const { data: phases } = await supabase
      .from('training_phases')
      .select()
      .eq('plan_id', plan.id)

    // Get weeks
    const { data: weeks } = await supabase
      .from('weekly_plans')
      .select()
      .eq('plan_id', plan.id)

    // Get workouts for each week
    const workoutsByWeek: Record<string, any[]> = {}
    if (weeks) {
      for (const week of weeks) {
        const { data: workouts } = await supabase
          .from('daily_workouts')
          .select()
          .eq('weekly_plan_id', week.id)
        
        if (workouts) {
          workoutsByWeek[week.id] = workouts
        }
      }
    }

    exportData.push({
      plan,
      phases: phases || [],
      weeks: (weeks || []).map(week => ({
        ...week,
        workouts: workoutsByWeek[week.id] || []
      }))
    })
  }

  // Write export to file
  const exportPath = path.join(__dirname, '../exports/inactive_plans_backup.json')
  const exportDir = path.dirname(exportPath)
  
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true })
  }

  fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2))
  console.log(`\nExport saved to: ${exportPath}`)
  console.log(`Total plans exported: ${exportData.length}`)
  console.log(`Total phases: ${exportData.reduce((sum, p) => sum + p.phases.length, 0)}`)
  console.log(`Total weeks: ${exportData.reduce((sum, p) => sum + p.weeks.length, 0)}`)
  console.log(`Total workouts: ${exportData.reduce((sum, p) => sum + p.weeks.reduce((wSum: number, w: any) => wSum + w.workouts.length, 0), 0)}`)

  // Confirm deletion
  console.log('\n⚠️  About to delete all inactive plans and their associated data...')
  console.log(`This will delete ${inactivePlans.length} plans`)
  
  // Delete workouts first (due to foreign key constraints)
  let deletedWorkouts = 0
  for (const plan of inactivePlans) {
    const { data: weeks } = await supabase
      .from('weekly_plans')
      .select('id')
      .eq('plan_id', plan.id)

    if (weeks) {
      for (const week of weeks) {
        const { data: deleted } = await supabase
          .from('daily_workouts')
          .delete()
          .eq('weekly_plan_id', week.id)
          .select()

        if (deleted) {
          deletedWorkouts += deleted.length
        }
      }
    }
  }
  console.log(`Deleted ${deletedWorkouts} workouts`)

  // Delete weeks
  let deletedWeeks = 0
  for (const plan of inactivePlans) {
    const { data: deleted } = await supabase
      .from('weekly_plans')
      .delete()
      .eq('plan_id', plan.id)
      .select()

    if (deleted) {
      deletedWeeks += deleted.length
    }
  }
  console.log(`Deleted ${deletedWeeks} weeks`)

  // Delete phases
  let deletedPhases = 0
  for (const plan of inactivePlans) {
    const { data: deleted } = await supabase
      .from('training_phases')
      .delete()
      .eq('plan_id', plan.id)
      .select()

    if (deleted) {
      deletedPhases += deleted.length
    }
  }
  console.log(`Deleted ${deletedPhases} phases`)

  // Delete plans
  const { data: deletedPlans, error: deleteError } = await supabase
    .from('training_plans')
    .delete()
    .eq('is_active', false)
    .select()

  if (deleteError) {
    throw deleteError
  }

  console.log(`\n✅ Successfully deleted ${deletedPlans?.length || 0} inactive plan(s)`)
  console.log('\nCleanup complete!')
}

exportAndCleanup().catch(console.error)
