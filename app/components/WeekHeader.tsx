'use client'

import { BaseHeader } from './BaseHeader'

type Phase = 'durability' | 'specificity' | 'foundation'

interface WeekHeaderProps {
  weekNumber: number | string; // e.g., 13
  category?: string; // e.g., "Durability"
  phase?: Phase; // 'durability' | 'specificity' | 'foundation'
}

export function WeekHeader({ weekNumber, category, phase = 'durability' }: WeekHeaderProps) {
  return (
    <BaseHeader
      phase={phase}
      category={category}
      borderRadius="top"
    >
      {/* Week Number */}
      <div className="absolute left-5 top-7">
        <div className="text-white text-[26px] font-medium leading-[26px]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
          Week {weekNumber}
        </div>
      </div>
    </BaseHeader>
  )
}

