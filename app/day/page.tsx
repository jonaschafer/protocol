'use client'

import { DayView } from '../exercises/dayView'
import { BottomNav } from '../components/BottomNav'

export default function DayPage() {
  // Sample data for testing
  const date = 'Sunday, Apr 4'
  const dayNumber = 13
  const category = 'Durability'

  return (
    <div 
      style={{ 
        background: '#272727', 
        minHeight: '100vh',
        width: '100%',
        paddingBottom: '100px' // Extra padding for bottom nav
      }}
    >
      <DayView 
        date={date}
        dayNumber={dayNumber}
        category={category}
      />
      <BottomNav />
    </div>
  )
}

