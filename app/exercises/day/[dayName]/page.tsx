'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ExerciseCard } from '../../exerciseCard'
import { BottomNav } from '../../../components/BottomNav'
import { fetchDayByWeekAndDay } from '../../../../lib/supabase-data'
import { parsePTFoundationExercises, capitalizeExerciseName } from '../../../../lib/pt-foundation-parser'

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
    onDelete: (_id: number) => {},
    onAddSet: () => {},
    onLog: () => {},
    onRepsChange: (_id: number, _value: string) => {},
    onWeightChange: (_id: number, _value: string) => {},
    onNotesSave: (value: string) => {
      console.log(`Notes saved for ${exercise.id}:`, value)
    }
  }
}

export default function DayExercisesPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const dayNameParam = params?.dayName as string
  const weekParam = searchParams?.get('week')
  
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
  
  const [isLoading, setIsLoading] = useState(true)

  // Fetch exercises from database
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

      if (dayNameParam && weekParam) {
        try {
          const weekNumber = parseInt(weekParam)
          const workout = await fetchDayByWeekAndDay(weekNumber, dayNameParam)
          
          if (workout.strength_exercises && Array.isArray(workout.strength_exercises)) {
            workout.strength_exercises.forEach((ex: any, idx: number) => {
              let weight = ex.notes || ''
              if (weight) {
                const rpeMatches = weight.match(/(\d+%)/gi)
                if (rpeMatches && rpeMatches.length > 0) {
                  weight = rpeMatches[rpeMatches.length - 1]
                }
              }
              
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

          setDayExercises(exercises)
        } catch (error) {
          console.error('Error fetching exercises from database:', error)
        }
      }

      setIsLoading(false)
    }

    loadExercises()
  }, [dayNameParam, weekParam])

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
  }, [dayExercises])

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

  // Determine phase and background color based on week number
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

  if (isLoading) {
    return (
      <div style={{ 
        padding: '20px', 
        background: backgroundColor, 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '100vw', // Use viewport width to cover full screen
        margin: '-10px -10px 0 -10px', // Extend beyond layout padding to cover full viewport
        paddingTop: '20px', // Restore top padding for content
        paddingLeft: '20px', // Restore left padding for content
        paddingRight: '20px' // Restore right padding for content
      }}>
        <p style={{ color: 'white' }}>Loading exercises...</p>
      </div>
    )
  }

  if (dayExercises.length === 0) {
    return (
      <div style={{ 
        padding: '20px', 
        background: backgroundColor, 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '100vw', // Use viewport width to cover full screen
        margin: '-10px -10px 0 -10px', // Extend beyond layout padding to cover full viewport
        paddingTop: '20px', // Restore top padding for content
        paddingLeft: '20px', // Restore left padding for content
        paddingRight: '20px' // Restore right padding for content
      }}>
        <p style={{ color: 'white' }}>No exercises found for this day</p>
      </div>
    )
  }

  const exercisesData = dayExercises.map(exercise => {
    const exerciseData = transformExerciseToCardFormat(exercise, exerciseStates)
    
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
        width: '100vw', // Use viewport width to cover full screen
        position: 'relative',
        paddingBottom: '100px',
        margin: '-10px -10px 0 -10px', // Extend beyond layout padding to cover full viewport
        paddingTop: '10px', // Restore top padding for content
        paddingLeft: '10px', // Restore left padding for content
        paddingRight: '10px' // Restore right padding for content
      }}
    >
      <ExerciseCard
        exercises={exercisesData}
        scrollToExerciseId={undefined}
      />
      <BottomNav />
    </div>
  )
}
