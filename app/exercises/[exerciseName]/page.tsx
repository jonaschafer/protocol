'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ExerciseCard } from '../exerciseCard'
// Import dayData - we'll need to create a shared data file or import it differently
// For now, let's duplicate the structure or import it properly
import { dayData } from '../../day/[dayName]/page'
import { BackButton } from '../../components/BackButton'

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
  // Find the exercise by matching the encoded name or by finding closest match
  for (const day of Object.values(dayData)) {
    for (const exercise of day.exercises) {
      if (encodeExerciseName(exercise.exerciseName) === encoded || exercise.id === encoded) {
        return exercise.exerciseName
      }
    }
  }
  return encoded.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
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
    const isTimed = typeof exercise.reps === 'string' && exercise.reps.includes('sec')
    
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
    onDelete: (id: number) => {
      // Will be handled by state management
    },
    onAddSet: () => {
      // Will be handled by state management
    },
    onLog: () => {
      // Will be handled by state management
    },
    onRepsChange: (id: number, value: string) => {
      // Will be handled by state management
    },
    onWeightChange: (id: number, value: string) => {
      // Will be handled by state management
    },
    onNotesSave: (value: string) => {
      console.log(`Notes saved for ${exercise.id}:`, value)
    }
  }
}

export default function ExercisePage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const exerciseNameParam = params?.exerciseName as string
  const dayNameParam = searchParams?.get('day')
  
  // Decode exercise name from URL
  const decodedExerciseName = decodeExerciseName(exerciseNameParam)
  
  // Get all exercises from the day if day name is provided
  let dayExercises: Array<{
    id: string;
    exerciseName: string;
    sets?: number;
    reps?: number | string;
    weight?: string;
    exerciseNote?: string;
    restNote?: string;
    cues?: string;
  }> = []
  
  let scrollToExerciseId: string | undefined = undefined

  // If day name is provided, get all exercises from that day
  if (dayNameParam) {
    const dayInfo = dayData[dayNameParam.toLowerCase()]
    if (dayInfo) {
      dayExercises = dayInfo.exercises
      // Find the exercise to scroll to
      const foundExercise = dayExercises.find(
        ex => ex.exerciseName === decodedExerciseName || ex.id === exerciseNameParam
      )
      if (foundExercise) {
        scrollToExerciseId = foundExercise.id
      }
    }
  }

  // If no day param or no exercises found, try to find the exercise across all days
  if (dayExercises.length === 0) {
    for (const day of Object.values(dayData)) {
      const foundExercise = day.exercises.find(
        ex => ex.exerciseName === decodedExerciseName || ex.id === exerciseNameParam
      )
      if (foundExercise) {
        dayExercises = [foundExercise]
        scrollToExerciseId = foundExercise.id
        break
      }
    }
  }

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
        const isTimed = typeof exercise.reps === 'string' && exercise.reps.includes('sec')
        
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

  if (dayExercises.length === 0) {
    return (
      <div style={{ padding: '20px', background: '#272727', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

  const handleDismiss = () => {
    // Navigate back to the day view if day param exists, otherwise go to home
    if (dayNameParam) {
      router.push(`/day/${dayNameParam}`)
    } else {
      router.push('/')
    }
  }

  return (
    <div 
      style={{ 
        background: '#000000', 
        minHeight: '100vh',
        width: '100%',
        padding: '20px 0 0 0',
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: '20px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '0 20px',
          pointerEvents: 'none',
          marginBottom: '20px'
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          <BackButton href={dayNameParam ? `/day/${dayNameParam}` : '/'} />
        </div>
      </div>
      <ExerciseCard
        exercises={exercisesData}
        onDismiss={handleDismiss}
        scrollToExerciseId={scrollToExerciseId}
      />
    </div>
  )
}

