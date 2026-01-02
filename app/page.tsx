'use client'

import { useState } from 'react'
import { ExerciseCard } from './exercises/exerciseCard'

export default function Home() {
  // Exercise data from Supabase (will be fetched from Supabase)
  const [exerciseData] = useState({
    exerciseName: 'Trap Bar Deadlift',
    restNote: '30 seconds rest between sets',
    cues: '6-8" step height, but 24" is ideal. Slow, controlled eccentric (3-sec lower). Focus on knee tracking over toes. '
  });

  const [sets, setSets] = useState([
    { id: 1, setNumber: 1, reps: '8', weight: '145', isTimed: false },
    { id: 2, setNumber: 2, reps: '8', weight: '145', isTimed: false },
    { id: 3, setNumber: 3, reps: '8', weight: '145', isTimed: false },
    { id: 4, setNumber: 4, reps: '60', weight: '0', isTimed: true }
  ]);
  const [isLogged, setIsLogged] = useState(false);
  const [showCard, setShowCard] = useState(true);

  const handleDelete = (id: number) => {
    setSets(prevSets => {
      const filtered = prevSets.filter(set => set.id !== id);
      // Renumber sets after deletion
      return filtered.map((set, index) => ({
        ...set,
        setNumber: index + 1
      }));
    });
  };

  const handleAddSet = () => {
    const lastSet = sets[sets.length - 1];
    const newSet = {
      id: Date.now(),
      setNumber: sets.length + 1,
      reps: lastSet ? lastSet.reps : '8',
      weight: lastSet ? lastSet.weight : '145',
      isTimed: lastSet ? lastSet.isTimed : false
    };
    setSets([...sets, newSet]);
  };

  const handleLog = () => {
    setIsLogged(!isLogged);
  };

  const handleRepsChange = (id: number, value: string) => {
    setSets(prevSets =>
      prevSets.map(set => (set.id === id ? { ...set, reps: value } : set))
    );
  };

  const handleWeightChange = (id: number, value: string) => {
    setSets(prevSets =>
      prevSets.map(set => (set.id === id ? { ...set, weight: value } : set))
    );
  };

  const handleDismiss = () => {
    setShowCard(false);
    // Return to main workout view - you can add navigation logic here
    console.log('Card dismissed, returning to main workout view');
  };

  if (!showCard) {
    // Main workout view when card is dismissed
    return (
      <div style={{ padding: '20px', background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button
          onClick={() => setShowCard(true)}
          style={{
            padding: '20px 40px',
            backgroundColor: 'white',
            color: '#000',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '16px',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Show Exercise Card
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', background: '#000', minHeight: '100vh' }}>
      <ExerciseCard
        exerciseName={exerciseData.exerciseName}
        restNote={exerciseData.restNote}
        cues={exerciseData.cues}
        sets={sets}
        isLogged={isLogged}
        onDelete={handleDelete}
        onAddSet={handleAddSet}
        onLog={handleLog}
        onRepsChange={handleRepsChange}
        onWeightChange={handleWeightChange}
        onNotesSave={(value) => console.log('Notes saved:', value)}
        onDismiss={handleDismiss}
      />
    </div>
  )
}
