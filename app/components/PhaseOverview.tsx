'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhaseData, formatDateRange } from '../phases/phaseData';
import { WeekSummaryCard } from './WeekSummaryCard';

interface PhaseOverviewProps {
  phases: PhaseData[];
}

export function PhaseOverview({ phases }: PhaseOverviewProps) {
  const router = useRouter();
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(phaseId)) {
        newSet.delete(phaseId);
      } else {
        newSet.add(phaseId);
      }
      return newSet;
    });
  };

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
        overflow: 'visible',
        marginTop: '0',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}
    >
      {/* Header */}
      <div
        style={{
          width: '100%',
          height: '110px',
          padding: '0 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#272727',
          borderRadius: '30px 30px 0px 0px'
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
          Training Plan
        </p>
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
        {/* Phase Cards */}
        {phases.map((phase) => {
          const isExpanded = expandedPhases.has(phase.id);
          return (
            <div
              key={phase.id}
              style={{
                width: '100%',
                borderRadius: '20px',
                overflow: 'visible',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Sticky Wrapper: Phase Header + Date Range */}
              <div
                style={{
                  position: isExpanded ? 'sticky' : 'relative',
                  top: isExpanded ? '0' : 'auto',
                  zIndex: isExpanded ? 10 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  borderRadius: '20px 20px 0 0'
                }}
              >
                {/* Phase Header with Color - Clickable */}
                <button
                  onClick={() => togglePhase(phase.id)}
                  style={{
                    width: '100%',
                    padding: '28px 20px',
                    backgroundColor: phase.color,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderRadius: '20px 20px 0 0'
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
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
                    <p
                      style={{
                        fontFamily: 'Instrument Sans, sans-serif',
                        fontWeight: 500,
                        fontSize: '26px',
                        lineHeight: '26px',
                        color: 'white',
                        margin: 0,
                        padding: 0,
                        textAlign: 'right'
                      }}
                    >
                      {phase.weekStart}-{phase.weekEnd}
                    </p>
                  </div>
                </button>

                {/* Date Range */}
                <div
                  style={{
                    width: '100%',
                    padding: '28px 20px 28px',
                    backgroundColor: '#1E1E1E',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: isExpanded ? '0' : '0 0 20px 20px'
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: '15px',
                      lineHeight: 'normal',
                      color: 'white',
                      margin: 0,
                      padding: 0,
                      opacity: 0.5
                    }}
                  >
                    {formatDateRange(phase.startDate, phase.endDate)}
                  </p>
                </div>
              </div>

              {/* Phase Content - Weeks List */}
              {isExpanded && (
                <div
                  style={{
                    width: '100%',
                    backgroundColor: '#1E1E1E',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingBottom: '28px',
                    borderRadius: '0 0 20px 20px'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0',
                      width: '100%',
                      paddingTop: '18px',
                      paddingLeft: '20px',
                      paddingRight: '20px'
                    }}
                  >
                    {phase.weeks.map((week, index) => (
                      <WeekSummaryCard
                        key={week.weekNumber}
                        weekNumber={week.weekNumber}
                        startDate={week.startDate}
                        endDate={week.endDate}
                        totalMiles={week.totalMiles}
                        totalVert={week.totalVert}
                        phaseColor={phase.color}
                        onClick={() => handleWeekClick(week.weekNumber)}
                        isFirst={index === 0}
                        isLast={index === phase.weeks.length - 1}
                        hasColoredBorder={false}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

