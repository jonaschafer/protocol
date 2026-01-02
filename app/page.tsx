'use client'

import { useState } from 'react'
import { ExerciseCard } from './exercises/exerciseCard'

interface Set {
  id: number;
  setNumber: number;
  reps: string;
  weight: string;
  isTimed: boolean;
}

interface Exercise {
  id: string;
  exerciseName: string;
  restNote: string;
  cues: string;
  initialSets: Set[];
}

const exercisesData: Exercise[] = [
  {
    id: 'seated-banded-hip-flexor-march',
    exerciseName: 'Seated Banded Hip Flexor March',
    restNote: '30 seconds rest between sets',
    cues: 'Loop band around foot and anchor it to stable object at ankle height, then sit tall and drive knee toward chest with controlled tempo, resisting band\'s pull on the way down. Keep core braced and avoid rocking torso backward.',
    initialSets: [
      { id: 1, setNumber: 1, reps: '15', weight: '0', isTimed: false },
      { id: 2, setNumber: 2, reps: '15', weight: '0', isTimed: false },
      { id: 3, setNumber: 3, reps: '15', weight: '0', isTimed: false }
    ]
  },
  {
    id: 'psoas-plank',
    exerciseName: 'Psoas Plank',
    restNote: '30 seconds rest between sets',
    cues: 'Hold forearm plank position and lift one foot 1-2 inches off ground, keeping hips level and core tight. Alternate legs every 5-10 seconds without letting hips rotate or drop.',
    initialSets: [
      { id: 1, setNumber: 1, reps: '30', weight: '0', isTimed: true },
      { id: 2, setNumber: 2, reps: '30', weight: '0', isTimed: true },
      { id: 3, setNumber: 3, reps: '30', weight: '0', isTimed: true }
    ]
  },
  {
    id: 'side-lying-adduction',
    exerciseName: 'Side-Lying Adduction',
    restNote: '30 seconds rest between sets',
    cues: 'Lie on side with top leg bent and foot flat on floor in front of bottom leg, then lift bottom leg straight up toward ceiling while keeping it fully extended. Focus on inner thigh initiating the movement, not momentum or hip rocking.',
    initialSets: [
      { id: 1, setNumber: 1, reps: '15', weight: '0', isTimed: false },
      { id: 2, setNumber: 2, reps: '15', weight: '0', isTimed: false },
      { id: 3, setNumber: 3, reps: '15', weight: '0', isTimed: false }
    ]
  },
  {
    id: 'copenhagen-plank',
    exerciseName: 'Copenhagen Plank',
    restNote: '30 seconds rest between sets',
    cues: 'Support body on forearm with top leg elevated on bench at knee or ankle, holding side plank position with top leg doing the work. Keep body in straight line from head to heel without letting hips sag.',
    initialSets: [
      { id: 1, setNumber: 1, reps: '20', weight: '0', isTimed: true },
      { id: 2, setNumber: 2, reps: '20', weight: '0', isTimed: true },
      { id: 3, setNumber: 3, reps: '20', weight: '0', isTimed: true }
    ]
  },
  {
    id: 'side-plank-clam-raise',
    exerciseName: 'Side Plank Clam Raise',
    restNote: '30 seconds rest between sets',
    cues: 'Hold side plank position on forearm with knees bent, then open top knee like a clamshell while keeping feet together. Maintain stable torso throughout and drive movement from hip, not from rocking body backward.',
    initialSets: [
      { id: 1, setNumber: 1, reps: '15', weight: '0', isTimed: false },
      { id: 2, setNumber: 2, reps: '15', weight: '0', isTimed: false }
    ]
  },
  {
    id: 'monster-walks',
    exerciseName: 'Monster Walks',
    restNote: '30 seconds rest between sets',
    cues: 'Place band around ankles and maintain slight squat position with knees tracking over toes, then step laterally with tension in band throughout. Keep chest up and avoid letting knees cave inward.',
    initialSets: [
      { id: 1, setNumber: 1, reps: '18', weight: '0', isTimed: false },
      { id: 2, setNumber: 2, reps: '18', weight: '0', isTimed: false },
      { id: 3, setNumber: 3, reps: '18', weight: '0', isTimed: false }
    ]
  },
  {
    id: 'fonda-raises',
    exerciseName: 'Fonda Raises',
    restNote: '30 seconds rest between sets',
    cues: 'Lie on side with bottom leg bent for stability and top leg straight, then lift top leg toward ceiling while keeping toes pointing forward (not up). Control the descent and avoid using momentum or rocking hips.',
    initialSets: [
      { id: 1, setNumber: 1, reps: '15', weight: '0', isTimed: false },
      { id: 2, setNumber: 2, reps: '15', weight: '0', isTimed: false },
      { id: 3, setNumber: 3, reps: '15', weight: '0', isTimed: false }
    ]
  },
  {
    id: 'single-leg-balance',
    exerciseName: 'Single-Leg Balance (Eyes Closed)',
    restNote: '30 seconds rest between sets',
    cues: 'Stand on one leg with slight knee bend and close eyes, maintaining balance for full duration. If you lose balance, reset immediately and continue counting time.',
    initialSets: [
      { id: 1, setNumber: 1, reps: '30', weight: '0', isTimed: true },
      { id: 2, setNumber: 2, reps: '30', weight: '0', isTimed: true },
      { id: 3, setNumber: 3, reps: '30', weight: '0', isTimed: true }
    ]
  },
  {
    id: 'single-leg-glute-bridge',
    exerciseName: 'Single-Leg Glute Bridge',
    restNote: '30 seconds rest between sets',
    cues: 'Lie on back with one foot flat on ground and other leg extended straight, then drive through heel to lift hips while keeping extended leg parallel to bent leg. Squeeze glute at top for 1-second pause and avoid hyperextending lower back.',
    initialSets: [
      { id: 1, setNumber: 1, reps: '8', weight: '0', isTimed: false },
      { id: 2, setNumber: 2, reps: '8', weight: '0', isTimed: false },
      { id: 3, setNumber: 3, reps: '8', weight: '0', isTimed: false },
      { id: 4, setNumber: 4, reps: '8', weight: '0', isTimed: false }
    ]
  },
  {
    id: 'step-downs',
    exerciseName: 'Step-Downs',
    restNote: '30 seconds rest between sets',
    cues: 'Stand on box with one leg and slowly lower opposite heel toward ground with control, keeping weight-bearing knee tracking over toes. Focus on controlling descent with working leg, not dropping or bouncing at bottom.',
    initialSets: [
      { id: 1, setNumber: 1, reps: '15', weight: '0', isTimed: false },
      { id: 2, setNumber: 2, reps: '15', weight: '0', isTimed: false },
      { id: 3, setNumber: 3, reps: '15', weight: '0', isTimed: false }
    ]
  },
  {
    id: 'wall-sit',
    exerciseName: 'Wall Sit',
    restNote: '30 seconds rest between sets',
    cues: 'Lean back against wall with knees bent to 90 degrees and thighs parallel to ground, keeping feet hip-width apart. Press low back into wall and avoid letting knees drift past toes.',
    initialSets: [
      { id: 1, setNumber: 1, reps: '30', weight: '0', isTimed: true },
      { id: 2, setNumber: 2, reps: '30', weight: '0', isTimed: true },
      { id: 3, setNumber: 3, reps: '30', weight: '0', isTimed: true }
    ]
  },
  {
    id: 'calf-raises',
    exerciseName: 'Calf Raises',
    restNote: '30 seconds rest between sets',
    cues: 'Stand on one leg with slight knee bend and slowly rise onto ball of foot, hold top position for 1 second, then lower with 3-second tempo. Keep movement controlled without bouncing at bottom.',
    initialSets: [
      { id: 1, setNumber: 1, reps: '30', weight: '0', isTimed: false },
      { id: 2, setNumber: 2, reps: '30', weight: '0', isTimed: false },
      { id: 3, setNumber: 3, reps: '30', weight: '0', isTimed: false }
    ]
  }
];

