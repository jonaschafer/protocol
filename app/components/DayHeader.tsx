'use client'

interface DayHeaderProps {
  date: string; // e.g., "Sunday, Apr 4"
  dayNumber: number | string; // e.g., 13
  category?: string; // e.g., "Durability"
}

export function DayHeader({ date, dayNumber, category }: DayHeaderProps) {
  return (
    <div
      className="w-full h-[110px] bg-[#165DFC] px-5 md:px-6 pt-7 relative"
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
      {category && (
        <div className="mt-[9px]">
          <div className="inline-flex items-center justify-center px-[13px] h-[25px] rounded-full border border-white/50">
            <div className="text-white text-[13px] font-normal leading-[19.37px]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
              {category}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
