'use client'

import { BaseHeader } from './BaseHeader'

type Phase = 'durability' | 'specificity' | 'foundation'

interface PhaseHeaderProps {
  phaseName: string; // e.g., "Foundation"
  weekRange: string; // e.g., "1-12"
  phase?: Phase; // 'durability' | 'specificity' | 'foundation'
  category?: string; // Optional category override
  borderRadius?: 'none' | 'top'
  className?: string
}

export function PhaseHeader({ 
  phaseName, 
  weekRange, 
  phase = 'durability',
  category,
  borderRadius = 'none',
  className = ''
}: PhaseHeaderProps) {
  return (
    <BaseHeader
      phase={phase}
      category={category}
      borderRadius={borderRadius}
      className={className}
    >
      {/* Phase Name and Week Range */}
      <div className="flex justify-between items-center">
        <div className="text-white text-[26px] font-medium leading-[26px]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
          {phaseName}
        </div>
        <div className="text-white text-[26px] font-medium leading-[26px] text-right" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
          {weekRange}
        </div>
      </div>
    </BaseHeader>
  )
}
