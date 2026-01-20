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

// Read master plan
const masterPlanPath = '/Users/jonschafer/Dropbox/ jon/work/WHT_Git/protocol/MASTER_PLAN_27WEEKS_COMPLETE.md'
const masterPlanContent = fs.readFileSync(masterPlanPath, 'utf-8')

// Parse weeks from master plan
const weekSections = masterPlanContent.split(/##\s*Week\s*(\d+):/i)
const weekData: Record<number, any> = {}

for (let i = 1; i < weekSections.length; i += 2) {
  const weekNumber = parseInt(weekSections[i])
  const weekContent = weekSections[i + 1] || ''
  
  // Extract volume
  const volumeMatch = weekContent.match(/Volume.*?(\d+).*?miles.*?(\d+(?:,\d+)?).*?ft/i)
  const targetMiles = volumeMatch ? parseFloat(volumeMatch[1]) : null
  const targetVert = volumeMatch ? parseInt(volumeMatch[2].replace(/,/g, '')) : null
  
  // Parse days
  const daySections = weekContent.split(/###\s*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i)
  const days: any[] = []
  
  for (let j = 1; j < daySections.length; j += 2) {
    const dayName = daySections[j]
    const dayContent = daySections[j + 1] || ''
    
    // Parse date
    const dateMatch = dayContent.match(/,\s*(\w+)\s+(\d+)/i)
    if (dateMatch) {
      const months: Record<string, number> = {
        'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
        'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11
      }
      
      const monthName = dateMatch[1].toLowerCase()
      const day = parseInt(dateMatch[2])
      const month = months[monthName] ?? 0
      const date = new Date(2026, month, day)
      const dateStr = date.toISOString().split('T')[0]
      
      // Parse workout type
      let workoutType = 'rest'
      let miles = 0
      let vert = 0
      
      if (dayContent.includes('**Rest Day**')) {
        workoutType = 'rest'
      } else {
        const runMatch = dayContent.match(/Run.*?(\d+).*?miles/i)
        if (runMatch) {
          miles = parseFloat(runMatch[1])
          workoutType = 'run'
          
          const vertMatch = dayContent.match(/(\d+(?:,\d+)?)\s*ft\s*vert/i)
          if (vertMatch) {
            vert = parseInt(vertMatch[1].replace(/,/g, ''))
          }
          
          if (dayContent.includes('Strength')) {
            workoutType = 'run+strength'
          }
        } else if (dayContent.match(/Row.*?(\d+).*?min/i)) {
          workoutType = 'rowing'
        }
      }
      
      days.push({
        dayName,
        date: dateStr,
        workoutType,
        miles,
        vert
      })
    }
  }
  
  weekData[weekNumber] = {
    targetMiles,
    targetVert,
    days
  }
}

// Verify against database
async function verifyData() {
  const { data: plan } = await supabase
    .from('training_plans')
    .select()
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  console.log('Verifying data against master plan...\n')
  
  let totalErrors = 0
  
  for (const weekNumber of Object.keys(weekData).map(Number).sort((a, b) => a - b)) {
    const expected = weekData[weekNumber]
    
    const { data: week } = await supabase
      .from('weekly_plans')
      .select('id, week_number, target_miles, target_vert, start_date, end_date')
      .eq('plan_id', plan.id)
      .eq('week_number', weekNumber)
      .single()
    
    if (!week) {
      console.log(`Week ${weekNumber}: ❌ NOT FOUND`)
      totalErrors++
      continue
    }
    
    // Check week totals
    const milesMatch = Math.abs((week.target_miles || 0) - (expected.targetMiles || 0)) < 0.1
    const vertMatch = (week.target_vert || 0) === (expected.targetVert || 0)
    
    // Check days
    const { data: workouts } = await supabase
      .from('daily_workouts')
      .select('date, day_of_week, workout_type, run_distance_miles, run_vert_feet')
      .eq('weekly_plan_id', week.id)
      .order('date')
    
    let dayErrors = 0
    const errorDetails: string[] = []
    for (const expectedDay of expected.days) {
      const actual = workouts?.find(w => w.day_of_week === expectedDay.dayName)
      if (!actual) {
        dayErrors++
        errorDetails.push(`${expectedDay.dayName}: NOT FOUND`)
        continue
      }
      
      const dateMatch = actual.date === expectedDay.date
      const typeMatch = actual.workout_type === expectedDay.workoutType
      const milesMatch = Math.abs((actual.run_distance_miles || 0) - expectedDay.miles) < 0.1
      const vertMatch = (actual.run_vert_feet || 0) === expectedDay.vert
      
      if (!dateMatch || !typeMatch || !milesMatch || !vertMatch) {
        dayErrors++
        const issues = []
        if (!dateMatch) issues.push(`date: ${actual.date} vs ${expectedDay.date}`)
        if (!typeMatch) issues.push(`type: ${actual.workout_type} vs ${expectedDay.workoutType}`)
        if (!milesMatch) issues.push(`miles: ${actual.run_distance_miles} vs ${expectedDay.miles}`)
        if (!vertMatch) issues.push(`vert: ${actual.run_vert_feet} vs ${expectedDay.vert}`)
        errorDetails.push(`${expectedDay.dayName}: ${issues.join(', ')}`)
      }
    }
    
    if (dayErrors > 0 && weekNumber <= 3) {
      console.log(`  Errors: ${errorDetails.join('; ')}`)
    }
    
    const status = (milesMatch && vertMatch && dayErrors === 0) ? '✓' : '✗'
    console.log(`Week ${weekNumber}: ${status} ${milesMatch && vertMatch ? '' : `(miles: ${milesMatch}, vert: ${vertMatch})`} ${dayErrors > 0 ? `${dayErrors} day errors` : ''}`)
    
    if (!milesMatch || !vertMatch || dayErrors > 0) {
      totalErrors++
    }
  }
  
  console.log(`\nVerification complete: ${totalErrors === 0 ? 'All weeks match!' : `${totalErrors} weeks have errors`}`)
}

verifyData().catch(console.error)
