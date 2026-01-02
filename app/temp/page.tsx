'use client'

import { useState } from 'react'
import { ExerciseHeader } from '../components/ExerciseHeader'
import { SetRow } from '../components/SetRow'
import { Notes } from '../components/Notes'

interface Set {
  id: number;
  setNumber: number;
  reps: string;
  weight: string;
  isTimed: boolean;
}

export default function TempPage() {
  const [sets, setSets] = useState<Set[]>([
    { id: 1, setNumber: 1, reps: '15', weight: '0', isTimed: false },
    { id: 2, setNumber: 2, reps: '15', weight: '0', isTimed: false },
    { id: 3, setNumber: 3, reps: '15', weight: '0', isTimed: false }
  ]);
  const [isLogged, setIsLogged] = useState(false);

  const handleDelete = (id: number) => {
    setSets(prevSets => {
      const filtered = prevSets.filter(set => set.id !== id);
      return filtered.map((set, index) => ({
        ...set,
        setNumber: index + 1
      }));
    });
  };

  const handleAddSet = () => {
    const lastSet = sets[sets.length - 1];
    const newSet: Set = {
      id: Date.now(),
      setNumber: sets.length + 1,
      reps: lastSet ? lastSet.reps : '8',
      weight: lastSet ? lastSet.weight : '0',
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

  return (
    <div style={{ 
      padding: '20px', 
      background: 'red', 
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      {/* exerciseDeets - Pure content wrapper with NO padding */}
      <div
        data-name="exerciseDeets"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: '100%',
          maxWidth: '600px'
        }}
      >
        {/* Exercise Header */}
        <ExerciseHeader
          exerciseName="Seated Banded Hip Flexor March"
          restNote="30 seconds rest between sets"
          cues="Loop band around foot and anchor it to stable object at ankle height, then sit tall and drive knee toward chest with controlled tempo, resisting band's pull on the way down. Keep core braced and avoid rocking torso backward."
        />

        {/* Sets */}
        {sets.map((set) => (
          <SetRow
            key={set.id}
            setNumber={set.setNumber}
            reps={set.reps}
            weight={set.weight}
            onDelete={() => handleDelete(set.id)}
            onRepsChange={(value) => handleRepsChange(set.id, value)}
            onWeightChange={(value) => handleWeightChange(set.id, value)}
            opacity={isLogged ? 0.6 : 1}
            isTimed={set.isTimed}
          />
        ))}

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '10px',
            width: '100%'
          }}
          data-name="action"
        >
          {/* Add Set Button */}
          <button
            onClick={handleAddSet}
            style={{
              border: '1px solid white',
              display: 'flex',
              height: '68px',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: '20px',
              paddingBottom: '20px',
              position: 'relative',
              borderRadius: '20px',
              flexShrink: 0,
              width: '100%',
              boxSizing: 'border-box',
              background: 'transparent',
              cursor: 'pointer'
            }}
            data-name="add set"
          >
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                lineHeight: '61.102px',
                fontStyle: 'normal',
                position: 'relative',
                flexShrink: 0,
                fontSize: '15px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                color: 'white',
                margin: 0,
                padding: 0
              }}
            >
              Add set
            </p>
          </button>

          {/* Log / Done Button */}
          <button
            onClick={handleLog}
            style={{
              backgroundColor: isLogged ? '#059F00' : 'white',
              display: 'flex',
              height: '68px',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: '20px',
              paddingBottom: '20px',
              position: 'relative',
              borderRadius: '20px',
              flexShrink: 0,
              width: '100%',
              boxSizing: 'border-box',
              border: 'none',
              cursor: 'pointer'
            }}
            data-name="log"
          >
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                lineHeight: '61.102px',
                fontStyle: 'normal',
                position: 'relative',
                flexShrink: 0,
                fontSize: '15px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                color: isLogged ? '#ffffff' : '#1e1e1e',
                margin: 0,
                padding: 0
              }}
            >
              {isLogged ? 'Done' : 'Log'}
            </p>
          </button>
        </div>

        {/* Notes Field */}
        <Notes onSave={(value) => console.log('Notes saved:', value)} />
      </div>
    </div>
  );
}

