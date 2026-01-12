'use client'

import { MonthCalendarView } from '../components/MonthCalendarView';
import { BottomNav } from '../components/BottomNav';

export default function ManyMonthViewPage() {
  return (
    <div 
      style={{ 
        background: '#000000', 
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        paddingBottom: '100px' // Extra padding for bottom nav
      }}
    >
      <MonthCalendarView />
      <BottomNav />
    </div>
  );
}



