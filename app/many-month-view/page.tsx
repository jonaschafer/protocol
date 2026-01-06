'use client'

import { MonthCalendarView } from '../components/MonthCalendarView';
import { BackButton } from '../components/BackButton';

export default function ManyMonthViewPage() {
  return (
    <div 
      style={{ 
        background: '#000000', 
        minHeight: '100vh',
        width: '100%',
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: '20px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '0 20px',
          pointerEvents: 'none'
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          <BackButton href="/" />
        </div>
      </div>
      <MonthCalendarView />
    </div>
  );
}



