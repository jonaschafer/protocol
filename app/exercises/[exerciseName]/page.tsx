'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ExerciseCard } from '../exerciseCard'
import { dayData } from '../../data/dayData'
import { BottomNav } from '../../components/BottomNav'
import { fetchDayByWeekAndDay } from '../../../lib/supabase-data'
import { parsePTFoundationExercises, capitalizeExerciseName } from '../../../lib/pt-foundation-parser'

interface Set {
  id: number;
  setNumber: number;
  reps: string;
  weight: string;
  isTimed: boolean;
}

interface ExerciseData {
  id: string;
  exerciseName: string;
  restNote: string;
  cues: string;
  sets: Set[];
  isLogged: boolean;
  onDelete: (id: number) => void;
  onAddSet: () => void;
  onLog: () => void;
  onRepsChange: (id: number, value: string) => void;
  onWeightChange: (id: number, value: string) => void;
  onNotesSave?: (value: string) => void;
}

// Helper function to encode exercise name for URL
function encodeExerciseName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// Helper function to decode exercise name from URL
function decodeExerciseName(encoded: string): string {
  // Try to decode from dayData first (fallback)
  for (const day of Object.values(dayData)) {
    for (const exercise of day.exercises) {
      if (encodeExerciseName(exercise.exerciseName) === encoded || exercise.id === encoded) {
        return exercise.exerciseName
      }
    }
  }
  // If not found, try to reconstruct from encoded name
  // Handle special cases like "circuit-" prefix
  const decoded = encoded.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  return decoded
}

// Transform day view exercise to ExerciseCard format
function transformExerciseToCardFormat(
  exercise: {
    id: string;
    exerciseName: string;
    sets?: number;
    reps?: number | string;
    weight?: string;
    exerciseNote?: string;
    restNote?: string;
    cues?: string;
    isTimed?: boolean;
  },
  exerciseStates: Record<string, { sets: Set[]; isLogged: boolean }>
): ExerciseData {
  const state = exerciseStates[exercise.id] || {
    sets: [],
    isLogged: false
  }

  // If no sets in state, create them from exercise data
  if (state.sets.length === 0 && exercise.sets) {
    const numSets = exercise.sets
    const repsValue = String(exercise.reps || '8')
    const weightValue = exercise.weight || '0'
    // Use isTimed from exercise if available, otherwise check if reps includes 'sec'
    const isTimed = exercise.isTimed !== undefined 
      ? exercise.isTimed 
      : (typeof exercise.reps === 'string' && exercise.reps.includes('sec'))
    
    state.sets = Array.from({ length: numSets }, (_, i) => ({
      id: i + 1,
      setNumber: i + 1,
      reps: repsValue,
      weight: weightValue,
      isTimed: isTimed
    }))
  }

  return {
    id: exercise.id,
    exerciseName: exercise.exerciseName,
    restNote: exercise.restNote || '2-3 minutes rest between sets',
    cues: exercise.cues || 'Focus on proper form and controlled movement.',
    sets: state.sets,
    isLogged: state.isLogged,
    onDelete: (_id: number) => {
      // Will be handled by state management
    },
    onAddSet: () => {
      // Will be handled by state management
    },
    onLog: () => {
      // Will be handled by state management
    },
    onRepsChange: (_id: number, _value: string) => {
      // Will be handled by state management
    },
    onWeightChange: (_id: number, _value: string) => {
      // Will be handled by state management
    },
    onNotesSave: (value: string) => {
      console.log(`Notes saved for ${exercise.id}:`, value)
    }
  }
}

