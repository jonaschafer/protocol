'use client'

import { BaseLabeledContent } from './BaseLabeledContent'

interface CuesContentProps {
  cues: string
}

export function CuesContent({ cues }: CuesContentProps) {
  return (
    <BaseLabeledContent
      label="Cues"
      content={cues}
      variant="read-only"
      contentFont="mono"
      paddingTop="14px"
      paddingBottom="0"
      containerStyle={{
        overflow: 'clip',
        paddingRight: '16px'
      }}
    />
  )
}

