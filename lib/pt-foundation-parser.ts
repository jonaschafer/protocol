// Helper function to capitalize exercise name (Title Case)
export function capitalizeExerciseName(name: string): string {
  return name.split(' ').map(word => {
    // Handle hyphenated words like 'push-ups'
    if (word.includes('-')) {
      return word.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join('-')
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  }).join(' ')
}

// Parse and format reps value - extracts number, removes "each", handles durations and distances
function parseRepsValue(repsString: string): { reps: string; isTimed: boolean; cues?: string } {
  if (!repsString) {
    return { reps: '', isTimed: false }
  }

  // Check if it's a duration (contains "sec")
  if (repsString.toLowerCase().includes('sec')) {
    const durationMatch = repsString.match(/(\d+)\s*sec/i)
    if (durationMatch) {
      return { reps: durationMatch[1], isTimed: true }
    }
  }

  // Check if it's a distance (contains "ft")
  if (repsString.toLowerCase().includes('ft')) {
    const distanceMatch = repsString.match(/(\d+)\s*ft/i)
    if (distanceMatch) {
      const distance = distanceMatch[1]
      let cues = `Go for ${distance} ft`
      
      // Add helpful context based on distance description
      if (repsString.includes('one direction')) {
        cues += ', or from the cabinet to the garage door'
      } else if (repsString.includes('each direction')) {
        // For exercises with "each direction"
        if (distance === '9') {
          cues += ', from cabinet to bikes'
        } else if (distance === '18') {
          cues += ', or from the cabinet to the garage door'
        }
      }
      
      return { reps: distance, isTimed: false, cues }
    }
  }

  // For regular reps, extract number and remove "each" variations
  // Handle ranges like "15-20" - take the first number
  let cleanedReps = repsString
    .replace(/\s*each\s+(leg|side|arm|hand)\s*/gi, '') // Remove "each leg", "each side", etc.
    .replace(/\s*each\s*/gi, '') // Remove standalone "each"
    .trim()

  // Extract number (handle ranges like "15-20" by taking first number)
  const numberMatch = cleanedReps.match(/^(\d+)(?:-\d+)?/)
  if (numberMatch) {
    return { reps: numberMatch[1], isTimed: false }
  }

  // If it's AMRAP or other text, keep it as is
  if (cleanedReps.toUpperCase().includes('AMRAP')) {
    return { reps: cleanedReps, isTimed: false }
  }

  // Fallback: return cleaned string
  return { reps: cleanedReps, isTimed: false }
}

// Parse PT Foundation exercises from workout notes into individual exercise entries
export function parsePTFoundationExercises(notes: string): Array<{
  id: string;
  exerciseName: string;
  sets: number;
  reps: string;
  weight: string;
  exerciseNote: string;
  restNote?: string;
  cues?: string;
  isTimed?: boolean;
}> {
  const exercises: Array<{
    id: string;
    exerciseName: string;
    sets: number;
    reps: string;
    weight: string;
    exerciseNote: string;
    restNote?: string;
    cues?: string;
    isTimed?: boolean;
  }> = []
  const lines = notes.split('\n')
  let exerciseIndex = 0

  for (const line of lines) {
    const trimmed = line.trim()
    
    // Skip empty lines and the header
    if (!trimmed || trimmed.includes('PT FOUNDATION PROGRAM') || trimmed.endsWith(':')) {
      continue
    }

    // Check if this is an exercise (starts with bullet point or dash)
    if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
      const exerciseText = trimmed.replace(/^[•\-]\s*/, '') // Remove bullet/dash
      
      // Split exercise name and sets/reps (format: "Exercise Name - Sets/Reps")
      const parts = exerciseText.split(' - ')
      if (parts.length >= 2) {
        const exerciseName = parts[0].trim()
        const setsReps = parts.slice(1).join(' - ').trim()
        
        // Parse sets and reps from formats like:
        // "3x15-20 each leg" -> sets: 3, reps: "15" (removed "each leg")
        // "3x30sec" -> sets: 3, reps: "30", isTimed: true
        // "3 sets of 18ft (one direction)" -> sets: 3, reps: "18", cues: "Go for 18 ft, or from the cabinet to the garage door"
        // "3xAMRAP" -> sets: 3, reps: "AMRAP"
        let sets = 1
        let rawReps = setsReps
        
        // Try to extract sets from common patterns
        // Match "3x" format first
        const xFormatMatch = setsReps.match(/^(\d+)x\s*(.+)/i)
        if (xFormatMatch) {
          sets = parseInt(xFormatMatch[1], 10)
          rawReps = xFormatMatch[2].trim()
        } else {
          // Match "3 sets of" format
          const setsOfMatch = setsReps.match(/^(\d+)\s+sets\s+of\s+(.+)/i)
          if (setsOfMatch) {
            sets = parseInt(setsOfMatch[1], 10)
            rawReps = setsOfMatch[2].trim()
          }
        }

        // Parse reps value (extract number, handle durations, distances)
        const { reps, isTimed, cues: repCues } = parseRepsValue(rawReps)

        exercises.push({
          id: `pt-${exerciseName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${exerciseIndex}`,
          exerciseName: capitalizeExerciseName(exerciseName),
          sets: sets,
          reps: reps,
          weight: '',
          exerciseNote: '',
          restNote: '2-3 minutes rest between sets',
          cues: repCues || '',
          isTimed: isTimed
        })
        
        exerciseIndex++
      } else if (exerciseText.trim()) {
        // If no dash separator, treat entire line as exercise name
        exercises.push({
          id: `pt-${exerciseText.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${exerciseIndex}`,
          exerciseName: capitalizeExerciseName(exerciseText.trim()),
          sets: 1,
          reps: '',
          weight: '',
          exerciseNote: '',
          restNote: '2-3 minutes rest between sets',
          cues: '',
          isTimed: false
        })
        
        exerciseIndex++
      }
    }
  }

  return exercises
}
