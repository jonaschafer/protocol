'use client'

import { PhaseOverview } from './components/PhaseOverview';
import { phases } from './phases/phaseData';

export default function Home() {
  return (
    <div
      style={{
        background: '#000000',
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        paddingTop: '20px',
        paddingBottom: '20px'
      }}
    >
      <PhaseOverview phases={phases} />
    </div>
  );
}
