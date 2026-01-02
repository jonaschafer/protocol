'use client'

type Phase = 'durability' | 'specificity' | 'foundation';

interface DayHeaderProps {
  date: string; // e.g., "Sunday, Apr 4"
  dayNumber: number | string; // e.g., 13
  category?: string; // e.g., "Durability"
  phase?: Phase; // 'durability' | 'specificity' | 'foundation'
}

export function DayHeader({ date, dayNumber, category, phase = 'durability' }: DayHeaderProps) {
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
      className="w-full h-[110px] px-5 md:px-6 pt-7 relative"
      style={{ backgroundColor: config.bgColor }}
      data-name="dayHeader"
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
  );
}
