'use client'

import { useState } from 'react'
import { SetRow } from './components/SetRow'
import { Notes } from './components/Notes'

export default function Home() {
  const [sets, setSets] = useState([
    { id: 1, setNumber: 1, reps: '8', weight: '145', isTimed: false },
    { id: 2, setNumber: 2, reps: '8', weight: '145', isTimed: false },
    { id: 3, setNumber: 3, reps: '8', weight: '145', isTimed: false },
    { id: 4, setNumber: 4, reps: '60', weight: '0', isTimed: true }
  ]);
  const [isLogged, setIsLogged] = useState(false);

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

  return (
    <div style={{ padding: '20px', background: '#000', minHeight: '100vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
          data-node-id="230:7071"
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
            data-node-id="230:7072"
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
              data-node-id="230:7073"
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
            data-node-id="230:7074"
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
              data-node-id="230:7075"
            >
              {isLogged ? 'Done' : 'Log'}
            </p>
          </button>
        </div>

        {/* Notes Field */}
        <Notes onSave={(value) => console.log('Notes saved:', value)} />
      </div>
    </div>
  )
}

