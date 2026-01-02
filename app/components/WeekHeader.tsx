'use client'

type Phase = 'durability' | 'specificity' | 'foundation';

interface WeekHeaderProps {
  weekNumber: number | string; // e.g., 13
  category?: string; // e.g., "Durability"
  phase?: Phase; // 'durability' | 'specificity' | 'foundation'
}

export function WeekHeader({ weekNumber, category, phase = 'durability' }: WeekHeaderProps) {
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
  };

  const config = phaseConfig[phase];

  return (
    <div
      className="w-full h-[110px] px-5 relative"
      style={{ 
        backgroundColor: config.bgColor,
        borderTopLeftRadius: '30px',
        borderTopRightRadius: '30px'
      }}
      data-name="weekHeader"
    >
      {/* Week Number */}
      <div className="absolute left-5 top-7">
        <div className="text-white text-[26px] font-medium leading-[26px]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
          Week {weekNumber}
        </div>
      </div>

      {/* Category Badge */}
      <div className="absolute left-5 top-[65px]">
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
  );
}