export default function Home() {
  // State for each exercise: sets, isLogged, showCard
  const [exerciseStates, setExerciseStates] = useState<Record<string, {
    sets: Set[];
    isLogged: boolean;
    showCard: boolean;
  }>>(() => {
    const initial: Record<string, { sets: Set[]; isLogged: boolean; showCard: boolean }> = {};
    exercisesData.forEach(exercise => {
      initial[exercise.id] = {
        sets: exercise.initialSets.map(set => ({ ...set })),
        isLogged: false,
        showCard: true
      };
    });
    return initial;
  });

  const handleDelete = (exerciseId: string, setId: number) => {
    setExerciseStates(prev => {
      const exerciseState = prev[exerciseId];
      const filtered = exerciseState.sets.filter(set => set.id !== setId);
      const renumbered = filtered.map((set, index) => ({
        ...set,
        setNumber: index + 1
      }));
      return {
        ...prev,
        [exerciseId]: {
          ...exerciseState,
          sets: renumbered
        }
      };
    });
  };

  const handleAddSet = (exerciseId: string) => {
    setExerciseStates(prev => {
      const exerciseState = prev[exerciseId];
      const lastSet = exerciseState.sets[exerciseState.sets.length - 1];
      const newSet: Set = {
      id: Date.now(),
        setNumber: exerciseState.sets.length + 1,
      reps: lastSet ? lastSet.reps : '8',
        weight: lastSet ? lastSet.weight : '0',
      isTimed: lastSet ? lastSet.isTimed : false
    };
      return {
        ...prev,
        [exerciseId]: {
          ...exerciseState,
          sets: [...exerciseState.sets, newSet]
        }
      };
    });
  };

  const handleLog = (exerciseId: string) => {
    setExerciseStates(prev => {
      const exerciseState = prev[exerciseId];
      return {
        ...prev,
        [exerciseId]: {
          ...exerciseState,
          isLogged: !exerciseState.isLogged
        }
      };
    });
  };

  const handleRepsChange = (exerciseId: string, setId: number, value: string) => {
    setExerciseStates(prev => {
      const exerciseState = prev[exerciseId];
      return {
        ...prev,
        [exerciseId]: {
          ...exerciseState,
          sets: exerciseState.sets.map(set =>
            set.id === setId ? { ...set, reps: value } : set
          )
        }
      };
    });
  };

  const handleWeightChange = (exerciseId: string, setId: number, value: string) => {
    setExerciseStates(prev => {
      const exerciseState = prev[exerciseId];
      return {
        ...prev,
        [exerciseId]: {
          ...exerciseState,
          sets: exerciseState.sets.map(set =>
            set.id === setId ? { ...set, weight: value } : set
          )
        }
      };
    });
  };

  const handleNotesSave = (exerciseId: string, value: string) => {
    console.log(`Notes saved for ${exerciseId}:`, value);
  };

  // Build exercises array for ExerciseCard
  const exercisesForCard = exercisesData
    .filter(exercise => exerciseStates[exercise.id]?.showCard)
    .map(exercise => {
      const state = exerciseStates[exercise.id];
      return {
        id: exercise.id,
        exerciseName: exercise.exerciseName,
        restNote: exercise.restNote,
        cues: exercise.cues,
        sets: state.sets,
        isLogged: state.isLogged,
        onDelete: (id: number) => handleDelete(exercise.id, id),
        onAddSet: () => handleAddSet(exercise.id),
        onLog: () => handleLog(exercise.id),
        onRepsChange: (id: number, value: string) => handleRepsChange(exercise.id, id, value),
        onWeightChange: (id: number, value: string) => handleWeightChange(exercise.id, id, value),
        onNotesSave: (value: string) => handleNotesSave(exercise.id, value)
      };
    });

  if (exercisesForCard.length === 0) {
    return (
      <div style={{ padding: '20px', background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'white' }}>No exercises to display</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', background: '#000', minHeight: '100vh' }}>
      <ExerciseCard
        exercises={exercisesForCard}
        onDismiss={() => {
          // Dismiss all exercises or handle as needed
          console.log('Card dismissed');
        }}
      />
    </div>
  );
}
