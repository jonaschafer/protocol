'use client'

import { WeekView } from './components/WeekView';

export default function Home() {
  const days = [
    {
      dayName: 'Monday',
      runInfo: '3 miles',
      hasPT: true,
      ptType: 'PT',
      intensity: 'Rest'
    },
    {
      dayName: 'Tuesday',
      runInfo: '6 miles',
      vert: '1500',
      hasPT: true,
      ptType: 'Heavy',
      intensity: 'TTT'
    },
    {
      dayName: 'Wednesday',
      runInfo: '4 miles',
      hasPT: true,
      ptType: 'PT',
      intensity: 'Easy'
    },
    {
      dayName: 'Thursday',
      runInfo: '5 miles',
      zone: 'Z3',
      hasPT: true,
      ptType: 'Heavy',
      intensity: 'Hard'
    },
    {
      dayName: 'Friday',
      runInfo: '7 miles',
      hasPT: true,
      ptType: 'PT',
      intensity: 'Easy'
    },
    {
      dayName: 'Saturday',
      runInfo: 'Row',
      hasPT: true,
      ptType: 'PT',
      intensity: 'Rest'
    },
    {
      dayName: 'Sunday',
      runInfo: '18 miles',
      vert: '2600',
      intensity: 'Long'
    }
  ];

  return (
    <div 
      style={{ 
        background: '#000000', 
        minHeight: '100vh',
        width: '100%',
        position: 'relative'
      }}
    >
      <WeekView
        weekNumber={13}
        category="Durability"
        phase="durability"
        milesCurrent={0}
        milesTotal={18}
        vert={2500}
        notes="Start conservative, establish PT habit"
        days={days}
      />
    </div>
  );
}
