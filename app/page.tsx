import { PhaseOverview } from './components/PhaseOverview';
import { fetchPhases, PhaseData } from './phases/phaseData';

export default async function Home() {
  let phases: PhaseData[] = [];
  try {
    phases = await fetchPhases();
  } catch (error) {
    console.error('Error fetching phases:', error);
    // Fallback to empty array or show error state
    phases = [];
  }

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
