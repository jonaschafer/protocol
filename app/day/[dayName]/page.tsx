'use client'

import { useParams } from 'next/navigation'
import { DayView } from '../../exercises/dayView'
import { BackButton } from '../../components/BackButton'
import { dayData } from '../../data/dayData'

export default function DayPage() {
  const params = useParams()
  const dayName = params?.dayName as string
  
  // Get data for this day, default to Sunday if not found
  const dayInfo = dayData[dayName?.toLowerCase()] || dayData.sunday

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
          <BackButton href="/week" />
        </div>
      </div>
      <DayView 
        date={dayInfo.date}
        dayNumber={dayInfo.dayNumber}
        category={dayInfo.category}
        runData={dayInfo.runData}
        exercises={dayInfo.exercises}
      />
    </div>
  )
}
