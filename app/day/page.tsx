'use client'

import { DayView } from '../exercises/dayView'

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
        width: '100%'
      }}
    >
      <DayView 
        date={date}
        dayNumber={dayNumber}
        category={category}
      />
    </div>
  )
}

