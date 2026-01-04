'use client'

import { useRouter } from 'next/navigation';
import { BackButton } from './BackButton';
import { WeekSummaryCard } from './WeekSummaryCard';
import { PhaseData } from '../phases/phaseData';

interface PhaseDetailProps {
  phase: PhaseData;
  onBack: () => void;
}

export function PhaseDetail({ phase, onBack }: PhaseDetailProps) {
  const router = useRouter();

  const handleWeekClick = (weekNumber: number) => {
    router.push(`/week?week=${weekNumber}`);
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '402px',
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: '#272727',
        borderRadius: '30px',
        overflow: 'hidden',
        marginTop: '0',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}
    >
      {/* Header with phase color */}
      <div
        style={{
          width: '100%',
          height: '110px',
          padding: '0 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: phase.color
        }}
      >
        <p
          style={{
            fontFamily: 'Instrument Sans, sans-serif',
            fontWeight: 500,
            fontSize: '26px',
            lineHeight: '26px',
            color: 'white',
            margin: 0,
            padding: 0
          }}
        >
          {phase.name}
        </p>
        <div style={{ marginTop: '9px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 13px',
              height: '25px',
              borderRadius: '12.5px',
              border: '1px solid rgba(255, 255, 255, 0.5)'
            }}
          >
            <p
              style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '13px',
                fontWeight: 400,
                lineHeight: '19.37px',
                color: '#ffffff',
                margin: 0,
                padding: 0
              }}
            >
              Weeks {phase.weekStart}-{phase.weekEnd}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div
        style={{
          padding: '20px',
          paddingBottom: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {/* Back Button */}
        <BackButton onClick={onBack} />

        {/* Weeks List */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%'
          }}
        >
          {phase.weeks.map((week) => (
            <WeekSummaryCard
              key={week.weekNumber}
              weekNumber={week.weekNumber}
              startDate={week.startDate}
              endDate={week.endDate}
              totalMiles={week.totalMiles}
              totalVert={week.totalVert}
              phaseColor={phase.color}
              onClick={() => handleWeekClick(week.weekNumber)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

