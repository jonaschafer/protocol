'use client'

import { BaseLabeledContent } from './BaseLabeledContent'

interface WeekNotesProps {
  notes: string
}

export function WeekNotes({ notes }: WeekNotesProps) {
  return (
    <BaseLabeledContent
      label="Notes"
      content={notes}
      variant="read-only"
      contentFont="mono"
      paddingTop="14px"
      paddingBottom="26px"
      containerStyle={{
        height: '80px'
      }}
    />
  )
}

