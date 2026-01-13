import { PhaseOverview } from '../components/PhaseOverview';
import { fetchPhases, PhaseData } from '@/lib/supabase-data';
import { BottomNav } from '../components/BottomNav';

export default async function PhasesPage() {
  let phases: PhaseData[] = [];
  try {
    phases = await fetchPhases();
  } catch (error) {
    console.error('Error fetching phases:', error);
    phases = [];
  }

  // Fallback UI if no phases found
  if (!phases || phases.length === 0) {
    return (
      <div
        style={{
          background: '#000000',
          minHeight: '100vh',
          width: '100%',
          position: 'relative',
          paddingTop: '20px',
          paddingBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            maxWidth: '402px',
            padding: '40px 20px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)'
          }}
        >
          <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>No Wy'East Trailfest 50M Found</h2>
          <p style={{ marginBottom: '10px' }}>
            No active Wy'East Trailfest 50M was found in the database.
          </p>
          <p style={{ fontSize: '14px', opacity: 0.6 }}>
            Please run the seed script to populate the database.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#000000',
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        paddingTop: '20px',
        paddingBottom: '100px' // Extra padding for bottom nav
      }}
    >
      <PhaseOverview phases={phases} />
      <BottomNav />
    </div>
  );
}