export default function ExercisePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const exerciseNameParam = params?.exerciseName as string
  const dayNameParam = searchParams?.get('day')
  const weekParam = searchParams?.get('week')
  
  // Determine phase and background color based on week number - calculate early
  const getPhaseColor = (weekNumber: number | null): string => {
    if (!weekNumber || isNaN(weekNumber)) return '#000000' // Default black if no week
    
    if (weekNumber >= 1 && weekNumber <= 9) {
      return '#FF474A' // Foundation - Red
    } else if (weekNumber >= 10 && weekNumber <= 20) {
      return '#165DFC' // Durability - Blue
    } else if (weekNumber >= 21 && weekNumber <= 27) {
      return '#AC47FF' // Specificity - Purple
    }
    return '#000000' // Default black
  }

  const weekNumber = weekParam ? parseInt(weekParam) : null
  const backgroundColor = getPhaseColor(weekNumber)
  
  // Get all exercises from the day if day name is provided
  const [dayExercises, setDayExercises] = useState<Array<{
    id: string;
    exerciseName: string;
    sets?: number;
    reps?: number | string;
    weight?: string;
    exerciseNote?: string;
    restNote?: string;
    cues?: string;
    isTimed?: boolean;
  }>>([])
  
  const [scrollToExerciseId, setScrollToExerciseId] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch exercises from database if day and week params are provided
  useEffect(() => {
    const loadExercises = async () => {
      setIsLoading(true)
          let exercises: Array<{
        id: string;
        exerciseName: string;
        sets?: number;
        reps?: number | string;
        weight?: string;
        exerciseNote?: string;
        restNote?: string;
        cues?: string;
        isTimed?: boolean;
      }> = []

      // If both day and week are provided, fetch from database
      if (dayNameParam && weekParam) {
        try {
          const weekNumber = parseInt(weekParam)
          const workout = await fetchDayByWeekAndDay(weekNumber, dayNameParam)
          
          // Transform strength exercises from database
          if (workout.strength_exercises && Array.isArray(workout.strength_exercises)) {
            workout.strength_exercises.forEach((ex: any, idx: number) => {
              // Exercises are now stored individually in the database (circuits are already split)
              // So we can treat all exercises the same way
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
                cues: '',
                isTimed: typeof reps === 'string' && reps.includes('sec')
              })
            })
          }

          // Parse PT Foundation exercises if present
          if (workout.workout_notes?.includes('PT FOUNDATION')) {
            const ptExercises = parsePTFoundationExercises(workout.workout_notes)
            exercises.push(...ptExercises)
          }

          // Find the exercise to scroll to - match by encoded name or exact name
          const decodedExerciseName = decodeExerciseName(exerciseNameParam)
          const foundExercise = exercises.find(
            ex => {
              const encodedExName = encodeExerciseName(ex.exerciseName)
              return ex.exerciseName === decodedExerciseName || 
                     ex.id === exerciseNameParam ||
                     encodedExName === exerciseNameParam ||
                     ex.exerciseName.toLowerCase().includes(decodedExerciseName.toLowerCase()) ||
                     decodedExerciseName.toLowerCase().includes(ex.exerciseName.toLowerCase())
            }
          )
          if (foundExercise) {
            setScrollToExerciseId(foundExercise.id)
          }

          setDayExercises(exercises)
        } catch (error) {
          console.error('Error fetching exercises from database:', error)
          // Fallback to hardcoded data
          const dayInfo = dayData[dayNameParam.toLowerCase()]
          if (dayInfo) {
            exercises = dayInfo.exercises
            const decodedExerciseName = decodeExerciseName(exerciseNameParam)
            const foundExercise = exercises.find(
              ex => {
                const encodedExName = encodeExerciseName(ex.exerciseName)
                return ex.exerciseName === decodedExerciseName || 
                       ex.id === exerciseNameParam ||
                       encodedExName === exerciseNameParam
              }
            )
            if (foundExercise) {
              setScrollToExerciseId(foundExercise.id)
            }
            setDayExercises(exercises)
          }
        }
      } else if (dayNameParam) {
        // Fallback to hardcoded data if only day is provided
        const dayInfo = dayData[dayNameParam.toLowerCase()]
        if (dayInfo) {
          exercises = dayInfo.exercises
          const decodedExerciseName = decodeExerciseName(exerciseNameParam)
          const foundExercise = exercises.find(
            ex => {
              const encodedExName = encodeExerciseName(ex.exerciseName)
              return ex.exerciseName === decodedExerciseName || 
                     ex.id === exerciseNameParam ||
                     encodedExName === exerciseNameParam
            }
          )
          if (foundExercise) {
            setScrollToExerciseId(foundExercise.id)
          }
          setDayExercises(exercises)
        }
      }

      // If still no exercises found, try to find the exercise across all days (fallback)
      if (exercises.length === 0) {
        const decodedExerciseName = decodeExerciseName(exerciseNameParam)
        for (const day of Object.values(dayData)) {
          const foundExercise = day.exercises.find(
            ex => {
              const encodedExName = encodeExerciseName(ex.exerciseName)
              return ex.exerciseName === decodedExerciseName || 
                     ex.id === exerciseNameParam ||
                     encodedExName === exerciseNameParam
            }
          )
          if (foundExercise) {
            exercises = [foundExercise]
            setScrollToExerciseId(foundExercise.id)
            break
          }
        }
        setDayExercises(exercises)
      }

      setIsLoading(false)
    }

    loadExercises()
  }, [dayNameParam, weekParam, exerciseNameParam])

  // State management for all exercises
  const [exerciseStates, setExerciseStates] = useState<Record<string, { sets: Set[]; isLogged: boolean }>>(() => {
    const initial: Record<string, { sets: Set[]; isLogged: boolean }> = {}
    dayExercises.forEach(exercise => {
      initial[exercise.id] = {
        sets: [],
        isLogged: false
      }
    })
    return initial
  })

  // Initialize sets for all exercises if not already done
  useEffect(() => {
    dayExercises.forEach(exercise => {
      if (!exerciseStates[exercise.id] || exerciseStates[exercise.id].sets.length === 0) {
        const numSets = exercise.sets || 3
        const repsValue = String(exercise.reps || '8')
        const weightValue = exercise.weight || '0'
        // Use isTimed from exercise if available, otherwise check if reps includes 'sec'
        const isTimed = exercise.isTimed !== undefined 
          ? exercise.isTimed 
          : (typeof exercise.reps === 'string' && exercise.reps.includes('sec'))
        
        setExerciseStates(prev => {
          // Skip if already initialized
          if (prev[exercise.id]?.sets.length > 0) {
            return prev
          }
          
          return {
            ...prev,
            [exercise.id]: {
              sets: Array.from({ length: numSets }, (_, i) => ({
                id: Date.now() + i + Math.random(),
                setNumber: i + 1,
                reps: repsValue,
                weight: weightValue,
                isTimed: isTimed
              })),
              isLogged: prev[exercise.id]?.isLogged || false
            }
          }
        })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayNameParam, exerciseNameParam])

  const handleDelete = (exerciseId: string, setId: number) => {
    setExerciseStates(prev => {
      const exerciseState = prev[exerciseId]
      const filtered = exerciseState.sets.filter(set => set.id !== setId)
      const renumbered = filtered.map((set, index) => ({
        ...set,
        setNumber: index + 1
      }))
      return {
        ...prev,
        [exerciseId]: {
          ...exerciseState,
          sets: renumbered
        }
      }
    })
  }

  const handleAddSet = (exerciseId: string) => {
    setExerciseStates(prev => {
      const exerciseState = prev[exerciseId]
      const lastSet = exerciseState.sets[exerciseState.sets.length - 1]
      const newSet: Set = {
        id: Date.now(),
        setNumber: exerciseState.sets.length + 1,
        reps: lastSet ? lastSet.reps : '8',
        weight: lastSet ? lastSet.weight : '0',
        isTimed: lastSet ? lastSet.isTimed : false
      }
      return {
        ...prev,
        [exerciseId]: {
          ...exerciseState,
          sets: [...exerciseState.sets, newSet]
        }
      }
    })
  }

  const handleLog = (exerciseId: string) => {
    setExerciseStates(prev => {
      const exerciseState = prev[exerciseId]
      return {
        ...prev,
        [exerciseId]: {
          ...exerciseState,
          isLogged: !exerciseState.isLogged
        }
      }
    })
  }

  const handleRepsChange = (exerciseId: string, setId: number, value: string) => {
    setExerciseStates(prev => {
      const exerciseState = prev[exerciseId]
      return {
        ...prev,
        [exerciseId]: {
          ...exerciseState,
          sets: exerciseState.sets.map(set =>
            set.id === setId ? { ...set, reps: value } : set
          )
        }
      }
    })
  }

  const handleWeightChange = (exerciseId: string, setId: number, value: string) => {
    setExerciseStates(prev => {
      const exerciseState = prev[exerciseId]
      return {
        ...prev,
        [exerciseId]: {
          ...exerciseState,
          sets: exerciseState.sets.map(set =>
            set.id === setId ? { ...set, weight: value } : set
          )
        }
      }
    })
  }

  const handleNotesSave = (exerciseId: string, value: string) => {
    console.log(`Notes saved for ${exerciseId}:`, value)
  }

  if (isLoading) {
    return (
      <div style={{ padding: '20px', background: backgroundColor, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'white' }}>Loading exercises...</p>
      </div>
    )
  }

  if (dayExercises.length === 0) {
    return (
      <div style={{ padding: '20px', background: backgroundColor, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'white' }}>Exercise not found</p>
      </div>
    )
  }

  // Transform all exercises to ExerciseCard format
  const exercisesData = dayExercises.map(exercise => {
    const exerciseData = transformExerciseToCardFormat(exercise, exerciseStates)
    
    // Update handlers with actual state management
    exerciseData.onDelete = (id: number) => handleDelete(exercise.id, id)
    exerciseData.onAddSet = () => handleAddSet(exercise.id)
    exerciseData.onLog = () => handleLog(exercise.id)
    exerciseData.onRepsChange = (id: number, value: string) => handleRepsChange(exercise.id, id, value)
    exerciseData.onWeightChange = (id: number, value: string) => handleWeightChange(exercise.id, id, value)
    exerciseData.onNotesSave = (value: string) => handleNotesSave(exercise.id, value)
    
    return exerciseData
  })

  return (
    <div 
      style={{ 
        background: backgroundColor, 
        minHeight: '100vh',
        width: '100%',
        padding: '0',
        position: 'relative',
        paddingBottom: '100px' // Extra padding for bottom nav
      }}
    >
      <ExerciseCard
        exercises={exercisesData}
        scrollToExerciseId={scrollToExerciseId}
      />
      <BottomNav />
    </div>
  )
}

