'use client'

import { BaseHeader } from './BaseHeader'

type Phase = 'durability' | 'specificity' | 'foundation'

interface DayHeaderProps {
  date: string; // e.g., "Sunday, Apr 4"
  dayNumber: number | string; // e.g., 13
  category?: string; // e.g., "Durability"
  phase?: Phase; // 'durability' | 'specificity' | 'foundation'
}

export function DayHeader({ date, dayNumber, category, phase = 'durability' }: DayHeaderProps) {
  return (
    <BaseHeader
      phase={phase}
      category={category}
      borderRadius="none"
      className="md:px-6 pt-7"
    >
      {/* Top row: Date and Day Number */}
      <div className="flex justify-between items-center">
        <div className="text-white text-[26px] font-medium leading-[26px]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
          {date}
        </div>
        <div className="text-white text-[26px] font-medium leading-[26px] text-right" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
          {dayNumber}
        </div>
      </div>
    </BaseHeader>
  )
}
