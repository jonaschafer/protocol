'use client'

import { ReactNode } from 'react'

type Phase = 'durability' | 'specificity' | 'foundation'

interface BaseHeaderProps {
  phase?: Phase
  category?: string
  children: ReactNode
  borderRadius?: 'none' | 'top'
  className?: string
}

export function BaseHeader({
  phase = 'durability',
  category,
  children,
  borderRadius = 'none',
  className = ''
}: BaseHeaderProps) {
  // Determine colors and badge text based on phase
  const phaseConfig = {
    durability: {
      bgColor: '#165DFC',
      badgeText: category || 'Durability',
      badgeBorderColor: 'rgba(255, 255, 255, 0.5)',
      badgeTextColor: '#ffffff'
    },
    specificity: {
      bgColor: '#AC47FF',
      badgeText: category || 'Specificity',
      badgeBorderColor: 'rgba(255, 255, 255, 0.5)',
      badgeTextColor: '#ffffff'
    },
    foundation: {
      bgColor: '#FF474A',
      badgeText: category || 'Foundation',
      badgeBorderColor: 'rgba(255, 255, 255, 0.5)',
      badgeTextColor: '#ffffff'
    }
  }

  const config = phaseConfig[phase]

  const borderRadiusStyle = borderRadius === 'top' 
    ? { borderTopLeftRadius: '30px', borderTopRightRadius: '30px' }
    : {}

  return (
    <div
      className={`w-full h-[110px] px-5 flex flex-col justify-center ${className}`}
      style={{ 
        backgroundColor: config.bgColor,
        ...borderRadiusStyle
      }}
    >
      {children}
      
      {/* Category Badge */}
      <div className="mt-[9px]">
        <div 
          className="inline-flex items-center justify-center px-[13px] h-[25px] rounded-full border"
          style={{ borderColor: config.badgeBorderColor }}
        >
          <div 
            className="text-[13px] font-normal leading-[19.37px]" 
            style={{ 
              fontFamily: 'IBM Plex Mono, monospace',
              color: config.badgeTextColor
            }}
          >
            {config.badgeText}
          </div>
        </div>
      </div>
    </div>
  )
}

