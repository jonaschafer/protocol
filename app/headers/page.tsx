'use client'

import { DayHeader } from '../components/DayHeader'
import { useState, useEffect } from 'react'

// Helper function to generate random date
function getRandomDate(): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  const day = days[Math.floor(Math.random() * days.length)]
  const month = months[Math.floor(Math.random() * months.length)]
  const date = Math.floor(Math.random() * 28) + 1 // 1-28 to avoid month-end issues
  
  return `${day}, ${month} ${date}`
}

// Helper function to generate random day number
function getRandomDayNumber(): number {
  return Math.floor(Math.random() * 30) + 1 // 1-30
}

export default function HeadersPage() {
  const [durabilityData, setDurabilityData] = useState({ date: '', dayNumber: 0 })
  const [specificityData, setSpecificityData] = useState({ date: '', dayNumber: 0 })
  const [foundationData, setFoundationData] = useState({ date: '', dayNumber: 0 })

  // Initialize with random data
  useEffect(() => {
    setDurabilityData({ date: getRandomDate(), dayNumber: getRandomDayNumber() })
    setSpecificityData({ date: getRandomDate(), dayNumber: getRandomDayNumber() })
    setFoundationData({ date: getRandomDate(), dayNumber: getRandomDayNumber() })
  }, [])

  // Function to randomize all headers
  const randomizeAll = () => {
    setDurabilityData({ date: getRandomDate(), dayNumber: getRandomDayNumber() })
    setSpecificityData({ date: getRandomDate(), dayNumber: getRandomDayNumber() })
    setFoundationData({ date: getRandomDate(), dayNumber: getRandomDayNumber() })
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#272727',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px'
    }}>
      <button
        onClick={randomizeAll}
        style={{
          padding: '12px 24px',
          backgroundColor: '#165DFC',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontFamily: 'Instrument Sans, sans-serif',
          cursor: 'pointer',
          marginBottom: '10px'
        }}
      >
        Randomize All
      </button>

      <div style={{ 
        width: '100%', 
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Durability Header */}
        <div style={{ borderRadius: '30px', overflow: 'hidden' }}>
          <DayHeader
            date={durabilityData.date}
            dayNumber={durabilityData.dayNumber}
            phase="durability"
          />
        </div>

        {/* Specificity Header */}
        <div style={{ borderRadius: '30px', overflow: 'hidden' }}>
          <DayHeader
            date={specificityData.date}
            dayNumber={specificityData.dayNumber}
            phase="specificity"
          />
        </div>

        {/* Foundation Header */}
        <div style={{ borderRadius: '30px', overflow: 'hidden' }}>
          <DayHeader
            date={foundationData.date}
            dayNumber={foundationData.dayNumber}
            phase="foundation"
          />
        </div>
      </div>
    </div>
  )
}

