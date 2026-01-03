'use client'

import { RunHeaderStatBox } from './RunHeaderStatBox'
import { WeekRunHeaderMilesBox } from './WeekRunHeaderMilesBox'
import { WeekNotes } from './WeekNotes'

interface WeekRunHeaderProps {
  milesCurrent: number | string;
  milesTotal: number | string;
  vert: number | string;
  notes?: string;
}

export function WeekRunHeader({ milesCurrent, milesTotal, vert, notes }: WeekRunHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        position: 'relative',
        width: '100%',
        flexShrink: 0
      }}
      data-name="weekRunHeader"
    >
      {/* Stats Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          position: 'relative',
          flexShrink: 0,
          width: '100%'
        }}
      >
        {/* Miles Box - Special case with slash */}
        <WeekRunHeaderMilesBox
          milesCurrent={milesCurrent}
          milesTotal={milesTotal}
        />

        {/* Vert Box - Uses RunHeaderStatBox */}
        <RunHeaderStatBox
          label="Vert"
          value={vert}
          width="flex"
        />
      </div>

      {/* Notes Section */}
      {notes && <WeekNotes notes={notes} />}
    </div>
  );
}

